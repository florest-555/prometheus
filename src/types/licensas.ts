export interface LicenseScanOptions {
  root?: string;
  includeDev?: boolean;
}
export interface PackageInfo {
  name: string;
  version: string;
  license: string;
  repository: string | null;
  private: boolean;
  licenseArquivo: string | null;
  licenseText: string | null;
  path: string;
}
export interface ScanResult {
  generatedAt: string;
  totalPackages: number;
  totalFiltered: number;
  licenseCounts: Record<string, number>;
  packages: PackageInfo[];
  problematic: PackageInfo[];
}
export interface DisclaimerAddResult {
  updatedArquivos: string[];
}
export interface DisclaimerVerifyResult {
  missing: string[];
}
export interface HeaderOptions {
  projectNome: string;
  license: string;
  ptBr: boolean;
}
export interface RenderPackageMeta {
  licenses?: string | string[];
  publisher?: string;
  email?: string;
  repository?: string;
  licenseArquivo?: string;
  path?: string;
}
export interface GenerateNoticesOptions {
  root?: string;
  ptBr?: boolean;
  output?: string;
}
export interface DisclaimerOptions {
  root?: string;
  disclaimerPath?: string;
  dryRun?: boolean;
}
export type SpdxParseFn = (s: string) => unknown;
export type SpdxCorrectFn = (s: string) => string | null;
