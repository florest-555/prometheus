// SPDX-License-Identifier: MIT-0
/**
 * Tipos para o conselheiro prometheus
 */

/**
 * Contexto para emissão de conselhos prometheus
 */
export interface ConselhoContextoPrometheus {
  hora?: number;
  arquivosParaCorrigir?: number;
  arquivosParaPodar?: number;
  totalOcorrenciasAnaliticas?: number;
  integridadeGuardian?: string;
}
