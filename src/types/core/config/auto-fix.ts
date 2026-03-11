// SPDX-License-Identifier: MIT-0

export interface AutoFixConfig {
  mode?: 'conservative' | 'balanced' | 'aggressive';
  minConfidence?: number;
  allowedCategories?: ('security' | 'performance' | 'style' | 'documentation')[];
  excludePadroes?: string[];
  excludeFunctionPatterns?: string[];
  maxFixesPerArquivo?: number;
  createBackup?: boolean;
  validateAfterFix?: boolean;
  allowMutateFs?: boolean;
  backupSuffix?: string;
  conservative?: boolean;
}

export interface PatternBasedQuickFix {
  id: string;
  title: string;
  description: string;
  pattern: RegExp;
  fix: (match: RegExpMatchArray, fullCode: string) => string;
  category: 'security' | 'performance' | 'style' | 'documentation';
  confidence: number;
  shouldApply?: (
    match: RegExpMatchArray,
    fullCode: string,
    lineContext: string,
    fileCaminho?: string,
  ) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
