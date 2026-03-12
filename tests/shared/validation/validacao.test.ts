// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  isFilenameSafe,
  sanitizeFilename,
  isRelativePathValid,
  getFileExtension,
  isExtensionAllowed,
  validarNumeroPositivo,
  validarCombinacoes,
  sanitizarFlags,
} from '../../../src/shared/validation/validacao';

describe('validacao', () => {
  describe('isFilenameSafe', () => {
    it('should accept valid filenames', () => {
      expect(isFilenameSafe('file.ts')).toBe(true);
      expect(isFilenameSafe('my-component.tsx')).toBe(true);
      expect(isFilenameSafe('README.md')).toBe(true);
    });

    it('should reject empty filename', () => {
      expect(isFilenameSafe('')).toBe(false);
    });

    it('should reject filenames with invalid characters', () => {
      expect(isFilenameSafe('file<name>.ts')).toBe(false);
      expect(isFilenameSafe('file|name.ts')).toBe(false);
      expect(isFilenameSafe('file?name.ts')).toBe(false);
    });

    it('should reject reserved Windows names', () => {
      expect(isFilenameSafe('CON')).toBe(false);
      expect(isFilenameSafe('CON.txt')).toBe(false);
      expect(isFilenameSafe('PRN')).toBe(false);
      expect(isFilenameSafe('NUL')).toBe(false);
    });

    it('should reject very long filenames', () => {
      expect(isFilenameSafe('a'.repeat(256))).toBe(false);
    });

    it('should accept filenames up to 255 chars', () => {
      expect(isFilenameSafe('a'.repeat(255))).toBe(true);
    });
  });

  describe('sanitizeFilename', () => {
    it('should replace invalid characters with underscores', () => {
      const result = sanitizeFilename('file<name>.ts');
      expect(result).toBe('file_name_.ts');
    });

    it('should truncate to 255 characters', () => {
      const result = sanitizeFilename('a'.repeat(300));
      expect(result.length).toBe(255);
    });

    it('should not modify valid filenames', () => {
      expect(sanitizeFilename('valid-file.ts')).toBe('valid-file.ts');
    });
  });

  describe('isRelativePathValid', () => {
    it('should accept valid relative paths', () => {
      expect(isRelativePathValid('src/utils/helper.ts')).toBe(true);
      expect(isRelativePathValid('file.ts')).toBe(true);
    });

    it('should reject empty paths', () => {
      expect(isRelativePathValid('')).toBe(false);
    });

    it('should reject absolute paths', () => {
      expect(isRelativePathValid('/usr/bin/node')).toBe(false);
    });

    it('should reject paths starting with ..', () => {
      expect(isRelativePathValid('../../../etc/passwd')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should return the extension in lowercase', () => {
      expect(getFileExtension('file.TS')).toBe('.ts');
      expect(getFileExtension('file.JS')).toBe('.js');
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('Dockerfile')).toBe('');
    });
  });

  describe('isExtensionAllowed', () => {
    it('should return true for allowed extensions', () => {
      expect(isExtensionAllowed('file.ts', ['.ts', '.js'])).toBe(true);
    });

    it('should return false for disallowed extensions', () => {
      expect(isExtensionAllowed('file.css', ['.ts', '.js'])).toBe(false);
    });
  });

  describe('validarNumeroPositivo', () => {
    it('should return positive number', () => {
      expect(validarNumeroPositivo(5, 'test')).toBe(5);
    });

    it('should return null for negative number', () => {
      expect(validarNumeroPositivo(-1, 'test')).toBeNull();
    });

    it('should return null for zero', () => {
      expect(validarNumeroPositivo(0, 'test')).toBeNull();
    });

    it('should parse positive string number', () => {
      expect(validarNumeroPositivo('42', 'test')).toBe(42);
    });

    it('should return null for non-numeric string', () => {
      expect(validarNumeroPositivo('abc', 'test')).toBeNull();
    });

    it('should return null for boolean', () => {
      expect(validarNumeroPositivo(true, 'test')).toBeNull();
    });
  });

  describe('validarCombinacoes', () => {
    it('should return empty array for valid flags', () => {
      const result = validarCombinacoes({ verbose: true });
      expect(result).toEqual([]);
    });

    it('should detect scanOnly + incremental conflict', () => {
      const result = validarCombinacoes({ scanOnly: true, incremental: true });
      expect(result).toHaveLength(1);
      expect(result[0].codigo).toBe('SCAN_INCREMENTAL');
    });
  });

  describe('sanitizarFlags', () => {
    it('should not throw for valid flags', () => {
      expect(() => sanitizarFlags({ verbose: true })).not.toThrow();
    });

    it('should throw for invalid flag combinations', () => {
      expect(() => sanitizarFlags({ scanOnly: true, incremental: true })).toThrow();
    });
  });
});
