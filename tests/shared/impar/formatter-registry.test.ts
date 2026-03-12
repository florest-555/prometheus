// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerFormatter, getFormatterForPath, type FormatterFn } from '../../../src/shared/impar/formatter-registry';

describe('shared/impar/formatter-registry', () => {
  const dummyFn: FormatterFn = (code) => ({ code });

  beforeEach(() => {
    // Clear the registry implicitly by overwriting or recreating map, 
    // but since it's a closed module variable we just register random extensions
    registerFormatter('.testclear', dummyFn);
  });

  describe('registerFormatter & getFormatterForPath', () => {
    it('should register and retrieve a formatter by path', () => {
      registerFormatter('.foo', dummyFn);
      
      const retrieved = getFormatterForPath('file.foo');
      expect(retrieved).toBe(dummyFn);

      const upperRetrieved = getFormatterForPath('FILE.FOO');
      expect(upperRetrieved).toBe(dummyFn);
    });

    it('should return null for unregistered extension', () => {
      const retrieved = getFormatterForPath('file.unregistered');
      expect(retrieved).toBeNull();
    });

    it('should handle undefined or empty paths safely', () => {
      // @ts-expect-error testing invalid input
      expect(getFormatterForPath(undefined)).toBeNull();
      expect(getFormatterForPath('')).toBeNull();
    });
  });
});
