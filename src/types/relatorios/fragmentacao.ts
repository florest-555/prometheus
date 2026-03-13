// SPDX-License-Identifier: MIT-0
/**
 * Tipos para fragmentação de relatórios
 */

import type { FileEntryWithAst, Ocorrencia } from '../shared/index.js';

export type FileEntryFragmentacao = FileEntryWithAst | FileEntryFragmentacaoBasico;

export interface FileEntryFragmentacaoBasico {
  relPath?: string;
  fullCaminho?: string;
  path?: string;
  content?: string | null;
  extra?: Record<string, unknown>;
}

export interface Manifest {
  generatedAt: string;
  baseNome: string;
  parts: ManifestPart[];
}

export interface FragmentOptions {
  maxOcorrenciasPerShard?: number;
  maxFileEntriesPerShard?: number;
}

export interface ManifestPart {
  file: string;
  items?: number;
  count?: number;
  sizeBytes?: number;
  bytes?: number;
  compressed?: boolean;
  kind?: string;
  index?: number;
  total?: number;
  summary?: Record<string, unknown>;
  extra?: Record<string, unknown>;
}

export interface RelatorioCompleto {
  resultado?: unknown;
  ocorrencias?: Ocorrencia[];
  fileEntries?: FileEntryWithAst[];
  extra?: Record<string, unknown>;
}
