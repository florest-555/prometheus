// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const PadroesUsoMensagens = createI18nMessages({
  varUsage: "Uso de 'var' detectado. Prefira 'let' ou 'const'.",
  letUsage: "Uso de 'let'. Considere 'const' se não houver reatribuição.",
  requireInTs: "Uso de 'require' em arquivo TypeScript. Prefira 'import'.",
  evalUsage: "Uso de 'eval' detectado. Evite por questões de segurança e performance.",
  moduleExportsInTs: "Uso de 'module.exports' ou 'exports' em arquivo TypeScript. Prefira 'export'.",
  withUsage: "Uso de 'with' detectado. Evite por questões de legibilidade e escopo.",
  anonymousFunction: 'Função anônima detectada. Considere nomear funções para melhor rastreabilidade.',
  arrowAsClassMethod: 'Arrow function usada como método de classe. Prefira método tradicional para melhor herança.',
  erroAnalise: (relPath: string, erro: string) => `Falha ao analisar padrões de uso em ${relPath}: ${erro}`
}, {
  varUsage: "Use of 'var' detected. Prefer 'let' or 'const'.",
  letUsage: "Use of 'let'. Consider 'const' if there is no reassignment.",
  requireInTs: "Use of 'require' in TypeScript file. Prefer 'import'.",
  evalUsage: "Use of 'eval' detected. Avoid for security and performance reasons.",
  moduleExportsInTs: "Use of 'module.exports' or 'exports' in TypeScript file. Prefer 'export'.",
  withUsage: "Use of 'with' detected. Avoid for readability and scope reasons.",
  anonymousFunction: 'Anonymous function detected. Consider naming functions for better traceability.',
  arrowAsClassMethod: 'Arrow function used as class method. Prefer traditional method for better inheritance.',
  erroAnalise: (relPath: string, erro: string) => `Failed to analyze usage patterns in ${relPath}: ${erro}`
});