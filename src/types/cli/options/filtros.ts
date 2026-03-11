// SPDX-License-Identifier: MIT-0

export type TipoLinguagemProjeto =
  | 'typescript'
  | 'nodejs'
  | 'python'
  | 'java'
  | 'dotnet'
  | 'generico';

export interface FiltrosProcessados {
  include?: string[];
  exclude?: string[];
  includeGroups: string[][];
  includeFlat: string[];
  excludePadroes: string[];
  incluiNodeModules?: boolean;
  tipoProjeto?: TipoLinguagemProjeto;
}

export interface OpcoesProcessamentoFiltros {
  verbose?: boolean;
  allowEmpty?: boolean;
  normalizePatterns?: boolean;
  include?: string[];
  exclude?: string[];
  forceIncludeNodeModules?: boolean;
  forceIncludeTests?: boolean;
}
