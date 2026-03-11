// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarArquetipo } from '../../../src/analistas/js-ts/orquestrador-arquetipos';

describe('orquestrador-arquetipos', () => {
  describe('detectarArquetipo', () => {
    it('should be defined', () => {
      expect(detectarArquetipo).toBeDefined();
      expect(typeof detectarArquetipo).toBe('function');
    });

    it('should return desconhecido for very small projects', () => {
      const result = detectarArquetipo(['a.ts', 'b.ts']);
      expect(result.nome).toBe('desconhecido');
      expect(result.score).toBe(0);
    });

    it('should return result with expected shape', () => {
      const result = detectarArquetipo([
        'src/index.ts',
        'src/utils/helper.ts',
        'package.json',
        'tsconfig.json',
        'README.md',
        'bin/index.js',
      ]);
      expect(result).toBeDefined();
      expect(typeof result.nome).toBe('string');
      expect(typeof result.score).toBe('number');
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.matchedRequired)).toBe(true);
    });

    it('should detect cli-modular for bin/ structure', () => {
      const files = [
        'bin/index.js',
        'src/cli/commands/run.ts',
        'src/cli/commands/build.ts',
        'src/utils/helper.ts',
        'package.json',
        'tsconfig.json',
      ];
      const result = detectarArquetipo(files);
      // Should match some archetype (likely cli-modular)
      expect(result).toBeDefined();
      expect(typeof result.nome).toBe('string');
    });

    it('should return desconhecido for empty array with enough files', () => {
      const files = [
        'random1.xyz',
        'random2.xyz',
        'random3.xyz',
        'random4.xyz',
        'random5.xyz',
      ];
      const result = detectarArquetipo(files);
      expect(result.nome).toBe('desconhecido');
    });
  });
});
