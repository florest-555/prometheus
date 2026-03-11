// SPDX-License-Identifier: MIT-0

import type {
  ArquetipoDrift,
  ResultadoDeteccaoArquetipo,
  SnapshotEstruturaBaseline,
} from '@';

export interface EstruturaIdentificadaJson {
  melhores: ResultadoDeteccaoArquetipo[];
  baseline: SnapshotEstruturaBaseline | null;
  drift: ArquetipoDrift;
}
