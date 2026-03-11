// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Erro desconhecido';
}

function errorToMessageEn(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Unknown error';
}

export const DetectorArquiteturaMensagens = createI18nMessages({
  padraoArquitetural: (padraoIdentificado: string | undefined, confianca: number) => `Padrão arquitetural: ${padraoIdentificado} (${confianca}% confiança)`,
  caracteristicas: (caracteristicas: string[]) => `Características: ${caracteristicas.slice(0, 3).join(', ')}`,
  violacao: (violacao: string) => `Violação arquitetural: ${violacao}`,
  metricas: (acoplamento: number, coesao: number) => `Métricas: Acoplamento=${(acoplamento * 100).toFixed(0)}%, Coesão=${(coesao * 100).toFixed(0)}%`,
  erroAnalisarArquitetura: (erro: ErroUnknown) => `Erro ao analisar arquitetura: ${erroToMessage(erro)}`
}, {
  padraoArquitetural: (padraoIdentificado: string | undefined, confianca: number) => `Architectural pattern: ${padraoIdentificado} (${confianca}% confidence)`,
  caracteristicas: (caracteristicas: string[]) => `Characteristics: ${caracteristicas.slice(0, 3).join(', ')}`,
  violacao: (violacao: string) => `Architectural violation: ${violacao}`,
  metricas: (acoplamento: number, coesao: number) => `Metrics: Coupling=${(acoplamento * 100).toFixed(0)}%, Cohesion=${(coesao * 100).toFixed(0)}%`,
  erroAnalisarArquitetura: (erro: ErroUnknown) => `Error analyzing architecture: ${errorToMessageEn(erro)}`
});