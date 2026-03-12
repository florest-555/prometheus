// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { escapeNonAscii, escapeJsonAscii, stringifyJsonEscaped } from '../../../src/shared/data-processing/json';

describe('data-processing/json', () => {
  describe('escapeNonAscii', () => {
    it('should not modify ASCII strings', () => {
      expect(escapeNonAscii('hello')).toBe('hello');
    });

    it('should escape non-ASCII characters', () => {
      const result = escapeNonAscii('café');
      expect(result).toContain('\\u');
    });

    it('should handle empty string', () => {
      expect(escapeNonAscii('')).toBe('');
    });
  });

  describe('escapeJsonAscii', () => {
    it('should not modify ASCII-only JSON', () => {
      const json = '{"key": "value"}';
      expect(escapeJsonAscii(json)).toBe(json);
    });

    it('should escape non-ASCII in JSON', () => {
      const result = escapeJsonAscii('{"key": "café"}');
      expect(result).toContain('\\u');
    });
  });

  describe('stringifyJsonEscaped', () => {
    it('should stringify objects', () => {
      const result = stringifyJsonEscaped({ a: 1 });
      expect(result).toContain('"a"');
    });

    it('should use custom indentation', () => {
      const result = stringifyJsonEscaped({ a: 1 }, 4);
      expect(result).toContain('    ');
    });

    it('should convert to ASCII-only when option set', () => {
      const result = stringifyJsonEscaped({ key: 'café' }, 2, { asciiOnly: true });
      expect(result).toContain('\\u');
    });

    it('should keep UTF-8 by default', () => {
      const result = stringifyJsonEscaped({ key: 'café' });
      expect(result).toContain('café');
    });
  });
});
