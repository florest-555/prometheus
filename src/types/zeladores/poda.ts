// SPDX-License-Identifier: MIT-0

export interface Pendencia {
  arquivo: string;
  motivo: string;
  detectedAt: number;
  scheduleAt: number;
}

export interface HistoricoItem {
  arquivo: string;
  movidoEm: string;
  motivo: string;
}
