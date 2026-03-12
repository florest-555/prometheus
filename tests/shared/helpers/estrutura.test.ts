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

    it('should handle complex ignore patterns with slashes', () => {
      expect(deveIgnorar('src/foo/bar/baz', ['foo/bar'])).toBe(true);
      expect(deveIgnorar('src/foo/bar', ['foo/bar'])).toBe(true);
      expect(deveIgnorar('foo/bar/src', ['foo/bar'])).toBe(true);
    });

    it('should return false for empty pattern', () => {
      expect(deveIgnorar('src/index.ts', [''])).toBe(false);
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

    it('should parse simple suffix (some-service)', () => {
       const result = parseNomeArquivo('some-service.ts');
       expect(result.categoria).toBe('service');
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

    it('should return null if category is not configured and only configured is true', () => {
       const result = destinoPara('user.newcat.ts', 'src', true, true, { controller: 'controllers' });
       expect(result.destinoDir).toBeNull();
       expect(result.motivo).toContain('não configurada');
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

  // Adding tests for carregarConfigEstrategia by importing it - it wasn't imported before!
});

import { carregarConfigEstrategia } from '../../../src/shared/helpers/estrutura';
import * as persistencia from '../../../src/shared/persistence/persistencia';
import { vi } from 'vitest';

describe('helpers/estrutura - carregarConfigEstrategia', () => {
  it('should load default options when no config file exists', async () => {
    // Mock lerEstado to return empty array (default for not found in lerEstado)
    const spy = vi.spyOn(persistencia, 'lerEstado').mockResolvedValue([]);
    
    const result = await carregarConfigEstrategia('/tmp');
    expect(result.raizCodigo).toBe('src');
    expect(result.criarSubpastasPorEntidade).toBe(true);
    spy.mockRestore();
  });

  it('should apply preset options', async () => {
    vi.spyOn(persistencia, 'lerEstado').mockResolvedValue({});
    const result = await carregarConfigEstrategia('/tmp', { preset: 'prometheus' });
    expect(result.criarSubpastasPorEntidade).toBe(false);
    expect(result.ignorarPastas).toContain('tests');
  });

  it('should merge overrides correctly', async () => {
    vi.spyOn(persistencia, 'lerEstado').mockResolvedValue({ raizCodigo: 'app' });
    const result = await carregarConfigEstrategia('/tmp', { criarSubpastasPorEntidade: false });
    expect(result.raizCodigo).toBe('app');
    expect(result.criarSubpastasPorEntidade).toBe(false);
  });
});

