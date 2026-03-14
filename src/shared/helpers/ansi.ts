// SPDX-License-Identifier: MIT-0
/**
 * Utilitário para remover códigos ANSI de strings (útil em relatórios Markdown).
 */
const ANSI_REGEX = /[\u001B\u009B][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export function stripAnsi(value: string): string {
  return value.replace(ANSI_REGEX, '');
}
