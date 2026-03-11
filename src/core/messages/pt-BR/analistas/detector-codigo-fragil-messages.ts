// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

import type { FragilidadesDetalhesArgs } from '@';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Erro desconhecido';
}
function errorToMessageEn(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Unknown error';
}
export const DetectorCodigoFragilMensagens = createI18nMessages({
  fragilidadesResumo: (severidade: string, resumo: string, detalhes: FragilidadesDetalhesArgs) => `Fragilidades ${severidade}: ${resumo} | Detalhes: ${JSON.stringify(detalhes)}`,
  erroAnalisarCodigoFragil: (erro: ErroUnknown) => `Erro ao analisar código frágil: ${erroToMessage(erro)}`
}, {
  fragilidadesResumo: (severidade: string, resumo: string, detalhes: FragilidadesDetalhesArgs) => `Fragilities ${severidade}: ${resumo} | Details: ${JSON.stringify(detalhes)}`,
  erroAnalisarCodigoFragil: (erro: ErroUnknown) => `Error analyzing fragile code: ${errorToMessageEn(erro)}`
});