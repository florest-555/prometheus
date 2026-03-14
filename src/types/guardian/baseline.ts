// SPDX-License-Identifier: MIT-0

import type { GpgSignature } from '@pt-types/guardian/gpg.js';

export interface BaselineComAssinatura {
  snapshot: Record<string, string>;
  assinatura?: GpgSignature;
  version: number;
}

export interface SnapshotEstruturaBaseline {
  version: 1;
  timestamp: string;
  arquetipo: string;
  confidence: number;
  arquivosRaiz: string[];
}

export interface ArquetipoDrift {
  alterouArquetipo: boolean;
  anterior?: string;
  atual?: string;
  deltaConfidence: number;
  arquivosRaizNovos: string[];
  arquivosRaizRemovidos: string[];
}
