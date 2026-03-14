// SPDX-License-Identifier: MIT-0
/**
 * Tipos para sistema de correções automáticas
 */

import type { Ocorrencia } from '@pt-types/shared/index.js';

/**
 * Resultado de uma correção aplicada em um arquivo
 */
export interface CorrecaoResult {
  sucesso: boolean;
  arquivo: string;
  linhasModificadas: number;
  erro?: string;
}

/**
 * Configuração para aplicação de correções
 */
export interface CorrecaoConfig {
  dryRun: boolean;
  minConfianca: number;
  verbose: boolean;
  interactive: boolean;
}

/**
 * Resultado de análise estrutural para correções
 */
export interface ResultadoAnaliseEstrutural {
  sucesso: boolean;
  arquivosAnalisados: number;
  problemas: Ocorrencia[];
  sugestoes: string[];
}

// Re-exporta todos os tipos de type-safety (inclui ASTNode, CategorizacaoUnknown, etc)
export * from '@pt-types/analistas/corrections/type-safety.js';
