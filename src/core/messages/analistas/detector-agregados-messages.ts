// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Erro desconhecido';
}

function errorToMessageEn(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Unknown error';
}

export const DetectorAgregadosMensagens = createI18nMessages({
  problemasSegurancaResumo: (severidade: string, resumo: string, total: number) => `Problemas de segurança (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
  erroAnalisarSeguranca: (erro: ErroUnknown) => `Erro ao analisar segurança: ${erroToMessage(erro)}`,
  problemasPerformanceResumo: (impacto: string, resumo: string, total: number) => `Problemas de performance (${impacto}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
  erroAnalisarPerformance: (erro: ErroUnknown) => `Erro ao analisar performance: ${erroToMessage(erro)}`,
  problemasDocumentacaoResumo: (prioridade: string, resumo: string, total: number) => `Problemas de documentação (${prioridade}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
  erroAnalisarDocumentacao: (erro: ErroUnknown) => `Erro ao analisar documentação: ${erroToMessage(erro)}`,
  duplicacoesResumo: (tipo: string, resumo: string, total: number) => `Duplicações ${tipo}: ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
  erroAnalisarDuplicacoes: (erro: ErroUnknown) => `Erro ao analisar duplicações: ${erroToMessage(erro)}`,
  problemasTesteResumo: (severidade: string, resumo: string, total: number) => `Problemas de teste (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} mais)` : ''}`,
  erroAnalisarQualidadeTestes: (erro: ErroUnknown) => `Erro ao analisar qualidade de testes: ${erroToMessage(erro)}`
}, {
  problemasSegurancaResumo: (severidade: string, resumo: string, total: number) => `Security issues (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
  erroAnalisarSeguranca: (erro: ErroUnknown) => `Error analyzing security: ${errorToMessageEn(erro)}`,
  problemasPerformanceResumo: (impacto: string, resumo: string, total: number) => `Performance issues (${impacto}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
  erroAnalisarPerformance: (erro: ErroUnknown) => `Error analyzing performance: ${errorToMessageEn(erro)}`,
  problemasDocumentacaoResumo: (prioridade: string, resumo: string, total: number) => `Documentation issues (${prioridade}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
  erroAnalisarDocumentacao: (erro: ErroUnknown) => `Error analyzing documentation: ${errorToMessageEn(erro)}`,
  duplicacoesResumo: (tipo: string, resumo: string, total: number) => `${tipo} duplications: ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
  erroAnalisarDuplicacoes: (erro: ErroUnknown) => `Error analyzing duplications: ${errorToMessageEn(erro)}`,
  problemasTesteResumo: (severidade: string, resumo: string, total: number) => `Test issues (${severidade}): ${resumo}${total > 3 ? ` (+${total - 3} more)` : ''}`,
  erroAnalisarQualidadeTestes: (erro: ErroUnknown) => `Error analyzing test quality: ${errorToMessageEn(erro)}`
});