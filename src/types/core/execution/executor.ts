// SPDX-License-Identifier: MIT-0

import type { MetricaExecucao, Ocorrencia } from '@';

export type EstadoIncrementalExecutor = {
  arquivos: Record<
    string,
    {
      hash: string;
      ocorrencias: Ocorrencia[];
      analistas?: Record<string, { ocorrencias: number; duracaoMs: number }>;
      reaproveitadoCount?: number;
    }
  >;
};

export type CacheValor = {
  mtimeMs: number;
  size: number;
  ast:
    | import('@babel/traverse').NodePath<import('@babel/types').Node>
    | undefined;
};

export type EstadoIncremental = {
  versao: number;
  arquivos: Record<
    string,
    {
      hash: string;
      ocorrencias: Ocorrencia[];
      analistas?: Record<string, { ocorrencias: number; duracaoMs: number }>;
      ultimaExecucaoMs?: number;
      reaproveitadoCount?: number;
    }
  >;
  estatisticas?: {
    totalReaproveitamentos?: number;
    totalArquivosProcessados?: number;
    ultimaDuracaoMs?: number;
  };
};

export type RegistroHistorico = MetricaExecucao & { timestamp: number };

/** Interface mínima para emissão de eventos (compatível com EventEmitter ou objeto custom). */
export interface ExecutorEventEmitter {
  emit(event: string, data?: unknown): void;
}
