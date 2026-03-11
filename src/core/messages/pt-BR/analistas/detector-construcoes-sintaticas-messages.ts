// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

type ErroUnknown = unknown;
function erroToMessage(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Erro desconhecido';
}

function errorToMessageEn(erro: ErroUnknown): string {
  return erro instanceof Error ? erro.message : 'Unknown error';
}

export const DetectorConstrucoesSintaticasMensagens = createI18nMessages({
  identificadas: (mensagemFinal: string) => `Construções sintáticas identificadas: ${mensagemFinal}`,
  erroAnalisar: (erro: ErroUnknown) => `Erro ao analisar construções sintáticas: ${erroToMessage(erro)}`
}, {
  identificadas: (mensagemFinal: string) => `Syntactic constructions identified: ${mensagemFinal}`,
  erroAnalisar: (erro: ErroUnknown) => `Error analyzing syntactic constructions: ${errorToMessageEn(erro)}`
});