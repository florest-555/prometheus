// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliExibirMolduraMensagens = createI18nMessages({
  fallbackLinha: (linha: string) => `  ${linha}`,
  planoTitulo: 'Plano de reestruturação',
  planoCabecalhoLinha1: 'De                                → Para',
  planoCabecalhoLinha2: '----------------------------------  ---------------------------------------',
  planoOverflow: (restantes: number) => `... +${restantes} restantes`,
  planoFallbackLinha: (de: string, para: string) => `  - ${de} → ${para}`,
  planoFallbackOverflow: (restantes: number) => `  ... +${restantes} restantes`,
  conflitosTitulo: 'Conflitos de destino',
  conflitosCabecalhoLinha1: 'Destino                           Motivo',
  conflitosCabecalhoLinha2: '-------------------------------   ------------------------------',
  conflitosOverflow: (restantes: number) => `... +${restantes} restantes`,
  conflitosFallbackLinha: (alvo: string, motivo: string) => `  - ${alvo} :: ${motivo}`,
  conflitosFallbackOverflow: (restantes: number) => `  ... +${restantes} restantes`
}, {
  fallbackLinha: (linha: string) => `  ${linha}`,
  planoTitulo: 'Restructuring plan',
  planoCabecalhoLinha1: 'From                              → To',
  planoCabecalhoLinha2: '----------------------------------  ---------------------------------------',
  planoOverflow: (restantes: number) => `... +${restantes} remaining`,
  planoFallbackLinha: (de: string, para: string) => `  - ${de} → ${para}`,
  planoFallbackOverflow: (restantes: number) => `  ... +${restantes} remaining`,
  conflitosTitulo: 'Destination conflicts',
  conflitosCabecalhoLinha1: 'Destination                      Reason',
  conflitosCabecalhoLinha2: '-------------------------------   ------------------------------',
  conflitosOverflow: (restantes: number) => `... +${restantes} remaining`,
  conflitosFallbackLinha: (alvo: string, motivo: string) => `  - ${alvo} :: ${motivo}`,
  conflitosFallbackOverflow: (restantes: number) => `  ... +${restantes} remaining`
});
