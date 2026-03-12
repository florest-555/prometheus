// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { syntaxMap, getSyntaxInfoForPath } from '../../../src/shared/impar/syntax-map';

describe('syntax-map', () => {
  describe('syntaxMap', () => {
    it('should have TypeScript entries', () => {
      expect(syntaxMap['.ts']).toBeDefined();
      expect(syntaxMap['.ts'].parser).toBe('typescript');
      expect(syntaxMap['.ts'].formatavel).toBe(true);
    });

    it('should have JavaScript entries', () => {
      expect(syntaxMap['.js']).toBeDefined();
      expect(syntaxMap['.js'].parser).toBe('babel');
    });

    it('should have JSON entry', () => {
      expect(syntaxMap['.json']).toBeDefined();
      expect(syntaxMap['.json'].parser).toBe('json');
    });

    it('should have CSS entry', () => {
      expect(syntaxMap['.css']).toBeDefined();
      expect(syntaxMap['.css'].parser).toBe('css');
    });

    it('should have HTML entry', () => {
      expect(syntaxMap['.html']).toBeDefined();
      expect(syntaxMap['.html'].parser).toBe('html');
    });

    it('should mark Python as not formatable', () => {
      expect(syntaxMap['.py'].formatavel).toBe(false);
    });
  });

  describe('getSyntaxInfoForPath', () => {
    it('should return syntax info for TypeScript', () => {
      const info = getSyntaxInfoForPath('src/index.ts');
      expect(info).toBeDefined();
      expect(info!.parser).toBe('typescript');
    });

    it('should return syntax info for JavaScript', () => {
      const info = getSyntaxInfoForPath('src/app.js');
      expect(info).toBeDefined();
      expect(info!.parser).toBe('babel');
    });

    it('should return null for unknown extensions', () => {
      expect(getSyntaxInfoForPath('file.unknown')).toBeNull();
    });

    it('should handle empty string', () => {
      expect(getSyntaxInfoForPath('')).toBeNull();
    });

    it('should be case-insensitive for path', () => {
      const info = getSyntaxInfoForPath('README.MD');
      expect(info).toBeDefined();
      expect(info!.parser).toBe('markdown');
    });
  });
});
