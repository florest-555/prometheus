import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type { CompletionRequest, CompletionResponse, Content, ContentPart, LlmDriver, MessageRole, StopReason, StreamEvent, Usage } from '../types/agent/index.js';
import { LlmError } from '../types/agent/index.js';

export class GeminiDriver implements LlmDriver {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://generativelanguage.googleapis.com';
    this.client = axios.create({ baseURL: this.baseUrl, timeout: 120000, headers: { 'Content-Type': 'application/json' } });
  }

  private mapRole(role: MessageRole): string { return role === 'system' ? 'user' : role === 'assistant' ? 'model' : role === 'tool' ? 'user' : 'user'; }
  private mapContent(content: Content): string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.filter((p): p is ContentPart => p.type === 'text').map((p) => p.text).filter((t): t is string => t !== undefined).join('\n');
    return String(content);
  }

  private buildRequestBody(request: CompletionRequest): Record<string, unknown> {
    const contents = request.messages.map((m) => ({ role: this.mapRole(m.role), parts: [{ text: this.mapContent(m.content) }] }));
    const body: Record<string, unknown> = { contents, generationConfig: {} };
    if (request.max_tokens) (body.generationConfig as Record<string, unknown>).maxOutputTokens = request.max_tokens;
    if (request.temperature) (body.generationConfig as Record<string, unknown>).temperature = request.temperature;
    if (request.system) body.systemInstruction = { role: 'user', parts: [{ text: request.system }] };
    return body;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    try {
      const response = await this.client.post(`/v1beta/models/${request.model}:generateContent?key=${this.apiKey}`, this.buildRequestBody(request));
      return this.parseResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw LlmError.api(error.response.status, error.response.data?.error?.message || error.message);
      throw LlmError.other(String(error));
    }
  }

  async stream(request: CompletionRequest, onEvent: (event: StreamEvent) => void): Promise<CompletionResponse> {
    const response = await this.client.post(`/v1beta/models/${request.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`, this.buildRequestBody(request), { responseType: 'stream' });
    let fullContent = '';
    let stopReason: StopReason = 'end_turn';
    const usage: Usage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try { const data = JSON.parse(line.slice(6)); if (data.candidates?.[0]?.content?.parts?.[0]?.text) { fullContent += data.candidates[0].content.parts[0].text; onEvent({ type: 'text_delta', text: data.candidates[0].content.parts[0].text }); } if (data.candidates?.[0]?.finishReason) stopReason = data.candidates[0].finishReason === 'STOP' ? 'end_turn' : 'max_tokens'; } catch { /* ignore */ }
      }
    }
    onEvent({ type: 'done' });
    return { content: fullContent ? [{ text: fullContent }] : [], stop_reason: stopReason, tool_calls: [], usage };
  }

  private parseResponse(data: Record<string, unknown>): CompletionResponse {
    const candidate = (data.candidates as Array<Record<string, unknown>>)?.[0];
    const parts = (candidate?.content as Record<string, unknown>)?.parts as Array<{ text?: string }> | undefined;
    let fullContent = '';
    if (parts && Array.isArray(parts)) for (const part of parts) if (part.text) fullContent += part.text;
    const stopReason = candidate?.finishReason === 'STOP' ? 'end_turn' : candidate?.finishReason === 'MAX_TOKENS' ? 'max_tokens' : 'end_turn';
    return { content: fullContent ? [{ text: fullContent }] : [], stop_reason: stopReason, tool_calls: [], usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 } };
  }
}
