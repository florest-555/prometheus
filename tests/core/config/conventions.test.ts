// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  getTypesDirectoryRelPosix,
  getTypesDirectoryDisplay,
  isInsideTypesDirectory,
  buildTypesRelPathPosix,
  buildTypesFsPath,
} from '../../../src/core/config/conventions';

describe('core/config/conventions', () => {
  describe('getTypesDirectoryRelPosix', () => {
    it('should return a string', () => {
      const result = getTypesDirectoryRelPosix();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should not have leading or trailing slashes', () => {
      const result = getTypesDirectoryRelPosix();
      expect(result.startsWith('/')).toBe(false);
      expect(result.endsWith('/')).toBe(false);
    });
  });

  describe('getTypesDirectoryDisplay', () => {
    it('should end with /', () => {
      const result = getTypesDirectoryDisplay();
      expect(result.endsWith('/')).toBe(true);
    });
  });

  describe('isInsideTypesDirectory', () => {
    it('should return true for files inside types dir', () => {
      const typesDir = getTypesDirectoryRelPosix();
      expect(isInsideTypesDirectory(`${typesDir}/index.ts`)).toBe(true);
    });

    it('should return true for the types dir itself', () => {
      const typesDir = getTypesDirectoryRelPosix();
      expect(isInsideTypesDirectory(typesDir)).toBe(true);
    });

    it('should return false for files outside types dir', () => {
      expect(isInsideTypesDirectory('src/utils/helper.ts')).toBe(false);
    });
  });

  describe('buildTypesRelPathPosix', () => {
    it('should build path inside types directory', () => {
      const result = buildTypesRelPathPosix('shared/user.ts');
      const typesDir = getTypesDirectoryRelPosix();
      expect(result).toBe(`${typesDir}/shared/user.ts`);
    });

    it('should return types directory for empty input', () => {
      const result = buildTypesRelPathPosix('');
      const typesDir = getTypesDirectoryRelPosix();
      expect(result).toBe(typesDir);
    });
  });

  describe('buildTypesFsPath', () => {
    it('should build filesystem path', () => {
      const result = buildTypesFsPath('shared/user.ts');
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
