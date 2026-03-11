import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

import type { CompletionRequest, CompletionResponse, Content, ContentPart, LlmDriver, MessageRole, StopReason, StreamEvent, ToolCall,Usage } from '../types/agent/index.js';
import { LlmError } from '../types/agent/index.js';

const execAsync = promisify(exec);

export class OllamaDriver implements LlmDriver {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
    this.client = axios.create({ baseURL: this.baseUrl, timeout: 120000 });
  }

  private isLocalUrl(): boolean {
    try { const url = new URL(this.baseUrl); return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1'; } catch { return false; }
  }

  private async ensureReady(): Promise<void> {
    if (!this.isLocalUrl()) throw LlmError.other('Ollama requires local endpoint (http://localhost:11434)');
    try { await execAsync('ollama --version'); } catch { throw LlmError.other('Ollama binary not found'); }
    try { await this.client.get('/api/tags'); } catch { throw LlmError.other('Ollama daemon not responding'); }
  }

  private mapRole(role: MessageRole): string { return role; }
  private mapContent(content: Content): string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.filter((p): p is ContentPart => p.type === 'text').map((p) => p.text).filter((t): t is string => t !== undefined).join('\n');
    return String(content);
  }

  private buildRequestBody(request: CompletionRequest, stream: boolean): Record<string, unknown> {
    const body: Record<string, unknown> = { model: request.model, messages: request.messages.map((m) => ({ role: this.mapRole(m.role), content: this.mapContent(m.content) })), stream };
    if (request.max_tokens || request.temperature || request.system || request.ollama_num_ctx || request.ollama_num_thread || request.ollama_num_gpu) {
      const options: Record<string, unknown> = {};
      if (request.max_tokens) options.num_predict = request.max_tokens;
      if (request.temperature) options.temperature = request.temperature;
      if (request.system) options.system = request.system;
      if (request.ollama_num_ctx) options.num_ctx = request.ollama_num_ctx;
      if (request.ollama_num_thread) options.num_thread = request.ollama_num_thread;
      if (request.ollama_num_gpu) options.num_gpu = request.ollama_num_gpu;
      body.options = options;
    }
    if (request.tools) body.tools = request.tools.map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.input_schema } }));
    return body;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    await this.ensureReady();
    const response = await this.client.post('/api/chat', this.buildRequestBody(request, false));
    return this.parseResponse(response.data);
  }

  async stream(request: CompletionRequest, onEvent: (event: StreamEvent) => void): Promise<CompletionResponse> {
    await this.ensureReady();
    const response = await this.client.post('/api/chat', this.buildRequestBody(request, true), { responseType: 'stream' });
    let fullContent = '';
    const toolCalls: ToolCall[] = [];
    let currentToolCall: ToolCall | null = null;
    let stopReason: StopReason = 'end_turn';
    const usage: Usage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) { fullContent += data.message.content; onEvent({ type: 'text_delta', text: data.message.content }); }
          if (data.message?.tool_calls) {
            for (const call of data.message.tool_calls) {
              const id = call.id || crypto.randomUUID();
              const name = call.function?.name || '';
              const args = call.function?.arguments?.toString() || '';
              if (currentToolCall && currentToolCall.id === id) { if (args) { try { currentToolCall.input = { ...currentToolCall.input, ...JSON.parse(args) }; } catch { /* ignore */ } } }
              else { currentToolCall = { id, name, input: args ? JSON.parse(args) : {} }; onEvent({ type: 'tool_use_start', id, name }); }
            }
          }
          if (data.done) { usage.input_tokens = data.prompt_eval_count || 0; usage.output_tokens = data.eval_count || 0; usage.total_tokens = (data.prompt_eval_count || 0) + (data.eval_count || 0); if (currentToolCall) { toolCalls.push(currentToolCall); stopReason = 'tool_use'; } onEvent({ type: 'done' }); break; }
        } catch { /* ignore */ }
      }
    }
    return { content: fullContent ? [{ text: fullContent }] : [], stop_reason: stopReason, tool_calls: toolCalls, usage };
  }

  private parseResponse(data: Record<string, unknown>): CompletionResponse {
    const message = data.message as Record<string, unknown> | undefined;
    const content = message?.content ? [{ text: message.content as string }] : [];
    const toolCalls: ToolCall[] = [];
    if (message?.tool_calls && Array.isArray(message.tool_calls)) {
      for (const call of message.tool_calls as Array<{ id?: string; function: { name?: string; arguments: unknown } }>) {
        toolCalls.push({ id: call.id || crypto.randomUUID(), name: call.function.name || '', input: call.function.arguments as Record<string, unknown> });
      }
    }
    const stopReason = toolCalls.length > 0 ? 'tool_use' : 'end_turn';
    const usage: Usage = { input_tokens: (data.prompt_eval_count as number) || 0, output_tokens: (data.eval_count as number) || 0, total_tokens: ((data.prompt_eval_count as number) || 0) + ((data.eval_count as number) || 0) };
    return { content, stop_reason: stopReason, tool_calls: toolCalls, usage };
  }
}
