import { existsSync, mkdirSync,readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { dirname,join } from 'path';
import toml from 'toml';

import type { Config } from '../../types/agent/index.js';

export function getConfigPath(): string { return join(homedir(), '.config', 'egocentric', 'config.toml'); }

export function loadConfig(path?: string): Config {
  const configPath = path || getConfigPath();
  if (!existsSync(configPath)) { const config = getDefaultConfig(); saveConfig(config, configPath); return config; }
  try { const content = readFileSync(configPath, 'utf-8'); const config = toml.parse(content) as Config; normalizeProviderUrls(config); return config; }
  catch { return getDefaultConfig(); }
}

function configToTomlString(config: Config): string {
  let out = '';
  out += '[providers]\n';
  for (const [name, p] of Object.entries(config.providers)) { out += `[providers.${name}]\n`; if (p.api_key) out += `api_key = "${p.api_key}"\n`; if (p.base_url) out += `base_url = "${p.base_url}"\n`; if (p.model) out += `model = "${p.model}"\n`; out += '\n'; }
  out += '[agents]\n';
  for (const [name, a] of Object.entries(config.agents)) { out += `[agents.${name}]\n`; out += `name = "${a.name}"\n`; out += `model = "${a.model}"\n`; out += `provider = "${a.provider}"\n`; if (a.system_prompt) out += `system_prompt = """${a.system_prompt}"""\n`; if (a.tools.length) out += `tools = ${JSON.stringify(a.tools)}\n`; if (a.fallback_providers.length) out += `fallback_providers = ${JSON.stringify(a.fallback_providers)}\n`; out += '\n'; }
  out += `[defaults]\nprovider = "${config.defaults.provider}"\nmodel = "${config.defaults.model}"\nagent = "${config.defaults.agent}"\n\n`;
  out += `[theme]\nuser_color = "${config.theme.user_color}"\nassistant_color = "${config.theme.assistant_color}"\ntool_color = "${config.theme.tool_color}"\nerror_color = "${config.theme.error_color}"\nbackground = "${config.theme.background}"\n\n`;
  out += `[performance]\nmax_iterations = ${config.performance.max_iterations}\nmax_retries = ${config.performance.max_retries}\nmax_tokens = ${config.performance.max_tokens}\ntemperature = ${config.performance.temperature}\n\n[performance.ollama]\nnum_ctx = ${config.performance.ollama.num_ctx}\nnum_thread = ${config.performance.ollama.num_thread}\nnum_gpu = ${config.performance.ollama.num_gpu}\n`;
  return out;
}

export function saveConfig(config: Config, path?: string): void {
  const configPath = path || getConfigPath(); const dir = dirname(configPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(configPath, configToTomlString(config), 'utf-8');
}

function getDefaultConfig(): Config {
  return { providers: { ollama: { base_url: 'http://localhost:11434', model: 'qwen2.5:3b' }, openai: { base_url: 'https://api.openai.com/v1', model: 'gpt-5-mini' }, anthropic: { base_url: 'https://api.anthropic.com', model: 'claude-sonnet-4-6' }, gemini: { base_url: 'https://generativelanguage.googleapis.com', model: 'gemini-2.5-pro' }, groq: { base_url: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-120b' }, deepseek: { base_url: 'https://api.deepseek.com/v1', model: 'deepseek-chat' } }, agents: { default: { name: 'Assistant', model: 'qwen2.5:3b', provider: 'ollama', system_prompt: 'You are a helpful AI assistant.', tools: [], fallback_providers: [] }, qwen: { name: 'Qwen Assistant', model: 'qwen2.5:7b', provider: 'ollama', system_prompt: 'You are a direct and helpful technical assistant.', tools: [], fallback_providers: [] }, 'qwen-coder': { name: 'Qwen Coder', model: 'qwen2.5-coder:7b', provider: 'ollama', system_prompt: 'You are a pragmatic software engineer.', tools: ['file_read', 'file_write', 'shell_exec'], fallback_providers: [] }, coder: { name: 'Coder Assistant', model: 'claude-sonnet-4-6', provider: 'anthropic', system_prompt: 'You are a senior programmer.', tools: ['file_read', 'file_write', 'shell_exec'], fallback_providers: [] }, researcher: { name: 'Researcher', model: 'deepseek-chat', provider: 'deepseek', system_prompt: 'You are an investigative researcher.', tools: ['web_search', 'web_fetch'], fallback_providers: [] }, fast: { name: 'Fast Groq', model: 'openai/gpt-oss-120b', provider: 'groq', system_prompt: 'Be extremely direct and fast.', tools: [], fallback_providers: [] } }, defaults: { provider: 'ollama', model: 'qwen2.5:3b', agent: 'auto' }, theme: { user_color: 'Cyan', assistant_color: 'Green', tool_color: 'Yellow', error_color: 'Red', background: 'Reset' }, performance: { max_iterations: 8, max_retries: 2, max_tokens: 768, temperature: 0.4, ollama: { num_ctx: 2048, num_thread: 2, num_gpu: 0 } } };
}

function normalizeProviderUrls(config: Config): void {
  const v1Providers = ['openai', 'groq', 'deepseek', 'together', 'lmstudio', 'llamafile'];
  for (const [name, p] of Object.entries(config.providers)) {
    if (p.base_url) {
      const normalized = p.base_url.replace(/\/$/, '');
      if (v1Providers.includes(name) && !normalized.endsWith('/v1'))
        p.base_url = `${normalized}/v1`; 
      else
        p.base_url = normalized;
    }
  }
}
