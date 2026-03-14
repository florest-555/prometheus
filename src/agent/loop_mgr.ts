import type { AgentContext, AgentEvent, AgentResponse,AgentRuntimeConfig, CompletionRequest, Content, ContentPart, LlmDriver, Message, MessageRole, StreamEvent, ToolCall } from '@';
import { DEFAULT_RUNTIME } from '@';
import type { ToolRegistry } from '@agent/tools/registry.js';

export type { AgentContext, AgentEvent, AgentResponse,AgentRuntimeConfig };
export { DEFAULT_RUNTIME };

export class AgentLoop {
  private context: AgentContext; private messages: Message[] = []; private tools: ToolRegistry; private shutdownFlag: boolean = false;
  constructor(context: AgentContext, tools: ToolRegistry) { this.context = context; this.tools = tools; }
  shutdown(): void { this.shutdownFlag = true; }
  addMessage(role: MessageRole, content: Content): void { this.messages.push({ role, content }); }
  getMessages(): Message[] { return [...this.messages]; }
  clearMessages(): void { this.messages = []; }

  private mapStreamEvent(event: StreamEvent, onEvent: (event: AgentEvent) => void): void {
    switch (event.type) {
      case 'text_delta': onEvent({ type: 'text_delta', text: event.text }); break;
      case 'tool_use_start': onEvent({ type: 'tool_use_start', id: event.id, name: event.name }); break;
      case 'tool_input_delta': /* handled in process loop */ break;
      case 'done': onEvent({ type: 'done' }); break;
      case 'error': onEvent({ type: 'error', error: event.error }); break;
      default: break;
    }
  }

  async run(driver: LlmDriver, userMessage: string, onEvent: (event: AgentEvent) => void): Promise<AgentResponse> {
    if (userMessage) this.addMessage('user', userMessage);
    for (let i = 0; i < this.context.runtime.maxIterations; i++) {
      if (this.shutdownFlag) break;
      const request = this.buildRequest();
      const events: StreamEvent[] = [];
      const eventHandler = (event: StreamEvent) => { events.push(event); this.mapStreamEvent(event, onEvent); };
      await driver.stream(request, eventHandler);
      let fullText = ''; const toolCalls: ToolCall[] = []; let stopReason = 'end_turn'; let streamError: string | null = null;
      for (const event of events) {
        switch (event.type) {
          case 'text_delta': fullText += event.text; break;
          case 'tool_use_start': toolCalls.push({ id: event.id, name: event.name, input: {} }); break;
          case 'tool_input_delta':
        if (toolCalls.length > 0 && toolCalls[toolCalls.length - 1].id === event.id) {
          const lastToolCall = toolCalls[toolCalls.length - 1];
          Object.assign(lastToolCall.input, event.delta);
        }
        break;
          case 'done': stopReason = toolCalls.length > 0 ? 'tool_use' : 'end_turn'; if (toolCalls.length === 0) onEvent({ type: 'done' }); break;
          case 'error': streamError = event.error; onEvent({ type: 'error', error: event.error }); break;
        }
      }
      if (streamError) throw new AgentError('llm', streamError);
      if (!fullText && toolCalls.length === 0) { if (i >= this.context.runtime.maxRetries - 1) throw new AgentError('other', 'No response from LLM'); continue; }
      switch (stopReason) {
        case 'end_turn': this.addMessage('assistant', fullText); onEvent({ type: 'response', message: fullText }); return { message: fullText, toolCalls: [] };
        case 'tool_use': {
          const parts: ContentPart[] = []; if (fullText) parts.push({ type: 'text', text: fullText });
          for (const tc of toolCalls) parts.push({ type: 'tool_use', id: tc.id, name: tc.name, input: tc.input });
          if (parts.length > 0) this.addMessage('assistant', parts);
          for (const toolCall of toolCalls) {
            onEvent({ type: 'tool_call', name: toolCall.name, input: toolCall.input });
            try { const result = await this.tools.execute(toolCall.name, toolCall.input); const resultText = typeof result === 'string' ? result : JSON.stringify(result, null, 2); this.addMessage('tool', [{ type: 'tool_result', tool_use_id: toolCall.id, content: resultText }]); onEvent({ type: 'tool_result', toolUseId: toolCall.id, result: resultText }); }
            catch (e) { const err = `Error: ${e instanceof Error ? e.message : String(e)}`; this.addMessage('tool', [{ type: 'tool_result', tool_use_id: toolCall.id, content: err }]); onEvent({ type: 'tool_result', toolUseId: toolCall.id, result: err }); }
          }
          break;
        }
        case 'max_tokens': this.addMessage('assistant', `${fullText  }\n\nPlease continue.`); onEvent({ type: 'continue' }); break;
      }
    }
    throw new AgentError('max_iterations', `Max iterations: ${this.context.runtime.maxIterations}`);
  }

  private buildRequest(): CompletionRequest {
    const tools = this.tools.list();
    const ollamaNumCtx = this.context.provider === 'ollama' ? this.context.runtime.ollamaNumCtx : undefined;
    const ollamaNumThread = this.context.provider === 'ollama' ? this.context.runtime.ollamaNumThread : undefined;
    const ollamaNumGpu = this.context.provider === 'ollama' ? this.context.runtime.ollamaNumGpu : undefined;

    return {
      model: this.context.model,
      messages: this.messages,
      tools: tools.length > 0 ? tools : undefined,
      max_tokens: this.context.runtime.maxTokens,
      temperature: this.context.runtime.temperature,
      system: this.context.systemPrompt,
      stream: true,
      ollama_num_ctx: ollamaNumCtx,
      ollama_num_thread: ollamaNumThread,
      ollama_num_gpu: ollamaNumGpu
    };
  }
}

export class AgentError extends Error {
  constructor(public type: 'llm' | 'tool' | 'max_iterations' | 'other', message: string) { super(message); this.name = 'AgentError'; }
}
