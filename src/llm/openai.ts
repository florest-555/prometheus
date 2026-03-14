import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type {
  CompletionRequest,
  CompletionResponse,
  Content,
  ContentPart,
  LlmDriver,
  MessageRole,
  StopReason,
  StreamEvent,
  ToolCall,
  Usage,
} from '@';
import { LlmError } from '@';

export class OpenAiDriver implements LlmDriver {
  private client: AxiosInstance;
  private provider: string;
  private apiKey?: string;
  private baseUrl: string;

  constructor(provider: string, apiKey?: string, baseUrl?: string) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || this.getDefaultBaseUrl(provider);
    this.baseUrl = this.normalizeBaseUrl(provider, this.baseUrl);

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private getDefaultBaseUrl(provider: string): string {
    switch (provider) {
      case 'groq': return 'https://api.groq.com/openai/v1';
      case 'deepseek': return 'https://api.deepseek.com/v1';
      case 'together': return 'https://api.together.ai/v1';
      case 'lmstudio': return 'http://localhost:1234/v1';
      case 'llamafile': return 'http://localhost:8080/v1';
      default: return 'https://api.openai.com/v1';
    }
  }

  private normalizeBaseUrl(provider: string, baseUrl: string): string {
    const normalized = baseUrl.replace(/\/$/, '');
    const v1Providers = ['openai', 'groq', 'deepseek', 'together', 'lmstudio', 'llamafile'];
    if (v1Providers.includes(provider) && !normalized.endsWith('/v1')) {
      return `${normalized}/v1`;
    }
    return normalized;
  }

  private isLocal(): boolean {
    return ['ollama', 'lmstudio', 'llamafile', 'llama.cpp'].includes(this.provider);
  }

  private mapRole(role: MessageRole): string {
    return role;
  }

  private mapContent(content: Content): Array<Record<string, unknown>> | string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      if (this.isLocal()) {
        return content.filter((p): p is ContentPart => p.type === 'text').map((p) => p.text).filter((t): t is string => t !== undefined).join('\n');
      }
      return content.map((p) => {
        switch (p.type) {
          case 'text': return { type: 'text', text: p.text };
          case 'image': return { type: 'image_url', image_url: { url: p.url } };
          case 'tool_use': return { type: 'tool_use', id: p.id, name: p.name, input: p.input };
          case 'tool_result': return { type: 'tool_result', tool_use_id: p.tool_use_id, content: p.content };
        }
      });
    }
    return content;
  }

  private buildRequestBody(request: CompletionRequest): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: request.model,
      messages: request.messages.map((m) => ({ role: this.mapRole(m.role), content: this.mapContent(m.content) })),
    };
    if (request.stream) { body.stream = true; body.stream_options = { include_usage: true }; }
    if (request.max_tokens) body.max_tokens = request.max_tokens;
    if (request.temperature) body.temperature = request.temperature;
    if (request.system) body.system = request.system;
    if (request.tools) body.tools = request.tools.map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.input_schema } }));
    return body;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;
      const response = await this.client.post('/chat/completions', this.buildRequestBody(request), { headers });
      return this.parseResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.error?.message || error.message;
        if (status === 404) throw LlmError.modelNotFound(message);
        if (status === 429) throw LlmError.rateLimited();
        throw LlmError.api(status, message);
      }
      throw LlmError.other(String(error));
    }
  }

  async stream(request: CompletionRequest, onEvent: (event: StreamEvent) => void): Promise<CompletionResponse> {
    const body = this.buildRequestBody(request);
    body.stream = true;
    const headers: Record<string, string> = {};
    if (this.apiKey) headers['Authorization'] = `Bearer ${this.apiKey}`;

    const response = await this.client.post('/chat/completions', body, { headers, responseType: 'stream' });
    let fullContent = '';
    const toolCalls: ToolCall[] = [];
    let currentToolCall: ToolCall | null = null;
    let stopReason: StopReason = 'end_turn';
    const usage: Usage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const dataStr = line.slice(6);
        if (dataStr === '[DONE]') { onEvent({ type: 'done' }); break; }
        try {
          const data = JSON.parse(dataStr);
          if (data.usage) { usage.input_tokens = data.usage.prompt_tokens || 0; usage.output_tokens = data.usage.completion_tokens || 0; usage.total_tokens = data.usage.total_tokens || 0; }
          const choice = data.choices?.[0];
          if (choice?.delta?.content) { fullContent += choice.delta.content; onEvent({ type: 'text_delta', text: choice.delta.content }); }
          if (choice?.delta?.tool_calls) {
            for (const call of choice.delta.tool_calls) {
              const id = call.id || '';
              const name = call.function?.name || '';
              const args = call.function?.arguments || '';
              if (currentToolCall && (currentToolCall.id === id || !id)) {
                if (args) { try { currentToolCall.input = { ...currentToolCall.input, ...JSON.parse(args) }; } catch { /* ignore */ } }
              } else if (id || name) {
                currentToolCall = { id, name, input: args ? JSON.parse(args) : {} };
                if (id) onEvent({ type: 'tool_use_start', id, name });
              }
            }
          }
          if (choice?.finish_reason) {
            if (currentToolCall) { toolCalls.push(currentToolCall); currentToolCall = null; }
            stopReason = choice.finish_reason === 'stop' ? 'end_turn' : choice.finish_reason === 'length' ? 'max_tokens' : choice.finish_reason === 'tool_calls' ? 'tool_use' : 'end_turn';
            if (fullContent || toolCalls.length > 0) onEvent({ type: 'done' });
            break;
          }
        } catch { /* ignore */ }
      }
    }
    return { content: fullContent ? [{ text: fullContent }] : [], stop_reason: stopReason, tool_calls: toolCalls, usage };
  }

  private parseResponse(data: Record<string, unknown>): CompletionResponse {
    const choices = data.choices as Array<Record<string, unknown>> | undefined;
    const choice = choices && choices.length > 0 ? choices[0] : undefined;
    const stopReason = choice?.finish_reason === 'stop' ? 'end_turn' : choice?.finish_reason === 'length' ? 'max_tokens' : choice?.finish_reason === 'tool_calls' ? 'tool_use' : 'end_turn';
    const message = choice?.message as Record<string, unknown> | undefined;
    const content = message?.content ? [{ text: message.content as string }] : [];
    const toolCalls: ToolCall[] = [];
    if (message?.tool_calls) {
      for (const call of message.tool_calls as Array<{ id: string; function: { name: string; arguments: string } }>) {
        toolCalls.push({ id: call.id, name: call.function.name, input: JSON.parse(call.function.arguments || '{}') });
      }
    }
    const usageData = data.usage as Record<string, unknown> | undefined;
    const usage: Usage = { input_tokens: (usageData?.prompt_tokens as number) || 0, output_tokens: (usageData?.completion_tokens as number) || 0, total_tokens: (usageData?.total_tokens as number) || 0 };
    return { content, stop_reason: stopReason, tool_calls: toolCalls, usage };
  }
}
