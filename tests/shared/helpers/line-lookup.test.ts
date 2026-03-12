// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { createLineLookup } from '../../../src/shared/helpers/line-lookup';

describe('line-lookup', () => {
  describe('createLineLookup', () => {
    it('should return lineAt function', () => {
      const lookup = createLineLookup('hello');
      expect(lookup).toBeDefined();
      expect(typeof lookup.lineAt).toBe('function');
    });

    it('should return line 1 for index 0', () => {
      const lookup = createLineLookup('hello\nworld');
      expect(lookup.lineAt(0)).toBe(1);
    });

    it('should return line 1 for null index', () => {
      const lookup = createLineLookup('hello\nworld');
      expect(lookup.lineAt(null)).toBe(1);
    });

    it('should return line 1 for undefined index', () => {
      const lookup = createLineLookup('hello\nworld');
      expect(lookup.lineAt(undefined)).toBe(1);
    });

    it('should return correct line for multiline text', () => {
      const src = 'line1\nline2\nline3\nline4';
      const lookup = createLineLookup(src);
      expect(lookup.lineAt(0)).toBe(1);
      expect(lookup.lineAt(6)).toBe(2); // 'l' of line2
      expect(lookup.lineAt(12)).toBe(3); // 'l' of line3
      expect(lookup.lineAt(18)).toBe(4); // 'l' of line4
    });

    it('should handle single line', () => {
      const lookup = createLineLookup('no newlines');
      expect(lookup.lineAt(5)).toBe(1);
    });

    it('should handle empty string', () => {
      const lookup = createLineLookup('');
      expect(lookup.lineAt(0)).toBe(1);
    });
  });
});
