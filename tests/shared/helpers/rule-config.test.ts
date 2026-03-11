// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { isRuleSuppressed, getRuleSeverity, shouldSuppressOccurrence } from '../../../src/shared/helpers/rule-config';

describe('rule-config', () => {
  describe('isRuleSuppressed', () => {
    it('should be defined', () => {
      expect(isRuleSuppressed).toBeDefined();
      expect(typeof isRuleSuppressed).toBe('function');
    });

    it('should not suppress by default', () => {
      expect(isRuleSuppressed('unknown-rule-123', 'src/foo.ts')).toBe(false);
    });
  });

  describe('getRuleSeverity', () => {
    it('should be defined', () => {
      expect(getRuleSeverity).toBeDefined();
      expect(typeof getRuleSeverity).toBe('function');
    });

    it('should return undefined for unknown rules', () => {
      expect(getRuleSeverity('unknown-rule-xyz', 'src/foo.ts')).toBeUndefined();
    });
  });

  describe('shouldSuppressOccurrence', () => {
    it('should be defined', () => {
      expect(shouldSuppressOccurrence).toBeDefined();
      expect(typeof shouldSuppressOccurrence).toBe('function');
    });

    it('should not suppress unknown rules', () => {
      expect(shouldSuppressOccurrence('unknown-tipo-xyz', 'src/foo.ts')).toBe(false);
    });
  });
});
