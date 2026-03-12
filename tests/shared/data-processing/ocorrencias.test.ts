// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { dedupeOcorrencias, agruparAnalistas } from '../../../src/shared/data-processing/ocorrencias';

describe('data-processing/ocorrencias', () => {
  describe('dedupeOcorrencias', () => {
    it('should remove duplicates', () => {
      const occs = [
        { relPath: 'a.ts', linha: 1, tipo: 'err', mensagem: 'msg' },
        { relPath: 'a.ts', linha: 1, tipo: 'err', mensagem: 'msg' },
        { relPath: 'b.ts', linha: 2, tipo: 'err', mensagem: 'msg' },
      ];
      const result = dedupeOcorrencias(occs);
      expect(result).toHaveLength(2);
    });

    it('should preserve order (first wins)', () => {
      const occs = [
        { relPath: 'a.ts', linha: 1, tipo: 'err', mensagem: 'first' },
        { relPath: 'a.ts', linha: 1, tipo: 'err', mensagem: 'first' },
      ];
      const result = dedupeOcorrencias(occs);
      expect(result[0].mensagem).toBe('first');
    });

    it('should handle empty array', () => {
      expect(dedupeOcorrencias([])).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(dedupeOcorrencias(null as any)).toEqual([]);
    });

    it('should not dedupe different occurrences', () => {
      const occs = [
        { relPath: 'a.ts', linha: 1, tipo: 'err', mensagem: 'a' },
        { relPath: 'a.ts', linha: 1, tipo: 'err', mensagem: 'b' },
      ];
      const result = dedupeOcorrencias(occs);
      expect(result).toHaveLength(2);
    });
  });

  describe('agruparAnalistas', () => {
    it('should group by name', () => {
      const input = [
        { nome: 'a', duracaoMs: 100, ocorrencias: 5 },
        { nome: 'a', duracaoMs: 200, ocorrencias: 3 },
        { nome: 'b', duracaoMs: 50, ocorrencias: 1 },
      ];
      const result = agruparAnalistas(input);
      expect(result).toHaveLength(2);
      const groupA = result.find(r => r.nome === 'a');
      expect(groupA?.duracaoMs).toBe(300);
      expect(groupA?.ocorrencias).toBe(8);
      expect(groupA?.execucoes).toBe(2);
    });

    it('should sort by occurrences desc', () => {
      const input = [
        { nome: 'low', duracaoMs: 100, ocorrencias: 1 },
        { nome: 'high', duracaoMs: 100, ocorrencias: 10 },
      ];
      const result = agruparAnalistas(input);
      expect(result[0].nome).toBe('high');
    });

    it('should return empty array for empty input', () => {
      expect(agruparAnalistas([])).toEqual([]);
      expect(agruparAnalistas(undefined)).toEqual([]);
      expect(agruparAnalistas(null as any)).toEqual([]);
    });
  });
});
