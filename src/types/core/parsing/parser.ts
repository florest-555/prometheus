// SPDX-License-Identifier: MIT-0

import type { File } from '@babel/types';

// Re-export do tipo comum para compatibilidade

export interface ParserBabelFileExtra extends File {
  prometheusExtra?: {
    lang: string;
    rawAst: unknown;
    metadata?: unknown;
  };
}
export type ParserFunc = (codigo: string, plugins?: string[]) => File | ParserBabelFileExtra | null;
export interface DecifrarSintaxeOpts {
  plugins?: string[];
  codigo?: string;
  relPath?: string;
  fullCaminho?: string;
  ignorarErros?: boolean;
  timeoutMs?: number;
}