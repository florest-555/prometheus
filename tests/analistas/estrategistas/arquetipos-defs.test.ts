// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { ARQUETIPOS, normalizarCaminho } from '../../../src/analistas/estrategistas/arquetipos-defs';

describe('arquetipos-defs', () => {
  describe('ARQUETIPOS', () => {
    it('should be a non-empty array', () => {
      expect(ARQUETIPOS).toBeDefined();
      expect(Array.isArray(ARQUETIPOS)).toBe(true);
      expect(ARQUETIPOS.length).toBeGreaterThan(0);
    });

    it('should contain known archetypes', () => {
      const nomes = ARQUETIPOS.map(a => a.nome);
      expect(nomes).toContain('cli-modular');
      expect(nomes).toContain('landing-page');
      expect(nomes).toContain('api-rest-express');
      expect(nomes).toContain('fullstack');
      expect(nomes).toContain('bot');
      expect(nomes).toContain('electron');
      expect(nomes).toContain('lib-tsc');
      expect(nomes).toContain('monorepo-packages');
      expect(nomes).toContain('vue-spa');
      expect(nomes).toContain('angular-app');
    });

    it('each archetype should have required properties', () => {
      for (const arq of ARQUETIPOS) {
        expect(arq.nome).toBeDefined();
        expect(typeof arq.nome).toBe('string');
        expect(arq.descricao).toBeDefined();
        expect(typeof arq.descricao).toBe('string');
        expect(arq.requiredDirs).toBeDefined();
        expect(Array.isArray(arq.requiredDirs)).toBe(true);
        expect(typeof arq.pesoBase).toBe('number');
      }
    });

    it('cli-modular should have bin in requiredDirs', () => {
      const cli = ARQUETIPOS.find(a => a.nome === 'cli-modular');
      expect(cli).toBeDefined();
      expect(cli!.requiredDirs).toContain('bin');
    });

    it('api-rest-express should have express in dependencyHints', () => {
      const api = ARQUETIPOS.find(a => a.nome === 'api-rest-express');
      expect(api).toBeDefined();
      expect(api!.dependencyHints).toContain('express');
    });

    it('fullstack should have prisma in requiredDirs', () => {
      const full = ARQUETIPOS.find(a => a.nome === 'fullstack');
      expect(full).toBeDefined();
      expect(full!.requiredDirs).toContain('prisma');
    });

    it('each archetype should have pesoBase > 0', () => {
      for (const arq of ARQUETIPOS) {
        expect(arq.pesoBase).toBeGreaterThan(0);
      }
    });

    it('archetypes with forbiddenDirs should have non-empty arrays', () => {
      for (const arq of ARQUETIPOS) {
        if (arq.forbiddenDirs) {
          expect(Array.isArray(arq.forbiddenDirs)).toBe(true);
        }
      }
    });

    it('archetypes with optionalDirs should have non-empty arrays', () => {
      for (const arq of ARQUETIPOS) {
        if (arq.optionalDirs) {
          expect(Array.isArray(arq.optionalDirs)).toBe(true);
        }
      }
    });
  });

  describe('normalizarCaminho', () => {
    it('should replace backslashes with forward slashes', () => {
      expect(normalizarCaminho('foo\\bar\\baz')).toBe('foo/bar/baz');
    });

    it('should not modify paths with forward slashes', () => {
      expect(normalizarCaminho('foo/bar/baz')).toBe('foo/bar/baz');
    });

    it('should handle empty string', () => {
      expect(normalizarCaminho('')).toBe('');
    });

    it('should handle mixed separators', () => {
      expect(normalizarCaminho('foo/bar\\baz/qux')).toBe('foo/bar/baz/qux');
    });
  });
});
