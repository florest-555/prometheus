// SPDX-License-Identifier: MIT-0

export * from '@pt-types/analistas/detectores/analise.js';
export * from '@pt-types/analistas/detectores/funcoes.js';
export * from '@pt-types/analistas/detectores/problemas.js';
export * from '@pt-types/analistas/detectores/sintaxe.js';

export type ProblemaQualidade =
  | import('@pt-types/analistas/detectores/sintaxe.js').Fragilidade
  | import('@pt-types/analistas/detectores/problemas.js').ProblemaPerformance
  | import('@pt-types/analistas/detectores/problemas.js').ProblemaDocumentacao
  | import('@pt-types/analistas/detectores/problemas.js').ProblemaFormatacao;
