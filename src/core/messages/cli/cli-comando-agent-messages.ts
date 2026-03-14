// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

/**
 * Mensagens para o comando Agent
 */
export const CliComandoAgentMensagens = createI18nMessages({
  descricao: 'Comando para interação com agentes inteligentes e LLMs',
  opcoes: {
    interactive: 'Inicia uma sessão interativa de chat',
    agent: 'Especifica o agente a ser usado (default, qwen, coder, researcher)',
    model: 'Sobrescreve o modelo do LLM',
    provider: 'Sobrescreve o provedor do LLM',
  },
  mensagens: {
    iniciando: 'Iniciando agente {agent} com modelo {model} via {provider}...',
    erroConfig: 'Erro ao carregar configuração do agente: {erro}',
    erroLlm: 'Erro na comunicação com o LLM: {erro}',
    comandoNaoEncontrado: 'Comando de agente não reconhecido.',
    sessaoIniciada: 'Sessão de chat iniciada. Digite "sair" ou "exit" para encerrar.',
    user: 'Usuário',
    assistant: 'Assistente',
  },
  config: {
    caminhoConfig: 'Configuração em: {path}',
    configCriada: 'Configuração padrão criada com sucesso.',
    spinnerFase: (titulo: string) => `[AGENT] ${titulo}...`,
  }
}, {
  descricao: 'Command for interacting with intelligent agents and LLMs',
  opcoes: {
    interactive: 'Starts an interactive chat session',
    agent: 'Specifies the agent to use (default, qwen, coder, researcher)',
    model: 'Overrides the LLM model',
    provider: 'Overrides the LLM provider',
  },
  mensagens: {
    iniciando: 'Starting agent {agent} with model {model} via {provider}...',
    erroConfig: 'Error loading agent configuration: {erro}',
    erroLlm: 'Error communicating with LLM: {erro}',
    comandoNaoEncontrado: 'Agent command not recognized.',
    sessaoIniciada: 'Chat session started. Type "sair", "exit" or "quit" to end.',
    user: 'User',
    assistant: 'Assistant',
  },
  config: {
    caminhoConfig: 'Configuration at: {path}',
    configCriada: 'Default configuration created successfully.',
    spinnerFase: (titulo: string) => `[AGENT] ${titulo}...`,
  }
});
