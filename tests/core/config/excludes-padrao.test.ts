// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  EXCLUDES_PADRAO,
  getExcludesRecomendados,
  isPadraoExclusaoSeguro,
  mesclarConfigExcludes,
} from '../../../src/core/config/excludes-padrao';

describe('core/config/excludes-padrao', () => {
  describe('EXCLUDES_PADRAO', () => {
    it('should be defined', () => {
      expect(EXCLUDES_PADRAO).toBeDefined();
    });

    it('should have padroesSistema', () => {
      expect(EXCLUDES_PADRAO.padroesSistema).toBeDefined();
      expect(EXCLUDES_PADRAO.padroesSistema.length).toBeGreaterThan(0);
      expect(EXCLUDES_PADRAO.padroesSistema).toContain('node_modules');
    });

    it('should have nodeJs patterns', () => {
      expect(EXCLUDES_PADRAO.nodeJs.length).toBeGreaterThan(0);
    });

    it('should have typeScript patterns', () => {
      expect(EXCLUDES_PADRAO.typeScript.length).toBeGreaterThan(0);
    });

    it('should have python patterns', () => {
      expect(EXCLUDES_PADRAO.python.length).toBeGreaterThan(0);
    });

    it('should have metadata', () => {
      expect(EXCLUDES_PADRAO.metadata.versao).toBeDefined();
    });
  });

  describe('getExcludesRecomendados', () => {
    it('should return system patterns for generic', () => {
      const result = getExcludesRecomendados('generico');
      expect(result).toContain('node_modules');
    });

    it('should return nodejs patterns', () => {
      const result = getExcludesRecomendados('nodejs');
      expect(result).toContain('node_modules');
      expect(result).toContain('coverage/**');
    });

    it('should return typescript patterns', () => {
      const result = getExcludesRecomendados('typescript');
      expect(result.some(p => p.includes('tsbuildinfo'))).toBe(true);
    });

    it('should return python patterns', () => {
      const result = getExcludesRecomendados('python');
      expect(result.some(p => p.includes('__pycache__'))).toBe(true);
    });

    it('should return java patterns', () => {
      const result = getExcludesRecomendados('java');
      expect(result.some(p => p.includes('target'))).toBe(true);
    });

    it('should return dotnet patterns', () => {
      const result = getExcludesRecomendados('dotnet');
      expect(result.some(p => p.includes('obj'))).toBe(true);
    });

    it('should default to generic for unknown types', () => {
      const result = getExcludesRecomendados('unknown-language');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('isPadraoExclusaoSeguro', () => {
    it('should reject dangerous patterns', () => {
      expect(isPadraoExclusaoSeguro('**/*')).toBe(false);
      expect(isPadraoExclusaoSeguro('*')).toBe(false);
      expect(isPadraoExclusaoSeguro('**')).toBe(false);
      expect(isPadraoExclusaoSeguro('')).toBe(false);
    });

    it('should accept safe patterns', () => {
      expect(isPadraoExclusaoSeguro('node_modules/**')).toBe(true);
      expect(isPadraoExclusaoSeguro('dist/**')).toBe(true);
      expect(isPadraoExclusaoSeguro('*.log')).toBe(true);
    });

    it('should reject patterns with too many consecutive asterisks', () => {
      expect(isPadraoExclusaoSeguro('***')).toBe(false);
      expect(isPadraoExclusaoSeguro('****')).toBe(false);
    });
  });

  describe('mesclarConfigExcludes', () => {
    it('should use user config when provided', () => {
      const result = mesclarConfigExcludes(['custom/**', 'temp/**']);
      expect(result).toContain('custom/**');
      expect(result).toContain('temp/**');
    });

    it('should filter unsafe patterns from user config', () => {
      const result = mesclarConfigExcludes(['safe/**', '**/*']);
      expect(result).toContain('safe/**');
      expect(result).not.toContain('**/*');
    });

    it('should use recommended patterns when no user config', () => {
      const result = mesclarConfigExcludes(null);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use recommended patterns for empty array', () => {
      const result = mesclarConfigExcludes([]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should deduplicate patterns', () => {
      const result = mesclarConfigExcludes(['a/**', 'a/**', 'b/**']);
      const unique = new Set(result);
      expect(result.length).toBe(unique.size);
    });
  });
});
