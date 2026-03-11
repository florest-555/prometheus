// SPDX-License-Identifier: MIT-0

import type { FormatoSaida, ModoAutoFix, ModoOperacao, NivelLog } from './modo.js';

export interface FlagsNormalizadas {
  mode: ModoOperacao;
  output: {
    format: FormatoSaida;
    jsonAscii: boolean;
    export: boolean;
    exportFull: boolean;
    exportDir: string;
  };
  filters: {
    include: string[];
    exclude: string[];
    includeTests: boolean;
    includeNodeModules: boolean;
  };
  performance?: {
    fastMode: boolean;
  };
  autoFix: {
    enabled: boolean;
    mode: ModoAutoFix;
    dryRun: boolean;
  };
  guardian: {
    enabled: boolean;
    fullScan: boolean;
    saveBaseline: boolean;
  };
  verbosity: {
    level: NivelLog;
    silent: boolean;
  };
  special: {
    listarAnalistas: boolean;
    criarArquetipo: boolean;
    salvarArquetipo: boolean;
  };
}

export interface FlagsBrutas {
  full?: boolean;
  executive?: boolean;
  quick?: boolean;
  json?: boolean;
  jsonAscii?: boolean;
  markdown?: boolean;
  export?: boolean;
  exportFull?: boolean;
  exportTo?: string;
  include?: string[];
  exclude?: string[];
  onlySrc?: boolean;
  withTests?: boolean;
  withNodeModules?: boolean;
  fix?: boolean;
  fixMode?: string;
  fixSafe?: boolean;
  fixAggressive?: boolean;
  dryRun?: boolean;
  showFixes?: boolean;
  autoFix?: boolean;
  autoCorrecaoMode?: string;
  autoFixConservative?: boolean;
  guardian?: boolean;
  guardianCheck?: boolean;
  guardianFull?: boolean;
  guardianBaseline?: boolean;
  logNivel?: string;
  quiet?: boolean;
  verbose?: boolean;
  silent?: boolean;
  listarAnalistas?: boolean;
  criarArquetipo?: boolean;
  salvarArquetipo?: boolean;
  detalhado?: boolean;
  debug?: boolean;
  dev?: boolean;
}

export interface ResultadoValidacao {
  valid: boolean;
  errors: string[];
  warnings: string[];
  normalized: FlagsNormalizadas;
}
