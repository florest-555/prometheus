// SPDX-License-Identifier: MIT-0

export * from './analise.js';
export * from './funcoes.js';
export * from './problemas.js';
export * from './sintaxe.js';

export type ProblemaQualidade =
  | import('./sintaxe.js').Fragilidade
  | import('./problemas.js').ProblemaPerformance
  | import('./problemas.js').ProblemaDocumentacao
  | import('./problemas.js').ProblemaFormatacao;
