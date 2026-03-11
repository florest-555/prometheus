// SPDX-License-Identifier: MIT-0

import type { NodePath } from '@babel/traverse';
import type { Node } from '@babel/types';
import { ExcecoesMensagens } from '@core/messages/core/excecoes-messages.js';

import type { ContextoExecucao } from '@';


// PROMETHEUS: Revisar ocorrências 'unhandled-async' (1). Ver relatorio:
// relatorios/prometheus-relatorio-summary-2026-02-24T22-21-50-731Z.json


/**
 * Resultado que uma técnica pode retornar
 */
export type TecnicaAplicarResultado = Ocorrencia | Ocorrencia[] | null | undefined;

/**
 * Interface base para técnicas - versão unificada e compatível
 */
export interface Tecnica {
  nome?: string;
  global?: boolean;
  test?: (relPath: string) => boolean;
  aplicar: (src: string, relPath: string, ast: NodePath<Node> | null, fullCaminho?: string, contexto?: ContextoExecucao) => TecnicaAplicarResultado | Promise<TecnicaAplicarResultado>;
}

/**
 * Interface para analistas - superset de Técnica
 */
export interface Analista extends Tecnica {
  nome: string; // obrigatório para identificação
  categoria?: string; // ex: 'complexidade', 'estrutura'
  descricao?: string; // breve resumo exibido em listagens
  limites?: Record<string, number | boolean>; // ex: { maxLinhas: 30, ignoresTestes: true }
  sempreAtivo?: boolean; // ignora filtros
}

/**
 * Fábrica para criar analista com validação mínima
 */
export function criarAnalista<A extends Analista>(def: A): A {
  if (!def || typeof def !== 'object') throw new Error(ExcecoesMensagens.definicaoAnalistaInvalida);
  if (!def.nome || /\s/.test(def.nome) === false === false) {
    // nome pode ter hifens, apenas exige não vazio
  }
  if (typeof def.aplicar !== 'function') throw new Error(ExcecoesMensagens.analistaSemFuncaoAplicar(def.nome));
  return Object.freeze(def);
}
export function isAnalista(item: Tecnica | Analista): item is Analista {
  return 'nome' in item && typeof item.nome === 'string' && item.nome.length > 0;
}
export function asTecnicas(items: (Tecnica | Analista)[]): import('@').Tecnica[] {
  return items.map(raw => {
    // Trate o item como desconhecido e faça guards em runtime para evitar exceptions
    const item = raw as unknown as Record<string, unknown> | null;
    const nome = item && typeof item.nome === 'string' && item.nome.length > 0 ? item.nome as string : 'analista-sem-nome';
    const global = item && 'global' in item ? item.global as boolean | undefined : undefined;
    const test = item && typeof item.test === 'function' ? item.test as (r: string) => boolean : undefined;

    // preparar aplicar com fallback seguro (no-op retorna array vazio)
    // Nota: capturamos erros internos para evitar promises rejeitadas sem tratamento
    const aplicar = item && typeof item.aplicar === 'function' ? async (conteudo: string, relPath: string, ast: object | null, fullCaminho?: string, contextoGlobal?: import('@').ContextoExecucao) => {
      const astParam = ast as import('@babel/traverse').NodePath<import('@babel/types').Node> | null;
      const aplicarFn = item.aplicar as unknown as Tecnica['aplicar'];
      try {
        const r = await aplicarFn(conteudo, relPath, astParam, fullCaminho, contextoGlobal);
        return r;
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : String(err);
        // Retornamos uma ocorrência descrevendo o erro do analista em vez de lançar
        return [{
          mensagem: `Erro ao executar analista ${nome}: ${mensagem}`,
          nivel: 'erro',
          relPath,
          linha: 0,
          tipo: 'executacao-analista'
        } as import('@').Ocorrencia];
      }
    } : async () => [];
    return {
      nome,
      global,
      test,
      aplicar
    } as import('@').Tecnica;
  });
}

export type OcorrenciaNivel = 'erro' | 'aviso' | 'info' | 'sucesso';

export interface OcorrenciaBase {
  mensagem: string;
  relPath: string;
  tipo?: string;
  nivel?: string | OcorrenciaNivel;
  linha?: number;
  coluna?: number;
  origem?: string;
  arquivo?: string;
}

export interface OcorrenciaAnalista extends OcorrenciaBase {
  tipo: string;
  nivel?: OcorrenciaNivel;
}

