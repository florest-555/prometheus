// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

function comandoLabel(comandoNome?: string): string {
  return comandoNome ? ` "${comandoNome}"` : "";
}

export const ComandosCliMensagens = createI18nMessages({
  padraoAusente: 'Possível arquivo de comando sem registro detectado. Se este arquivo deveria conter comandos, considere usar padrões como "onCommand", "registerCommand", ou métodos específicos do framework (ex: SlashCommandBuilder para Discord.js).',
  comandosDuplicados: (duplicados: string[]) => `Comandos duplicados detectados: ${[...new Set(duplicados)].join(", ")}`,
  handlerAnonimo: (comandoNome: string) => `Handler do comando "${comandoNome}" é função anônima. Prefira funções nomeadas para facilitar debugging e rastreabilidade.`,
  handlerMuitosParametros: (comandoNome: string | undefined, paramContagem: number) => `Handler do comando${comandoLabel(comandoNome)} possui muitos parâmetros (${paramContagem}). Avalie simplificar a interface.`,
  handlerMuitoLongo: (comandoNome: string | undefined, statements: number) => `Handler do comando${comandoLabel(comandoNome)} é muito longo (${statements} statements). Considere extrair funções auxiliares.`,
  handlerSemTryCatch: (comandoNome: string | undefined) => `Handler do comando${comandoLabel(comandoNome)} não possui bloco try/catch. Recomenda-se tratar erros explicitamente.`,
  handlerSemFeedback: (comandoNome: string | undefined) => `Handler do comando${comandoLabel(comandoNome)} não faz log nem responde ao usuário. Considere adicionar feedback/logging.`,
  multiplosComandos: (count: number) => `Múltiplos comandos registrados neste arquivo (${count}). Avalie separar cada comando em seu próprio módulo para melhor manutenção.`
}, {
  padraoAusente: 'Possible unregistered command file detected. If this file should contain commands, consider using patterns like "onCommand", "registerCommand", or framework-specific methods (e.g., SlashCommandBuilder for Discord.js).',
  comandosDuplicados: (duplicados: string[]) => `Duplicate commands detected: ${[...new Set(duplicados)].join(", ")}`,
  handlerAnonimo: (comandoNome: string) => `Command handler for "${comandoNome}" is an anonymous function. Prefer named functions to facilitate debugging and traceability.`,
  handlerMuitosParametros: (comandoNome: string | undefined, paramContagem: number) => `Command handler${comandoLabel(comandoNome)} has too many parameters (${paramContagem}). Consider simplifying the interface.`,
  handlerMuitoLongo: (comandoNome: string | undefined, statements: number) => `Command handler${comandoLabel(comandoNome)} is too long (${statements} statements). Consider extracting auxiliary functions.`,
  handlerSemTryCatch: (comandoNome: string | undefined) => `Command handler${comandoLabel(comandoNome)} lacks a try/catch block. It is recommended to handle errors explicitly.`,
  handlerSemFeedback: (comandoNome: string | undefined) => `Command handler${comandoLabel(comandoNome)} does not log or respond to the user. Consider adding feedback/logging.`,
  multiplosComandos: (count: number) => `Multiple commands registered in this file (${count}). Consider separating each command into its own module for better maintenance.`
});