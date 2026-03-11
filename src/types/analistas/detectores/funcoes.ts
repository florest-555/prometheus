// SPDX-License-Identifier: MIT-0

export interface BlocoFuncao {
  nome?: string;
  inicio?: number;
  fim?: number;
  conteudo?: string;
  codigo?: string;
  hash?: string;
  caminho?: string;
  parametros?: string[];
  tipoFuncao?: string;
}

export interface DuplicacaoEncontrada {
  arquivo1?: string;
  arquivo2?: string;
  bloco1?: BlocoFuncao;
  bloco2?: BlocoFuncao;
  funcaoA?: BlocoFuncao;
  funcaoB?: BlocoFuncao;
  similaridade: number;
  tipoSimilaridade?: string;
}

export interface InterfaceInlineDetection {
  tipo: 'interface' | 'type-alias' | 'object-literal-type';
  nome?: string;
  linha: number;
  complexidade: number;
  contexto: string;
  sugestao: string;
}

export interface ResultadoContexto {
  tecnologia?: string;
  confiancaTotal: number;
  evidencias?: Array<{ tipo: string; valor: string }>;
  sugestoesMelhoria?: string[];
}

export interface InlineTypeOccurrence {
  tipo: string;
  estrutura: string;
  linha: number;
  contexto: string;
}

export interface DuplicateEntry {
  linha: number;
  tipo: string;
  contexto: string;
}
