// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  CATEGORIAS_PADRAO,
  PADRAO_OPCOES,
  PRESETS,
  normalizarRel,
  deveIgnorar,
  parseNomeArquivo,
  destinoPara,
} from '../../../src/shared/helpers/estrutura';

describe('helpers/estrutura', () => {
  describe('constants', () => {
    it('should export CATEGORIAS_PADRAO', () => {
      expect(CATEGORIAS_PADRAO).toBeDefined();
      expect(CATEGORIAS_PADRAO.controller).toBe('controllers');
      expect(CATEGORIAS_PADRAO.service).toBe('services');
      expect(CATEGORIAS_PADRAO.test).toBe('__tests__');
    });

    it('should export PADRAO_OPCOES', () => {
      expect(PADRAO_OPCOES.raizCodigo).toBe('src');
      expect(PADRAO_OPCOES.criarSubpastasPorEntidade).toBe(true);
      expect(PADRAO_OPCOES.ignorarPastas).toContain('node_modules');
    });

    it('should export PRESETS', () => {
      expect(PRESETS.prometheus).toBeDefined();
      expect(PRESETS.prometheus.nome).toBe('prometheus');
      expect(PRESETS['node-community']).toBeDefined();
    });
  });

  describe('normalizarRel', () => {
    it('should replace backslashes', () => {
      expect(normalizarRel('foo\\bar\\baz')).toBe('foo/bar/baz');
    });

    it('should not modify forward slashes', () => {
      expect(normalizarRel('foo/bar')).toBe('foo/bar');
    });
  });

  describe('deveIgnorar', () => {
    it('should ignore node_modules', () => {
      expect(deveIgnorar('node_modules/foo/bar.ts', ['node_modules'])).toBe(true);
    });

    it('should ignore nested node_modules', () => {
      expect(deveIgnorar('a/b/node_modules/c.ts', ['node_modules'])).toBe(true);
    });

    it('should not ignore src paths', () => {
      expect(deveIgnorar('src/index.ts', ['node_modules', 'dist'])).toBe(false);
    });

    it('should ignore dist', () => {
      expect(deveIgnorar('dist/bundle.js', ['dist'])).toBe(true);
    });
  });

  describe('parseNomeArquivo', () => {
    it('should parse dot notation (user.controller)', () => {
      const result = parseNomeArquivo('user.controller.ts');
      expect(result.entidade).toBe('user');
      expect(result.categoria).toBe('controller');
    });

    it('should parse kebab (user-service)', () => {
      const result = parseNomeArquivo('user-service.ts');
      expect(result.entidade).toBe('user');
      expect(result.categoria).toBe('service');
    });

    it('should parse camelCase (UserController)', () => {
      const result = parseNomeArquivo('UserController.ts');
      expect(result.entidade).toBe('User');
      expect(result.categoria).toBe('controller');
    });

    it('should return null for unrecognized patterns', () => {
      const result = parseNomeArquivo('utils.ts');
      expect(result.entidade).toBeNull();
      expect(result.categoria).toBeNull();
    });
  });

  describe('destinoPara', () => {
    it('should determine destination for controller file', () => {
      const result = destinoPara('user.controller.ts', 'src', true, false, CATEGORIAS_PADRAO);
      expect(result.destinoDir).toBeDefined();
      expect(result.destinoDir).toContain('controllers');
    });

    it('should return null destinoDir for unknown category', () => {
      const result = destinoPara('utils.ts', 'src', true, true, {});
      expect(result.destinoDir).toBeNull();
    });

    it('should organize by entity when enabled', () => {
      const result = destinoPara('user.controller.ts', 'src', true, false, CATEGORIAS_PADRAO);
      expect(result.destinoDir).toContain('domains');
      expect(result.destinoDir).toContain('user');
    });

    it('should organize by layer when entity disabled', () => {
      const result = destinoPara('user.controller.ts', 'src', false, false, CATEGORIAS_PADRAO);
      expect(result.destinoDir).not.toContain('domains');
      expect(result.destinoDir).toContain('controllers');
    });
  });
});
