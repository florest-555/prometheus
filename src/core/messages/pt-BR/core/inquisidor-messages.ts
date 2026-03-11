// SPDX-License-Identifier: MIT-0

import { createI18nMessages } from '@shared/helpers/i18n.js';

export const InquisidorMensagens = createI18nMessages({
  iniciando: (baseDir: string) => `Iniciando a Inquisicao do Prometheus em: ${baseDir}`,
  parseAstNaoGerada: 'Erro de parsing: AST nao gerada (codigo possivelmente invalido).',
  parseErro: (erro: string) => `Erro de parsing: ${erro}`,
  parseErrosAgregados: (quantidade: number) => `Erros de parsing agregados: ${quantidade} ocorrencias suprimidas neste arquivo (exibe 1).`,
  falhaGerarAst: (relPath: string, erro: string) => `Falha ao gerar AST para ${relPath}: ${erro}`,
  priorizacaoAplicada: (exibidos: string) => `[PRIORIDADE] Priorizacao aplicada (top 5 sem meta): ${exibidos}`,
  arquivosMetaMovidos: (quantidade: number) => `   (INFO: ${quantidade} arquivos meta movidos para o final da fila)`,
  falhaPriorizacao: (erro: string) => `Falha priorizacao: ${erro}`,
  concluida: (total: number) => `[CONCLUIDO] Inquisicao concluida. Total de ocorrencias: ${total}`,
  varreduraConcluida: (total: number) => `Varredura concluida: total de arquivos: ${total}`,
  erroAcaoCaminho: (acao: string, caminho: string, mensagem: string) => `Erro ao ${acao} ${caminho}: ${mensagem}`
}, {
  iniciando: (baseDir: string) => `Starting Prometheus Inquisition in: ${baseDir}`,
  parseAstNaoGerada: 'Parsing error: AST not generated (possibly invalid code).',
  parseErro: (erro: string) => `Parsing error: ${erro}`,
  parseErrosAgregados: (quantidade: number) => `Aggregated parsing errors: ${quantidade} occurrences suppressed in this file (showing 1).`,
  falhaGerarAst: (relPath: string, erro: string) => `Failed to generate AST for ${relPath}: ${erro}`,
  priorizacaoAplicada: (exibidos: string) => `[PRIORITY] Prioritization applied (top 5 without meta): ${exibidos}`,
  arquivosMetaMovidos: (quantidade: number) => `   (INFO: ${quantidade} meta files moved to the end of the queue)`,
  falhaPriorizacao: (erro: string) => `Prioritization failure: ${erro}`,
  concluida: (total: number) => `[COMPLETED] Inquisition concluded. Total occurrences: ${total}`,
  varreduraConcluida: (total: number) => `Scan concluded: total files: ${total}`,
  erroAcaoCaminho: (acao: string, caminho: string, mensagem: string) => `Error when ${acao} ${caminho}: ${mensagem}`
});