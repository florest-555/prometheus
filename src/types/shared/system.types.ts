// SPDX-License-Identifier: MIT-0

import type { NodePath } from '@babel/traverse';
import type { Node } from '@babel/types';


export type OrigemArquivo = 'local' | 'remoto' | 'gerado';

// Versão base - compatível com núcleo
export interface FileEntry {
  fullCaminho: string;
  relPath: string;
  content: string | null;
  origem?: OrigemArquivo;
  ultimaModificacao?: number;
}

// Versão genérica - suporta ASTs de qualquer parser
export interface FileEntryWithAst extends FileEntry {
  ast: NodePath<Node> | object | null | undefined;
}

// Versão específica para Babel (backward compatibility)
export interface FileEntryWithBabelAst extends FileEntry {
  ast: NodePath<Node> | undefined;
}

// Versão específica para parsers não-Babel
export interface FileEntryWithGenericAst extends FileEntry {
  ast: object | null | undefined;
}
export type FileMap = Record<string, FileEntry>;
export type FileMapWithAst = Record<string, FileEntryWithAst>;
export type FileMapWithBabelAst = Record<string, FileEntryWithBabelAst>;

/**
 * Minimal PackageJson shape used across the codebase. Keep it permissive
 * and typed enough for common reads (dependencies, devDependencies, scripts).
 */
export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  types?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  workspaces?: string[] | { packages?: string[] };
  [key: string]: unknown;
}

/**
 * Tipos para helpers de manipulação de imports
 * Originalmente em: src/shared/helpers/imports.ts
 */

export interface ImportReescrito {
  from: string;
  to: string;
}

// @prometheus-disable problema-documentacao
// Justificativa: types com any são propositais para tipagem genérica de wrappers
/**
 * @fileoverview Tipos para funções de persistência e mocking de testes
 */

/**
 * Função de salvamento de estado
 */
export type SalvarEstadoFn = <T = unknown>(
  caminho: string,
  dados: T,
) => Promise<void>;

/**
 * Função de salvamento binário
 */
export type SalvarBinarioFn = (caminho: string, dados: Buffer) => Promise<void>;

/**
 * Função wrapper do Vitest para spy
 * Array genérico/rest params: captura qualquer assinatura de função
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VitestSpyWrapper<T extends (...args: any[]) => any> = (
  fn: T,
) => unknown;

/**
 * @fileoverview Tipos para configuração de aliases do Vitest
 */

/**
 * Alias de resolução de módulos do Vitest
 */
export interface VitestAlias {
  /** Padrão de busca (string ou RegExp) */
  find: string | RegExp;
  /** Caminho de substituição */
  replacement: string;
}
