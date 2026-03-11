// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { SRC_RAIZ, SRC_GLOB, META_DIRS, toPosix, isInsideSrc, isMetaPath } from '../../../src/core/config/paths';

describe('core/config/paths', () => {
  describe('constants', () => {
    it('should export SRC_RAIZ', () => {
      expect(SRC_RAIZ).toBe('src');
    });

    it('should export SRC_GLOB', () => {
      expect(SRC_GLOB).toBe('src/**');
    });

    it('should export META_DIRS', () => {
      expect(META_DIRS).toContain('.github');
      expect(META_DIRS).toContain('.vscode');
      expect(META_DIRS).toContain('.prometheus');
    });
  });

  describe('toPosix', () => {
    it('should replace backslashes', () => {
      expect(toPosix('foo\\bar\\baz')).toBe('foo/bar/baz');
    });

    it('should not modify forward slashes', () => {
      expect(toPosix('foo/bar/baz')).toBe('foo/bar/baz');
    });

    it('should handle empty string', () => {
      expect(toPosix('')).toBe('');
    });

    it('should handle undefined/null', () => {
      expect(toPosix(undefined as any)).toBe('');
      expect(toPosix(null as any)).toBe('');
    });
  });

  describe('isInsideSrc', () => {
    it('should return true for src/ paths', () => {
      expect(isInsideSrc('src/index.ts')).toBe(true);
      expect(isInsideSrc('src/utils/helper.ts')).toBe(true);
    });

    it('should return false for non-src paths', () => {
      expect(isInsideSrc('tests/foo.test.ts')).toBe(false);
      expect(isInsideSrc('package.json')).toBe(false);
      expect(isInsideSrc('docs/README.md')).toBe(false);
    });

    it('should handle backslashes', () => {
      expect(isInsideSrc('src\\index.ts')).toBe(true);
    });
  });

  describe('isMetaPath', () => {
    it('should return true for .github paths', () => {
      expect(isMetaPath('.github/workflows/ci.yml')).toBe(true);
    });

    it('should return true for .vscode paths', () => {
      expect(isMetaPath('.vscode/settings.json')).toBe(true);
    });

    it('should return true for root files', () => {
      expect(isMetaPath('package.json')).toBe(true);
      expect(isMetaPath('README.md')).toBe(true);
    });

    it('should return false for src/ paths', () => {
      expect(isMetaPath('src/index.ts')).toBe(false);
    });
  });
});