export interface OcorrenciaErroAnalista extends OcorrenciaAnalista {
  tipo: 'ERRO_ANALISTA';
  stack?: string;
}

export interface OcorrenciaComplexidadeFuncao extends OcorrenciaAnalista {
  tipo: 'FUNCAO_COMPLEXA';
  linhas?: number;
  parametros?: number;
  aninhamento?: number;
  limites?: {
    maxLinhas?: number;
    maxParametros?: number;
    maxAninhamento?: number;
  };
}

export interface OcorrenciaParseErro extends OcorrenciaAnalista {
  tipo: 'PARSE_ERRO';
  detalhe?: string;
  trecho?: string;
}

export interface OcorrenciaComFix extends OcorrenciaAnalista {
  sugestao?: string;
  quickFixId?: string;
  confidence?: number;
  category?: string;
  matchIndex?: number;
  matchLength?: number;
  contexto?: string;
  detalhes?: Record<string, unknown>;
}

export type Ocorrencia =
  | OcorrenciaBase
  | OcorrenciaAnalista
  | OcorrenciaErroAnalista
  | OcorrenciaComplexidadeFuncao
  | OcorrenciaParseErro
  | OcorrenciaComFix;

export function criarOcorrencia(
  base: Pick<OcorrenciaBase, 'mensagem' | 'relPath'> & Partial<OcorrenciaBase>,
): OcorrenciaBase {
  return {
    nivel: 'info',
    origem: 'prometheus',
    ...base,
    mensagem: base.mensagem.trim(),
  };
}

export function ocorrenciaErroAnalista(data: {
  mensagem: string;
  relPath: string;
  stack?: string;
  origem?: string;
}): OcorrenciaErroAnalista {
  return {
    tipo: 'ERRO_ANALISTA',
    nivel: 'erro',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export function ocorrenciaFuncaoComplexa(data: {
  mensagem: string;
  relPath: string;
  linhas?: number;
  parametros?: number;
  aninhamento?: number;
  limites?: {
    maxLinhas?: number;
    maxParametros?: number;
    maxAninhamento?: number;
  };
  origem?: string;
}): OcorrenciaComplexidadeFuncao {
  return {
    tipo: 'FUNCAO_COMPLEXA',
    nivel: 'aviso',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export function ocorrenciaParseErroFactory(data: {
  mensagem: string;
  relPath: string;
  detalhe?: string;
  trecho?: string;
  origem?: string;
  linha?: number;
  coluna?: number;
}): OcorrenciaParseErro {
  return {
    tipo: 'PARSE_ERRO',
    nivel: 'erro',
    origem: 'prometheus',
    ...data,
    mensagem: data.mensagem.trim(),
  };
}

export { ocorrenciaParseErroFactory as ocorrenciaParseErro };


export interface ResultadoBase {
  timestamp: number;
  duracaoMs: number;
}

export interface ResultadoComArquivos extends ResultadoBase {
  arquivosAnalisados: string[];
  totalArquivos: number;
}

export interface ResultadoStatus {
  status: 'ok' | 'problemas' | 'erro';
}

export interface ResultadoComOcorrencias<T = unknown> extends ResultadoBase {
  ocorrencias: T[];
  totalOcorrencias: number;
}


export type PrometheusRunRecord = {
  id: string;
  timestamp: string;
  cwd: string;
  argv: string[];
  version?: string;
  ok?: boolean;
  exitCode?: number;
  durationMs?: number;
  error?: string;
};

export type PrometheusContextState = {
  schemaVersion: 1;
  lastRuns: PrometheusRunRecord[];
  preferences: Record<string, unknown>;
};

/**
 * Tipos para estratégias de estrutura de projeto
 * Originalmente em: src/shared/helpers/estrutura.ts
 */

export type NomeacaoEstilo = 'kebab' | 'dots' | 'camel';

export interface OpcoesEstrategista {
  preset?: string; // nome do preset de estrutura
  raizCodigo?: string;
  criarSubpastasPorEntidade?: boolean;
  // Quando true, apenas categorias presentes em `categoriasMapa` serão consideradas para movimentação.
  // Útil para modo "manual" (sem preset), onde o usuário decide explicitamente o que mover.
  apenasCategoriasConfiguradas?: boolean;
  estiloPreferido?: NomeacaoEstilo;
  categoriasMapa?: Record<string, string>;
  ignorarPastas?: string[];
}

export interface ParseNomeResultado {
  entidade: string | null;
  categoria: string | null;
}
