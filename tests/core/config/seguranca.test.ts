// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  sanitizarRelPath,
  estaDentro,
  resolverPluginSeguro,
  validarGlobBasico,
  filtrarGlobSeguros,
} from '../../../src/core/config/seguranca';
import path from 'node:path';

describe('core/config/seguranca', () => {
  describe('sanitizarRelPath', () => {
    it('should normalize backslashes', () => {
      expect(sanitizarRelPath('foo\\bar\\baz')).toBe('foo/bar/baz');
    });

    it('should remove leading slashes', () => {
      expect(sanitizarRelPath('/foo/bar')).toBe('foo/bar');
    });

    it('should remove directory traversal', () => {
      const result = sanitizarRelPath('../../../etc/passwd');
      expect(result).not.toContain('..');
    });

    it('should handle empty string', () => {
      expect(sanitizarRelPath('')).toBe('');
    });

    it('should remove Windows drive letters', () => {
      expect(sanitizarRelPath('C:\\foo\\bar')).toBe('foo/bar');
    });
  });

  describe('estaDentro', () => {
    it('should return true for path inside base', () => {
      expect(estaDentro('/project', '/project/src/foo.ts')).toBe(true);
    });

    it('should return false for path outside base', () => {
      expect(estaDentro('/project', '/other/foo.ts')).toBe(false);
    });

    it('should return false for parent path', () => {
      expect(estaDentro('/project/src', '/project')).toBe(false);
    });
  });

  describe('resolverPluginSeguro', () => {
    const baseDir = '/project';

    it('should reject empty plugin path', () => {
      const result = resolverPluginSeguro(baseDir, '');
      expect(result.erro).toBeDefined();
    });

    it('should reject path outside project', () => {
      const result = resolverPluginSeguro(baseDir, '../../etc/passwd');
      expect(result.erro).toBeDefined();
    });

    it('should accept valid JS plugin', () => {
      const result = resolverPluginSeguro(baseDir, 'plugins/my-plugin.js');
      expect(result.caminho).toBeDefined();
      expect(result.erro).toBeUndefined();
    });

    it('should accept valid TS plugin', () => {
      const result = resolverPluginSeguro(baseDir, 'plugins/my-plugin.ts');
      expect(result.caminho).toBeDefined();
    });

    it('should reject non-JS/TS extensions', () => {
      const result = resolverPluginSeguro(baseDir, 'plugins/my-plugin.sh');
      expect(result.erro).toBeDefined();
    });
  });

  describe('validarGlobBasico', () => {
    it('should accept safe patterns', () => {
      expect(validarGlobBasico('src/**/*.ts')).toBe(true);
      expect(validarGlobBasico('dist/**')).toBe(true);
    });

    it('should reject very long patterns', () => {
      expect(validarGlobBasico('a'.repeat(301))).toBe(false);
    });

    it('should reject patterns with too many **', () => {
      expect(validarGlobBasico('a/**/b/**/c/**/d/**/e/**')).toBe(false);
    });
  });

  describe('filtrarGlobSeguros', () => {
    it('should filter out unsafe patterns', () => {
      const input = ['src/**', 'a'.repeat(301), 'dist/**'];
      const result = filtrarGlobSeguros(input);
      expect(result).toContain('src/**');
      expect(result).toContain('dist/**');
      expect(result).toHaveLength(2);
    });
  });
});
