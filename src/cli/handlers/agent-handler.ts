import { AgentLoop } from '@agent/loop_mgr.js';
import { ToolRegistry } from '@agent/tools/registry.js';
import { AnthropicDriver } from '@llm/anthropic.js';
import { GeminiDriver } from '@llm/gemini.js';
import { OllamaDriver } from '@llm/ollama.js';
import { OpenAiDriver } from '@llm/openai.js';
import { loadConfig } from '@utils/agent/config.js';
import { CliComandoAgentMensagens } from '@core/messages/cli/cli-comando-agent-messages.js';
import { log } from '@core/messages/index.js';
import type { LlmDriver } from '@';

import readline from 'readline';

export async function processarAgent(opts: {
  interactive?: boolean;
  agent?: string;
  model?: string;
  provider?: string;
}) {
  const config = loadConfig();
  const agentKey = opts.agent || config.defaults.agent || 'default';
  const agentConfig = config.agents[agentKey] || config.agents['default'];

  if (!agentConfig) {
    throw new Error(`Agente não encontrado: ${agentKey}`);
  }

  const provider = opts.provider || agentConfig.provider;
  const model = opts.model || agentConfig.model;

  log.info(CliComandoAgentMensagens.mensagens.iniciando
    .replace('{agent}', agentKey)
    .replace('{model}', model)
    .replace('{provider}', provider)
  );

  let driver: LlmDriver;
  const providerConfig = config.providers[provider];
  const baseUrl = providerConfig?.base_url;
  const apiKey = providerConfig?.api_key || '';

  switch (provider.toLowerCase()) {
    case 'ollama':
      driver = new OllamaDriver(baseUrl);
      break;
    case 'openai':
    case 'groq':
    case 'deepseek':
      driver = new OpenAiDriver(apiKey, baseUrl);
      break;
    case 'anthropic':
      driver = new AnthropicDriver(apiKey, baseUrl);
      break;
    case 'gemini':
      driver = new GeminiDriver(apiKey, baseUrl);
      break;
    default:
      throw new Error(`Provedor desconhecido: ${provider}`);
  }

  const tools = new ToolRegistry();
  const context = {
    name: agentConfig.name,
    systemPrompt: agentConfig.system_prompt,
    model: model,
    provider: provider,
    runtime: {
      maxIterations: config.performance.max_iterations,
      maxRetries: config.performance.max_retries,
      maxTokens: config.performance.max_tokens,
      temperature: config.performance.temperature,
      ollamaNumCtx: config.performance.ollama.num_ctx,
      ollamaNumThread: config.performance.ollama.num_thread,
      ollamaNumGpu: config.performance.ollama.num_gpu,
    }
  };

  const agent = new AgentLoop(context, tools);

  if (opts.interactive) {
    await runChat(agent, driver);
  } else {
    // Modo não interativo (pode ser expandido futuramente)
    log.info(CliComandoAgentMensagens.mensagens.sessaoIniciada);
    await runChat(agent, driver);
  }
}

async function runChat(agent: AgentLoop, driver: LlmDriver) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `\x1b[36m${CliComandoAgentMensagens.mensagens.user} > \x1b[0m`
  });

  log.info(CliComandoAgentMensagens.mensagens.sessaoIniciada);
  rl.prompt();

  for await (const line of rl) {
    const userInput = line.trim();
    if (userInput.toLowerCase() === 'sair' || userInput.toLowerCase() === 'exit') {
      rl.close();
      break;
    }

    if (!userInput) {
      rl.prompt();
      continue;
    }

    try {
      await agent.run(driver, userInput, (event) => {
        switch (event.type) {
          case 'text_delta':
            process.stdout.write(event.text);
            break;
          case 'tool_call':
            log.info(`\n\x1b[33m[TOOL] ${event.name}(${JSON.stringify(event.input)})\x1b[0m`);
            break;
          case 'tool_result':
            // log.debug(`\n[RESULT] ${event.result}`);
            break;
          case 'response':
            process.stdout.write('\n');
            break;
          case 'error':
            log.erro(`\n${CliComandoAgentMensagens.mensagens.erroLlm.replace('{erro}', event.error)}`);
            break;
        }
      });
    } catch (error) {
      log.erro(`\n${CliComandoAgentMensagens.mensagens.erroLlm.replace('{erro}', (error as Error).message)}`);
    }

    rl.prompt();
  }
}
