// SPDX-License-Identifier: MIT-0
/**
 * Tipos para relatórios de estrutura
 */

/**
 * Item de alinhamento estrutural (diagnóstico)
 */
export interface AlinhamentoItemDiagnostico {
  arquivo: string;
  atual: string;
  ideal: string;
}
