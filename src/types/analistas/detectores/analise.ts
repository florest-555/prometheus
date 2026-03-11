// SPDX-License-Identifier: MIT-0

export interface ImportInfo {
  origem?: string;
  tipo?: 'external' | 'alias' | 'relative';
  items?: string[];
  isType?: boolean;
}

export interface ExportInfo {
  nome?: string;
  tipo?: 'named' | 'default' | 'reexport';
}

export interface EstatisticasArquivo {
  imports: number | ImportInfo[];
  exports: number | ExportInfo[];
  sloc?: number;
  funcoes?: number;
  classes?: number;
  caminho?: string;
  aliases?: Record<string, number>;
  dependenciasInternas?: string[];
  dependenciasExternas?: string[];
  complexidade?: number;
}

export interface AnaliseArquitetural {
  imports: ImportInfo[] | string[];
  exports: ExportInfo[] | string[];
  stats: EstatisticasArquivo;
  padraoIdentificado?: string;
  confianca?: number;
  caracteristicas?: string[];
  violacoes?: string[];
  recomendacoes?: string[];
  metricas?:
    | Record<string, number>
    | {
        modularidade?: number;
        acoplamento?: number;
        coesao?: number;
        complexidadeMedia?: number;
      };
}
