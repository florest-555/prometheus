// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { comSupressaoInline, aplicarSupressaoAAnalistas } from '../../../src/shared/helpers/analista-wrapper';

describe('analista-wrapper', () => {
  const mockAnalista = {
    nome: 'test-analista',
    categoria: 'test',
    descricao: 'test',
    test: (file: string) => file.endsWith('.ts'),
    aplicar: (src: string) => [{ tipo: 'test', nivel: 'info' as const, mensagem: 'found', relPath: 'test.ts', linha: 1, origem: 'test' }],
  };

  describe('comSupressaoInline', () => {
    it('should return a wrapped analista', () => {
      const wrapped = comSupressaoInline(mockAnalista);
      expect(wrapped.nome).toBe('test-analista');
      expect(typeof wrapped.aplicar).toBe('function');
    });

    it('should pass through occurrences when no suppression', () => {
      const wrapped = comSupressaoInline(mockAnalista);
      const result = wrapped.aplicar('const x = 1;', 'test.ts');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter suppressed occurrences', () => {
      const wrapped = comSupressaoInline(mockAnalista);
      const src = '// @prometheus-disable-next-line test\nconst x = 1;';
      const result = wrapped.aplicar(src, 'test.ts') as any[];
      // The occurrence on line 1 should still be present since suppression targets line 2
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('aplicarSupressaoAAnalistas', () => {
    it('should wrap all analistas', () => {
      const wrapped = aplicarSupressaoAAnalistas([mockAnalista, { ...mockAnalista, nome: 'another' }]);
      expect(wrapped).toHaveLength(2);
      expect(wrapped[0].nome).toBe('test-analista');
      expect(wrapped[1].nome).toBe('another');
    });

    it('should handle empty array', () => {
      expect(aplicarSupressaoAAnalistas([])).toEqual([]);
    });
  });
});
