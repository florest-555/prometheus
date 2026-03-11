// SPDX-License-Identifier: MIT-0
import { createHash, getHashes } from 'node:crypto';

import type { SnapshotArquivo } from '@';

import { ALGORITMO_HASH } from './constantes.js';

/**
 * Gera um hash hexadecimal a partir do conte�do fornecido.
 */

export function gerarHashHex(conteudo: string): string {
  const candidatos = [ALGORITMO_HASH, 'sha256', 'sha1', 'md5'];
  const disponiveis = new Set(getHashes());
  for (const alg of candidatos) {
    try {
      if (!disponiveis.has(alg)) continue;
      return createHash(alg).update(conteudo).digest('hex');
    } catch {
      // tenta próximo
    }
  }
  throw new Error('Nenhum algoritmo de hash criptográfico disponível no sistema');
}


/**
 * Gera um snapshot do conteúdo incluindo:
 * - Hash de integridade
 * - Número de linhas
 * - Amostra textual do início do arquivo
 */

export function gerarSnapshotDoConteudo(conteudo: string): string {
  const linhas = conteudo.split('\n');
  const snapshot: SnapshotArquivo = {
    hash: gerarHashHex(conteudo),
    linhas: linhas.length,
    amostra: linhas[0]?.slice(0, 200) ?? '',
  };
  return snapshot.hash;
}
