// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  extrairSupressoes,
  isRegraSuprimida,
  filtrarOcorrenciasSuprimidas,
} from '../../../src/shared/helpers/suppressao';

describe('suppressao', () => {
  describe('extrairSupressoes', () => {
    it('should return empty for code without directives', () => {
      const result = extrairSupressoes('const x = 1;\nconst y = 2;');
      expect(result.porLinha.size).toBe(0);
      expect(result.blocosAtivos.size).toBe(0);
    });

    it('should parse @prometheus-disable-next-line', () => {
      const src = '// @prometheus-disable-next-line my-rule\nconst x = 1;';
      const result = extrairSupressoes(src);
      expect(result.porLinha.has(2)).toBe(true);
      expect(result.porLinha.get(2)!.has('my-rule')).toBe(true);
    });

    it('should parse @prometheus-disable block', () => {
      const src = '// @prometheus-disable my-rule\nconst x = 1;\nconst y = 2;\n// @prometheus-enable my-rule\nconst z = 3;';
      const result = extrairSupressoes(src);
      expect(result.porLinha.has(2)).toBe(true);
      expect(result.porLinha.get(2)!.has('my-rule')).toBe(true);
      expect(result.porLinha.has(3)).toBe(true);
    });

    it('should parse @prometheus-disable-all', () => {
      const src = '// @prometheus-disable-all\nconst x = 1;';
      const result = extrairSupressoes(src);
      expect(result.porLinha.has(2)).toBe(true);
      expect(result.porLinha.get(2)!.has('*')).toBe(true);
    });

    it('should handle multiple rules per directive', () => {
      const src = '// @prometheus-disable-next-line rule1 rule2\nconst x = 1;';
      const result = extrairSupressoes(src);
      expect(result.porLinha.get(2)!.has('rule1')).toBe(true);
      expect(result.porLinha.get(2)!.has('rule2')).toBe(true);
    });

    it('should handle HTML comment syntax', () => {
      const src = '<!-- @prometheus-disable-next-line my-rule -->\n<div></div>';
      const result = extrairSupressoes(src);
      expect(result.porLinha.has(2)).toBe(true);
    });
  });

  describe('isRegraSuprimida', () => {
    it('should return false when no suppressions', () => {
      const supressoes = { porLinha: new Map(), blocosAtivos: new Set<string>() };
      expect(isRegraSuprimida('rule', 1, supressoes)).toBe(false);
    });

    it('should return true when rule is suppressed on line', () => {
      const porLinha = new Map<number, Set<string>>();
      porLinha.set(5, new Set(['my-rule']));
      const supressoes = { porLinha, blocosAtivos: new Set<string>() };
      expect(isRegraSuprimida('my-rule', 5, supressoes)).toBe(true);
    });

    it('should return true when wildcard suppression applies', () => {
      const porLinha = new Map<number, Set<string>>();
      porLinha.set(5, new Set(['*']));
      const supressoes = { porLinha, blocosAtivos: new Set<string>() };
      expect(isRegraSuprimida('any-rule', 5, supressoes)).toBe(true);
    });

    it('should return false when different rule is suppressed', () => {
      const porLinha = new Map<number, Set<string>>();
      porLinha.set(5, new Set(['other-rule']));
      const supressoes = { porLinha, blocosAtivos: new Set<string>() };
      expect(isRegraSuprimida('my-rule', 5, supressoes)).toBe(false);
    });
  });

  describe('filtrarOcorrenciasSuprimidas', () => {
    it('should return all occurrences when no suppressions', () => {
      const occs = [
        { tipo: 'test', linha: 1 },
        { tipo: 'test', linha: 2 },
      ];
      const result = filtrarOcorrenciasSuprimidas(occs, 'analista', 'const x = 1;\nconst y = 2;');
      expect(result).toHaveLength(2);
    });

    it('should filter suppressed occurrences', () => {
      const src = '// @prometheus-disable-next-line test\nconst x = 1;';
      const occs = [
        { tipo: 'test', linha: 2 },
        { tipo: 'test', linha: 3 },
      ];
      const result = filtrarOcorrenciasSuprimidas(occs, 'analista', src);
      expect(result).toHaveLength(1);
      expect(result[0].linha).toBe(3);
    });

    it('should keep occurrences without line number', () => {
      const src = '// @prometheus-disable-next-line test\ncode';
      const occs = [{ tipo: 'test' }]; // no linha
      const result = filtrarOcorrenciasSuprimidas(occs, 'analista', src);
      expect(result).toHaveLength(1);
    });
  });
});
