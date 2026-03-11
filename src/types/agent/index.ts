// Proveniência e Autoria: Este arquivo integra o projeto Egocentric (licença MIT-0).
// Nada aqui implica cessão de direitos morais/autorais.

export interface Message {
  role: MessageRole;
  content: Content;
}

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export type Content = string | ContentPart[];

export interface ContentPart {
  type: 'text' | 'image' | 'tool_use' | 'tool_result';
  text?: string;
  url?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: string;
}

export interface CompletionRequest {
  model: string;
  messages: Message[];
  tools?: Tool[];
  max_tokens?: number;
  temperature?: number;
  system?: string;
  stream: boolean;
  ollama_num_ctx?: number;
  ollama_num_thread?: number;
  ollama_num_gpu?: number;
}

export interface CompletionResponse {
  content: ContentBlock[];
  stop_reason: StopReason;
  tool_calls: ToolCall[];
  usage: Usage;
}

export interface ContentBlock {
  text?: string;
  tool_use?: ToolUseBlock;
}

export interface ToolUseBlock {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export type StopReason = 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use';

export interface Usage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface Tool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ToolResult {
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export type StreamEvent =
  | { type: 'text_delta'; text: string }
  | { type: 'tool_use_start'; id: string; name: string }
  | { type: 'tool_input_delta'; id: string; delta: Record<string, unknown> }
  | { type: 'tool_use_end'; id: string }
  | { type: 'content_complete' }
  | { type: 'done' }
  | { type: 'error'; error: string };

export interface LlmDriver {
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  stream(request: CompletionRequest, onEvent: (event: StreamEvent) => void): Promise<CompletionResponse>;
}

export class LlmError extends Error {
  constructor(
    public type: 'http' | 'api' | 'rate_limited' | 'overloaded' | 'parse' | 'missing_api_key' | 'model_not_found' | 'other',
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'LlmError';
  }

  static http(cause: Error | string | unknown): LlmError {
    const message = cause instanceof Error ? cause.message : String(cause);
    return new LlmError('http', message);
  }

  static api(status: number, message: string): LlmError {
    return new LlmError('api', message, status);
  }

  static rateLimited(): LlmError {
    return new LlmError('rate_limited', 'Rate limited');
  }

  static overloaded(): LlmError {
    return new LlmError('overloaded', 'Service overloaded');
  }

  static missingApiKey(provider: string): LlmError {
    return new LlmError('missing_api_key', `Missing API key for ${provider}`);
  }

  static modelNotFound(model: string): LlmError {
    return new LlmError('model_not_found', `Model not found: ${model}`);
  }

  static other(message: string): LlmError {
    return new LlmError('other', message);
  }
}

export interface Config {
  providers: Record<string, ProviderConfig>;
  agents: Record<string, AgentConfig>;
  defaults: ConfigDefaults;
  theme: ThemeConfig;
  performance: PerformanceConfig;
}

export interface ProviderConfig {
  api_key?: string;
  base_url?: string;
  model?: string;
}

export interface AgentConfig {
  name: string;
  model: string;
  provider: string;
  system_prompt?: string;
  tools: string[];
  fallback_providers: string[];
}

export interface ConfigDefaults {
  provider: string;
  model: string;
  agent: string;
}

export interface ThemeConfig {
  user_color: string;
  assistant_color: string;
  tool_color: string;
  error_color: string;
  background: string;
}

export interface PerformanceConfig {
  max_iterations: number;
  max_retries: number;
  max_tokens: number;
  temperature: number;
  ollama: OllamaPerformanceConfig;
}

export interface OllamaPerformanceConfig {
  num_ctx: number;
  num_thread: number;
  num_gpu: number;
}

export interface AgentContext {
  name: string;
  systemPrompt?: string;
  model: string;
  provider: string;
  runtime: AgentRuntimeConfig;
}

export interface AgentRuntimeConfig {
  maxIterations: number;
  maxRetries: number;
  maxTokens: number;
  temperature: number;
  ollamaNumCtx: number;
  ollamaNumThread: number;
  ollamaNumGpu: number;
}

export type AgentEvent =
  | { type: 'text_delta'; text: string }
  | { type: 'tool_use_start'; id: string; name: string }
  | { type: 'tool_call'; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; toolUseId: string; result: string }
  | { type: 'usage'; usage: Usage }
  | { type: 'response'; message: string }
  | { type: 'continue' }
  | { type: 'done' }
  | { type: 'error'; error: string };

export interface AgentResponse {
  message: string;
  toolCalls: ToolCall[];
}

export interface ToolHandler {
  (params: Record<string, unknown>): Promise<unknown>;
}

export interface ToolEntry {
  tool: Tool;
  handler: ToolHandler;
}

export interface FallbackProvider {
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export const DEFAULT_RUNTIME: AgentRuntimeConfig = { maxIterations: 8, maxRetries: 2, maxTokens: 768, temperature: 0.4, ollamaNumCtx: 2048, ollamaNumThread: 2, ollamaNumGpu: 0 };

