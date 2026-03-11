// SPDX-License-Identifier: MIT-0

export interface SnapshotDiff {
  adicionados: string[];
  removidos: string[];
  modificados: string[];
}

export interface SnapshotDetalhado {
  hash: string;
  timestamp: string;
  arquivos: Record<string, string>;
}

export type Snapshot = Record<string, string>;
export type SnapshotBaseline = Snapshot;
