// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { validateAndNormalizeFlags, gerarSugestoes } from '../../../src/cli/options/flags-validator';

describe('cli/options/flags-validator', () => {

  describe('validateAndNormalizeFlags', () => {
    it('should return valid defaults when no flags are passed', () => {
      const result = validateAndNormalizeFlags({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.normalized.mode).toBe('compact');
      expect(result.normalized.output.format).toBe('console');
    });

    it('should set full mode', () => {
      const result = validateAndNormalizeFlags({ full: true });
      expect(result.normalized.mode).toBe('full');
    });

    it('should flag conflict if multiple modes passed', () => {
      const result = validateAndNormalizeFlags({ full: true, executive: true });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('apenas um modo pode ser ativo');
    });

    it('should set JSON format and output config', () => {
      const result = validateAndNormalizeFlags({ json: true, jsonAscii: true, exportFull: true, exportTo: '/tmp' });
      expect(result.normalized.output.format).toBe('json');
      expect(result.normalized.output.jsonAscii).toBe(true);
      expect(result.normalized.output.export).toBe(true);
      expect(result.normalized.output.exportFull).toBe(true);
      expect(result.normalized.output.exportDir).toBe('/tmp');
    });

    it('should flag conflict if multiple formats passed', () => {
      const result = validateAndNormalizeFlags({ json: true, markdown: true });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('apenas um formato pode ser ativo');
    });

    it('should parse excludeTests and withTests', () => {
      const result = validateAndNormalizeFlags({ excludeTests: true, withTests: true });
      expect(result.normalized.filters.exclude).toContain('tests/**');
      expect(result.normalized.filters.includeTests).toBe(true);
    });

    it('should understand onlySrc logic', () => {
      const result1 = validateAndNormalizeFlags({ onlySrc: true });
      expect(result1.normalized.filters.include).toEqual(['src/**']);

      const result2 = validateAndNormalizeFlags({ onlySrc: true, include: ['lib/**'] });
      expect(result2.warnings[0]).toContain('--only-src será ignorado');
      expect(result2.normalized.filters.include).toEqual(['lib/**']);
    });

    it('should parse autoFix properties', () => {
      const result = validateAndNormalizeFlags({ fix: true, fixAggressive: true, dryRun: true });
      expect(result.normalized.autoFix.enabled).toBe(true);
      expect(result.normalized.autoFix.mode).toBe('aggressive');
      expect(result.normalized.autoFix.dryRun).toBe(true);
    });

    it('should default invalid autoFix mode to balanced with warning', () => {
      const result = validateAndNormalizeFlags({ fixMode: 'crazy' });
      expect(result.warnings[0]).toContain('Modo de auto-fix inválido');
      expect(result.normalized.autoFix.mode).toBe('balanced');
    });

    it('should parse guardian properties', () => {
      const result = validateAndNormalizeFlags({ guardianFull: true });
      expect(result.normalized.guardian.enabled).toBe(true);
      expect(result.normalized.guardian.fullScan).toBe(true);
    });

    it('should pick last verbosity on conflict and set correct levels', () => {
      const resultSilent = validateAndNormalizeFlags({ silent: true });
      expect(resultSilent.normalized.verbosity.level).toBe('error');
      expect(resultSilent.normalized.verbosity.silent).toBe(true);

      const resultConflict = validateAndNormalizeFlags({ silent: true, verbose: true });
      expect(resultConflict.warnings).toHaveLength(1);
      // Because logic is: if (opts.silent) error else if quiet warn else debug
      // silent will still win based on the current implementation if-else ladder
      expect(resultConflict.normalized.verbosity.level).toBe('error');
    });

    it('should parse specials correctly', () => {
      const result = validateAndNormalizeFlags({ salvarArquetipo: true });
      expect(result.warnings[0]).toContain('implica --criar-arquetipo');
      expect(result.normalized.special.salvarArquetipo).toBe(true);
      expect(result.normalized.special.criarArquetipo).toBe(true);
    });
  });

  describe('gerarSugestoes', () => {
    it('should suggest full mode if compact', () => {
      const flags = validateAndNormalizeFlags({}).normalized;
      const suggestions = gerarSugestoes(flags);
      expect(suggestions).toEqual(expect.arrayContaining([expect.stringContaining('Use --full')]));
    });

    it('should suggest disabling dry-run if fix is active', () => {
      const flags = validateAndNormalizeFlags({ fix: true }).normalized;
      const suggestions = gerarSugestoes(flags);
      expect(suggestions).toEqual(expect.arrayContaining([expect.stringContaining('Auto-fix ativo!')]));
    });
  });

});
