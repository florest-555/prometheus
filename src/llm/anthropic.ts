import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type { CompletionRequest, CompletionResponse, Content, LlmDriver, MessageRole, StopReason, StreamEvent, ToolCall,Usage } from '../types/agent/index.js';
import { LlmError } from '../types/agent/index.js';

export class AnthropicDriver implements LlmDriver {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://api.anthropic.com';
    this.client = axios.create({ baseURL: this.baseUrl, timeout: 120000, headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01' } });
  }

  private mapRole(role: MessageRole): string { return role === 'system' ? 'user' : role === 'tool' ? 'user' : role; }
  private mapContent(content: Content): Array<Record<string, unknown>> | string {
    if (typeof content === 'string') return [{ type: 'text', text: content }];
    if (Array.isArray(content)) {
      return content.map((p) => {
        switch (p.type) {
          case 'text': return { type: 'text', text: p.text };
          case 'image': {
            if (!p.url) return { type: 'text', text: '[Image: missing URL]' };
            return p.url.startsWith('data:') ? (() => { const parts = p.url.split(','); return parts.length === 2 ? { type: 'image', source: { type: 'base64', media_type: parts[0].replace('data:', '').replace(';base64', ''), data: parts[1] } } : { type: 'text', text: '' }; })() : { type: 'text', text: `[Image: ${p.url}]` };
          }
          case 'tool_use': return { type: 'tool_use', id: p.id, name: p.name, input: p.input };
          case 'tool_result': return { type: 'tool_result', tool_use_id: p.tool_use_id, content: p.content };
        }
      });
    }
    return content;
  }

  private buildRequestBody(request: CompletionRequest, stream: boolean): Record<string, unknown> {
    const messages = request.messages.filter((m) => m.role !== 'system').map((m) => ({ role: this.mapRole(m.role), content: this.mapContent(m.content) }));
    const body: Record<string, unknown> = { model: request.model, messages, max_tokens: request.max_tokens || 4096, stream };
    if (request.system) body.system = [{ type: 'text', text: request.system }];
    if (request.temperature) body.temperature = request.temperature;
    if (request.tools) body.tools = request.tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema }));
    return body;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    try {
      const response = await this.client.post('/v1/messages', this.buildRequestBody(request, false));
      return this.parseResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.error?.message || error.message;
        if (status === 429) throw LlmError.rateLimited();
        if (status === 529) throw LlmError.overloaded();
        throw LlmError.api(status, message);
      }
      throw LlmError.other(String(error));
    }
  }

  async stream(request: CompletionRequest, onEvent: (event: StreamEvent) => void): Promise<CompletionResponse> {
    const response = await this.client.post('/v1/messages', this.buildRequestBody(request, true), { responseType: 'stream' });
    let fullContent = '';
    const toolCalls: ToolCall[] = [];
    let currentToolInput = '';
    let currentToolId = '';
    let currentToolName = '';
    let inToolUse = false;
    let stopReason: StopReason = 'end_turn';
    const usage: Usage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const dataStr = line.slice(6);
        if (!dataStr) continue;
        try {
          const event = JSON.parse(dataStr);
          switch (event.type) {
            case 'message_start': usage.input_tokens = event.message?.usage?.input_tokens || 0; usage.output_tokens = event.message?.usage?.output_tokens || 0; break;
            case 'content_block_delta':
              if (event.delta?.text) { fullContent += event.delta.text; onEvent({ type: 'text_delta', text: event.delta.text }); }
              if (event.delta?.partial_json) currentToolInput += event.delta.partial_json;
              break;
            case 'content_block_start':
              if (event.content_block?.type === 'tool_use') { inToolUse = true; currentToolId = event.content_block.id || ''; currentToolName = event.content_block.name || ''; currentToolInput = ''; onEvent({ type: 'tool_use_start', id: currentToolId, name: currentToolName }); }
              break;
            case 'content_block_stop':
              if (inToolUse) { toolCalls.push({ id: currentToolId, name: currentToolName, input: currentToolInput ? JSON.parse(currentToolInput) : {} }); inToolUse = false; }
              break;
            case 'message_delta': if (event.delta?.usage?.output_tokens) usage.output_tokens = event.delta.usage.output_tokens; if (event.delta?.stop_reason) stopReason = event.delta.stop_reason === 'end_turn' ? 'end_turn' : event.delta.stop_reason === 'max_tokens' ? 'max_tokens' : 'tool_use'; break;
            case 'message_stop': onEvent({ type: 'done' }); break;
          }
        } catch { /* ignore */ }
      }
    }
    usage.total_tokens = usage.input_tokens + usage.output_tokens;
    return { content: fullContent ? [{ text: fullContent }] : [], stop_reason: stopReason, tool_calls: toolCalls, usage };
  }

  private parseResponse(data: Record<string, unknown>): CompletionResponse {
    const stopReason = data.stop_reason === 'end_turn' ? 'end_turn' : data.stop_reason === 'max_tokens' ? 'max_tokens' : data.stop_reason === 'tool_use' ? 'tool_use' : 'end_turn';
    const contentBlocks = data.content as Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }> | undefined;
    const content: { text?: string; tool_use?: { id: string; name: string; input: Record<string, unknown> } }[] = [];
    if (contentBlocks) {
      for (const block of contentBlocks) {
        if (block.type === 'text' && block.text) content.push({ text: block.text });
        else if (block.type === 'tool_use') content.push({ tool_use: { id: block.id || '', name: block.name || '', input: block.input || {} } });
      }
    }
    const toolCalls: ToolCall[] = content.filter((c): c is { tool_use: { id: string; name: string; input: Record<string, unknown> } } => c.tool_use !== undefined).map((c) => c.tool_use);
    const usageData = data.usage as Record<string, unknown> | undefined;
    const usage: Usage = { input_tokens: (usageData?.input_tokens as number) || 0, output_tokens: (usageData?.output_tokens as number) || 0, total_tokens: ((usageData?.input_tokens as number) || 0) + ((usageData?.output_tokens as number) || 0) };
    return { content, stop_reason: stopReason, tool_calls: toolCalls, usage };
  }
}
