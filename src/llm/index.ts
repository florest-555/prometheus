import type { FallbackProvider,LlmDriver } from '../types/agent/index.js';
import { LlmError } from '../types/agent/index.js';
import { AnthropicDriver } from './anthropic.js';
import { GeminiDriver } from './gemini.js';
import { OllamaDriver } from './ollama.js';
import { OpenAiDriver } from './openai.js';

export * from '../types/agent/index.js';
export { AnthropicDriver, GeminiDriver,OllamaDriver, OpenAiDriver };

export function createDriver(provider: string, apiKey?: string, baseUrl?: string): LlmDriver {
  switch (provider) {
    case 'ollama': {
      const url = baseUrl || 'http://localhost:11434';
      if (!isLocalOllamaUrl(url)) throw LlmError.other('Ollama requires local endpoint');
      return new OllamaDriver(url);
    }
    case 'openai':
    case 'groq':
    case 'deepseek':
    case 'together':
    case 'lmstudio':
    case 'llamafile':
      return new OpenAiDriver(provider, apiKey, baseUrl);
    case 'anthropic':
      if (!apiKey) throw LlmError.missingApiKey('anthropic');
      return new AnthropicDriver(apiKey, baseUrl);
    case 'gemini':
      if (!apiKey) throw LlmError.missingApiKey('gemini');
      return new GeminiDriver(apiKey, baseUrl);
    default:
      throw LlmError.other(`Unknown provider: ${provider}`);
  }
}

function isLocalOllamaUrl(baseUrl: string): boolean {
  try { const url = new URL(baseUrl); return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1'; } catch { return false; }
}

export function createMultiDriver(primaryProvider: string, primaryApiKey: string | undefined, primaryBaseUrl: string | undefined, _primaryModel: string, _fallbackProviders: FallbackProvider[]): LlmDriver {
  return createDriver(primaryProvider, primaryApiKey, primaryBaseUrl);
}
