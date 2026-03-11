// SPDX-License-Identifier: MIT-0
// Helpers utilitários para analistas

import type { Ocorrencia } from '@';
import { criarOcorrencia } from '@';

/**
 * Incrementa um contador de ocorrências por chave.
 */

export function incrementar(
  contador: Record<string, number>,
  chave: string,
): void {
  contador[chave] = (contador[chave] ?? 0) + 1;
}

/**
 * Garante que sempre retorna array vazio se valor for null/undefined.
 */
export function garantirArray<T>(valor: T[] | null | undefined): T[] {
  return Array.isArray(valor) ? valor : [];
}

export interface ErroAnalistaInfo {
  nome: string;
  relPath: string;
  erro: unknown;
  linha?: number;
}

/**
 * Cria uma ocorrência de erro de análise padronizada.
 * Garante que erros de analista não quebrem a execução.
 */
export function criarOcorrenciaErroAnalista(info: ErroAnalistaInfo): Ocorrencia {
  const mensagem = info.erro instanceof Error
    ? info.erro.message
    : String(info.erro);

  return criarOcorrencia({
    tipo: 'erro-analista',
    nivel: 'aviso',
    mensagem: `Erro no analista ${info.nome}: ${mensagem}`,
    relPath: info.relPath,
    linha: info.linha ?? 1,
    origem: info.nome
  });
}

/**
 * Wrapper para executar função de analista com tratamento de erros consistente.
 * Sempre retorna array vazio em vez de lançar exceção.
 */
export function executarComTratamentoErro<T extends Ocorrencia[]>(
  fn: () => T,
  nomeAnalista: string,
  relPath: string,
  linhaErro: number = 1
): T {
  try {
    return fn();
  } catch (erro) {
    return [criarOcorrenciaErroAnalista({
      nome: nomeAnalista,
      relPath,
      erro,
      linha: linhaErro
    })] as T;
  }
}

/**
 * Wrapper async para executar função de analista com tratamento de erros consistente.
 * Sempre retorna array vazio em vez de lançar exceção.
 */
export async function executarAsyncComTratamentoErro<T extends Ocorrencia[]>(
  fn: () => Promise<T>,
  nomeAnalista: string,
  relPath: string,
  linhaErro: number = 1
): Promise<T> {
  try {
    return await fn();
  } catch (erro) {
    return [criarOcorrenciaErroAnalista({
      nome: nomeAnalista,
      relPath,
      erro,
      linha: linhaErro
    })] as T;
  }
}
