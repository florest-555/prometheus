// SPDX-License-Identifier: MIT-0
/**
 * Tipos para o file registry
 */

/**
 * Resultado de operação de migração de arquivo
 */
export interface MigrationResult {
  migrated: boolean;
  from?: string;
  to?: string;
}
