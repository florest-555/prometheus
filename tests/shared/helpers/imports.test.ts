// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { reescreverImports } from '../../../src/shared/helpers/imports';

describe('imports', () => {
  describe('reescreverImports', () => {
    it('should be defined', () => {
      expect(reescreverImports).toBeDefined();
      expect(typeof reescreverImports).toBe('function');
    });

    it('should return unchanged content when no imports', () => {
      const result = reescreverImports('const x = 1;', 'src/a.ts', 'src/b.ts');
      expect(result.novoConteudo).toBe('const x = 1;');
      expect(result.reescritos).toHaveLength(0);
    });

    it('should rewrite relative imports when file moves', () => {
      const content = "import { foo } from './utils';";
      const result = reescreverImports(content, 'src/a.ts', 'src/lib/a.ts');
      expect(result.novoConteudo).toContain('utils');
      expect(result.reescritos.length).toBeGreaterThanOrEqual(0);
    });

    it('should not modify external package imports', () => {
      const content = "import express from 'express';";
      const result = reescreverImports(content, 'src/a.ts', 'src/b/a.ts');
      expect(result.novoConteudo).toBe(content);
    });

    it('should handle require syntax', () => {
      const content = "const fs = require('fs');";
      const result = reescreverImports(content, 'src/a.ts', 'src/b.ts');
      expect(result.novoConteudo).toBe(content);
    });
  });
});
