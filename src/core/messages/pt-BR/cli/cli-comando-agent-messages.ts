// SPDX-License-Identifier: MIT-0

/**
 * Mensagens para o comando Agent
 */
export const CliComandoAgentMensagens = {
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
  }
};
