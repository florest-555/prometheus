// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { formatMs, formatPct, formatCount, formatDiff, calcPctVar } from '../../../src/core/config/format';

describe('core/config/format', () => {
  describe('formatMs', () => {
    it('should format sub-millisecond', () => {
      expect(formatMs(0.5)).toBe('0.50ms');
    });

    it('should format milliseconds', () => {
      expect(formatMs(500)).toBe('500.0ms');
    });

    it('should format seconds', () => {
      expect(formatMs(5000)).toBe('5.00s');
    });

    it('should format minutes', () => {
      expect(formatMs(120000)).toBe('2m0s');
    });

    it('should return - for null', () => {
      expect(formatMs(null)).toBe('-');
    });

    it('should return - for undefined', () => {
      expect(formatMs(undefined)).toBe('-');
    });

    it('should return - for NaN', () => {
      expect(formatMs(NaN)).toBe('-');
    });
  });

  describe('formatPct', () => {
    it('should format positive percentage with +', () => {
      expect(formatPct(25.5)).toBe('+25.5%');
    });

    it('should format negative percentage', () => {
      expect(formatPct(-10.3)).toBe('-10.3%');
    });

    it('should format zero', () => {
      expect(formatPct(0)).toBe('0.0%');
    });

    it('should return 0.0% for null', () => {
      expect(formatPct(null)).toBe('0.0%');
    });
  });

  describe('formatCount', () => {
    it('should format small numbers', () => {
      expect(formatCount(42)).toBe('42');
    });

    it('should format thousands', () => {
      expect(formatCount(1500)).toBe('1.5k');
    });

    it('should format millions', () => {
      expect(formatCount(2500000)).toBe('2.50M');
    });

    it('should return 0 for null', () => {
      expect(formatCount(null)).toBe('0');
    });
  });

  describe('formatDiff', () => {
    it('should format diff between two values', () => {
      const result = formatDiff(100, 200);
      expect(result).toContain('=>');
    });

    it('should return - when either value is undefined', () => {
      expect(formatDiff(undefined, 100)).toBe('-');
      expect(formatDiff(100, undefined)).toBe('-');
    });
  });

  describe('calcPctVar', () => {
    it('should calculate percentage variation', () => {
      expect(calcPctVar(100, 150)).toBe(50);
    });

    it('should return 0 for null inputs', () => {
      expect(calcPctVar(undefined, 100)).toBe(0);
      expect(calcPctVar(100, undefined)).toBe(0);
    });

    it('should return 0 for zero base', () => {
      expect(calcPctVar(0, 100)).toBe(0);
    });

    it('should handle negative variation', () => {
      expect(calcPctVar(200, 100)).toBe(-50);
    });
  });
});
