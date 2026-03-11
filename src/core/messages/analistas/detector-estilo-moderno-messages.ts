// SPDX-License-Identifier: MIT-0

import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorEstiloModernoMensagens = createI18nMessages({
  satisfiesSugerido: (nome: string) => `[SUGESTAO] Use o operador 'satisfies' para '${nome}' em vez de anotacao de tipo fixa para preservar a tipagem literal.`,
  usingSugerido: (recurso: string) => `[SUGESTAO] Use 'using' (Explicit Resource Management) para o recurso '${recurso}' para garantir o cleanup automatico.`,
  waterfallDetectado: '[PERFORMANCE] Possivel waterfall de Promises: multiplos awaits sequenciais detectados. Considere Promise.all() para execucao paralela.',
  hasOwnSugerido: "[SUGESTAO] Use 'Object.hasOwn()' em vez de 'hasOwnProperty()' (mais seguro e moderno).",
  ternarioAninhado: '[LEGIBILIDADE] Ternarios aninhados detectados: prejudicam a legibilidade. Considere refatorar para blocks if/else ou guard clauses.',
  constSugerido: (nome: string) => `[SUGESTAO] Variavel '${nome}' e declarada com 'let' mas nunca reatribuida. Use 'const'.`,
  redundantType: (nome: string) => `[SUGESTAO] Anotacao de tipo redundante em '${nome}'. O TypeScript ja infere este tipo perfeitamente.`
}, {
  satisfiesSugerido: (nome: string) => `[SUGGESTION] Use the 'satisfies' operator for '${nome}' instead of fixed type annotation to preserve literal typing.`,
  usingSugerido: (recurso: string) => `[SUGGESTION] Use 'using' (Explicit Resource Management) for the resource '${recurso}' to ensure automatic cleanup.`,
  waterfallDetectado: '[PERFORMANCE] Possible Promise waterfall: multiple sequential awaits detected. Consider Promise.all() for parallel execution.',
  hasOwnSugerido: "[SUGGESTION] Use 'Object.hasOwn()' instead of 'hasOwnProperty()' (safer and more modern).",
  ternarioAninhado: '[READABILITY] Nested ternaries detected: they hurt readability. Consider refactoring to if/else blocks or guard clauses.',
  constSugerido: (nome: string) => `[SUGGESTION] Variable '${nome}' is declared with 'let' but never reassigned. Use 'const'.`,
  redundantType: (nome: string) => `[SUGGESTION] Redundant type annotation in '${nome}'. TypeScript already infers this type perfectly.`
});
