// SPDX-License-Identifier: MIT-0


export interface OptionsBase {
  verbose?: boolean;
  dryRun?: boolean;
}

export interface FilterOptions extends OptionsBase {
  include?: string[];
  exclude?: string[];
}

export interface ProgressOptions {
  onProgress?: (msg: string) => void;
  onError?: (error: Error) => void;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}
