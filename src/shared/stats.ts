// SPDX-License-Identifier: MIT-0
import type { Estatisticas } from '@';

export type { Estatisticas };

/**
 * Cria um objeto de estatísticas vazio com as chaves padrão
 */
export const createEstatisticas = (): Estatisticas => ({
  requires: {},
  consts: {},
  exports: {},
  vars: {},
  lets: {},
  evals: {},
  withs: {}
});

/**
 * Estatísticas globais compartilhadas entre analistas e relatórios
 */
export const estatisticasUsoGlobal: Estatisticas = createEstatisticas();
