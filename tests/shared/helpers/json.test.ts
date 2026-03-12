// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { escapeNonAscii, stringifyJsonEscaped } from '../../../src/shared/helpers/json';

describe('json helpers', () => {
  describe('escapeNonAscii', () => {
    it('should not modify ASCII-only strings', () => {
      expect(escapeNonAscii('hello world')).toBe('hello world');
    });

    it('should escape non-ASCII characters', () => {
      const result = escapeNonAscii('café');
      expect(result).toContain('\\u');
      expect(result).toContain('caf');
    });

    it('should handle empty string', () => {
      expect(escapeNonAscii('')).toBe('');
    });

    it('should escape BMP characters', () => {
      const result = escapeNonAscii('\u00e9'); // é
      expect(result).toContain('\\u00e9');
    });
  });

  describe('stringifyJsonEscaped', () => {
    it('should stringify simple objects', () => {
      const result = stringifyJsonEscaped({ a: 1, b: 'hello' });
      expect(result).toContain('"a"');
      expect(result).toContain('"hello"');
    });

    it('should handle null', () => {
      const result = stringifyJsonEscaped(null);
      expect(result).toBe('null');
    });

    it('should use custom indentation', () => {
      const result = stringifyJsonEscaped({ a: 1 }, 4);
      expect(result).toContain('    ');
    });
  });
});
