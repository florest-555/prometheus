// SPDX-License-Identifier: MIT-0

import type { Dirent } from 'node:fs';

export interface ScanOptions {
  includeContent?: boolean;
  includeAst?: boolean;
  filter?: (relPath: string, entry: Dirent) => boolean;
  onProgress?: (msg: string) => void;
}
