// SPDX-License-Identifier: MIT-0
/**
 * Sistema de supressão inline para o Prometheus
 * Permite desabilitar regras específicas usando comentários no código
 *
 * Formatos suportados (qualquer sintaxe de comentário inline, ex.: //, #, --, ;, <!-- -->, blocos /* ... * /):
 * - @prometheus-disable-next-line nome-da-regra
 * - @prometheus-disable nome-da-regra
 * - @prometheus-enable nome-da-regra
 */

import type { RegrasSuprimidas, SupressaoInfo } from '@';

export type { RegrasSuprimidas, SupressaoInfo };

/**
 * Analisa comentários do código fonte para extrair diretivas de supressão
 */
export function extrairSupressoes(src: string): RegrasSuprimidas {
  const linhas = src.split('\n');
  const porLinha = new Map<number, Set<string>>();
  const blocosAtivos = new Set<string>();
  const supressoesGlobaisNoArquivo = new Set<string>();

  const normalizarLinha = (linha: string): string => {
    let t = linha.trim();

    // Remove wrappers de comentários comuns (ordem importa para HTML -> bloco -> linha)
    if (t.startsWith('<!--'))
      t = t
        .replace(/^<!--/, '')
        .replace(/--!?>(\s*)?$/, '')
        .trim();
    if (t.startsWith('/*'))
      t = t.replace(/^\/\*/, '').replace(/\*\/$/, '').trim();
    if (t.startsWith('*')) t = t.replace(/^\*\s?/, '').trim(); // linhas internas de bloco

    // Comentários de linha: JS/TS, shell/Python, SQL, INI, outros
    t = t.replace(/^\/\//, '').trim();
    t = t.replace(/^#/, '').trim();
    t = t.replace(/^--/, '').trim();
    t = t.replace(/^;/, '').trim();

    return t;
  };

  // Primeira passada rápida nos primeiros 1000 caracteres (ou primeiras 20 linhas)
  // para detectar @prometheus-disable (sem sufixos) que desabilita no arquivo todo
  const primeirasLinhas = linhas.slice(0, 20);
  for (const l of primeirasLinhas) {
    const linhaNorm = normalizarLinha(l);
    const matchDisable = linhaNorm.match(/^@prometheus-disable\s+(.+)/);
    if (matchDisable) {
      matchDisable[1].trim().split(/\s+/).forEach(r => supressoesGlobaisNoArquivo.add(r.trim()));
    }
  }

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const linhaNorm = normalizarLinha(linha);
    const numeroLinha = i + 1;

    // @prometheus-disable-next-line regra1 regra2
    const matchNextLine = linhaNorm.match(/@prometheus-disable-next-line\s+(.+)/);
    if (matchNextLine) {
      const regras = matchNextLine[1].trim().split(/\s+/);
      const linhaAfetada = numeroLinha + 1;

      if (!porLinha.has(linhaAfetada)) {
        porLinha.set(linhaAfetada, new Set());
      }

      regras.forEach((regra) => {
        porLinha.get(linhaAfetada)?.add(regra.trim());
      });

      continue;
    }

    // @prometheus-disable regra1 regra2
    const matchDisable = linhaNorm.match(/@prometheus-disable\s+(.+)/);
    if (matchDisable) {
      const regras = matchDisable[1].trim().split(/\s+/);
      regras.forEach((regra) => {
        blocosAtivos.add(regra.trim());
      });
      continue;
    }

    // @prometheus-enable regra1 regra2
    const matchEnable = linhaNorm.match(/@prometheus-enable\s+(.+)/);
    if (matchEnable) {
      const regras = matchEnable[1].trim().split(/\s+/);
      regras.forEach((regra) => {
        blocosAtivos.delete(regra.trim());
      });
      continue;
    }

    // @prometheus-disable (desabilita todas as regras)
    if (linhaNorm.includes('@prometheus-disable-all')) {
      blocosAtivos.add('*');
      continue;
    }

    // @prometheus-enable (reabilita todas as regras)
    if (linhaNorm.includes('@prometheus-enable-all')) {
      blocosAtivos.clear();
      continue;
    }

    // Se há blocos ativos ou supressões globais, aplicar a esta linha
    if (blocosAtivos.size > 0 || supressoesGlobaisNoArquivo.size > 0) {
      if (!porLinha.has(numeroLinha)) {
        porLinha.set(numeroLinha, new Set());
      }

      blocosAtivos.forEach((regra) => {
        porLinha.get(numeroLinha)?.add(regra);
      });
      supressoesGlobaisNoArquivo.forEach((regra) => {
        porLinha.get(numeroLinha)?.add(regra);
      });
    }
  }

  return { porLinha, blocosAtivos };
}

/**
 * Verifica se uma regra está suprimida em uma determinada linha
 */
export function isRegraSuprimida(
  regra: string,
  linha: number,
  supressoes: RegrasSuprimidas,
): boolean {
  const regrasDaLinha = supressoes.porLinha.get(linha);

  if (!regrasDaLinha) {
    return false;
  }

  // Verifica supressão específica da regra
  if (regrasDaLinha.has(regra)) {
    return true;
  }

  // Verifica supressão global (*)
  if (regrasDaLinha.has('*')) {
    return true;
  }

  return false;
}

/**
 * Filtra ocorrências baseado em supressões inline
 */
export function filtrarOcorrenciasSuprimidas<
  T extends { linha?: number; tipo?: string },
>(ocorrencias: T[], nomeAnalista: string, src: string): T[] {
  const supressoes = extrairSupressoes(src);

  return ocorrencias.filter((ocorrencia) => {
    if (!ocorrencia.linha) {
      return true; // Mantém ocorrências sem linha (não podem ser suprimidas)
    }

    // Prioriza tipo específico da ocorrência, depois nome do analista
    const _identificadorRegra = ocorrencia.tipo || nomeAnalista || '';

    // Verifica se está suprimida pelo tipo específico OU pelo nome do analista
    const suprimidaPorTipo =
      ocorrencia.tipo &&
      isRegraSuprimida(ocorrencia.tipo, ocorrencia.linha, supressoes);
    const suprimidaPorAnalista = isRegraSuprimida(
      nomeAnalista,
      ocorrencia.linha,
      supressoes,
    );

    return !suprimidaPorTipo && !suprimidaPorAnalista;
  });
}
