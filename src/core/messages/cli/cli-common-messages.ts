// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';
/**
 * Mensagens comuns compartilhadas entre comandos CLI
 */

export const CliCommonMensagens = createI18nMessages({
  opcoes: {
    json: 'Saída em JSON estruturado (para CI/integrações)',
    include: 'Glob pattern a INCLUIR (pode repetir a flag ou usar vírgulas / espaços para múltiplos)',
    exclude: 'Glob pattern a EXCLUIR adicionalmente (pode repetir a flag ou usar vírgulas / espaços)',
    force: 'Executa a operação sem confirmação (CUIDADO!)',
    dryRun: 'Executa em modo simulação (não grava mudanças no disco)',
    verbose: 'Exibe logs detalhados durante a execução',
    output: 'Define o arquivo ou diretório de saída',
    root: 'Define o diretório raiz do projeto (padrão: CWD)',
    write: 'Aplica as mudanças no filesystem',
    limite: 'Limite de itens a exibir ou processar',
    dir: 'Diretório base para a operação'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags: ${erro}`,
    argumentoInvalido: (arg: string) => `Argumento inválido: ${arg}`
  },
  confirmacao: {
    certeza: 'Tem certeza que deseja prosseguir? (s/N) ',
    cancelado: 'Operação cancelada pelo usuário.'
  }
}, {
  opcoes: {
    json: 'Output in structured JSON (for CI/integrations)',
    include: 'Glob pattern to INCLUDE (can repeat the flag or use commas/spaces for multiple)',
    exclude: 'Glob pattern to EXCLUDE additionally (can repeat the flag or use commas/spaces)',
    force: 'Execute the operation without confirmation (CAUTION!)',
    dryRun: 'Execute in simulation mode (does not write changes to disk)',
    verbose: 'Display detailed logs during execution',
    output: 'Define the output file or directory',
    root: 'Define the project root directory (default: CWD)',
    write: 'Apply changes to the filesystem',
    limite: 'Limit of items to display or process',
    dir: 'Base directory for the operation'
  },
  erros: {
    falhaFlags: (erro: string) => `Failed to apply flags: ${erro}`,
    argumentoInvalido: (arg: string) => `Invalid argument: ${arg}`
  },
  confirmacao: {
    certeza: 'Are you sure you want to proceed? (y/N) ',
    cancelado: 'Operation canceled by user.'
  }
});
