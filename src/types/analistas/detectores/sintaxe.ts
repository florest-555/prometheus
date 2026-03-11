// SPDX-License-Identifier: MIT-0

export type TipoFragilidade = string;

export interface Fragilidade {
  tipo: TipoFragilidade;
  linha: number;
  coluna: number;
  descricao?: string;
  sugestao?: string;
  severidade?: 'baixa' | 'media' | 'alta' | 'critica';
  contexto?: string;
  nome?: string;
}

export interface ConstrucaoSintatica {
  tipo: string;
  linha: number;
  coluna: number;
  codigo?: string;
  nome?: string;
  contexto?: string;
}
