// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliArquetipoHandlerMensagens = createI18nMessages({
  timeoutDeteccao: '⚠️ Detecção de arquetipos expirou (timeout)',
  erroDeteccao: (mensagem: string) => `Erro na detecção de arquetipos: ${mensagem}`,
  devErroPrefixo: '[Arquetipo Handler] Erro:',
  falhaSalvar: (mensagem: string) => `Falha ao salvar arquetipo: ${mensagem}`
}, {
  timeoutDeteccao: '⚠️ Archetype detection timed out (timeout)',
  erroDeteccao: (mensagem: string) => `Error in archetype detection: ${mensagem}`,
  devErroPrefixo: '[Archetype Handler] Error:',
  falhaSalvar: (mensagem: string) => `Failed to save archetype: ${mensagem}`
});
