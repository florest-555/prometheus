// SPDX-License-Identifier: MIT-0

export interface PrometheusGlobalFlags {
  silence?: boolean;
  verbose?: boolean;
  export?: boolean;
  dev?: boolean;
  debug?: boolean;
  logEstruturado?: boolean;
  incremental?: boolean;
  meticas?: boolean;
  scanOnly?: boolean;
}

export interface FixTypesOptions {
  dryRun?: boolean;
  target?: string;
  confidence?: number;
  verbose?: boolean;
  interactive?: boolean;
  export?: boolean;
  include?: string[];
  exclude?: string[];
}

export interface OtimizarSvgOptions {
  dir?: string;
  write?: boolean;
  dry?: boolean;
  include?: string[];
  exclude?: string[];
}
