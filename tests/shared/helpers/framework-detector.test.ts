// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarFrameworks, hasFramework } from '../../../src/shared/helpers/framework-detector';
import path from 'node:path';

describe('framework-detector', () => {
  describe('detectarFrameworks', () => {
    it('should return empty array for non-existent directory', () => {
      const result = detectarFrameworks('/tmp/non-existent-dir-xyz');
      expect(result).toEqual([]);
    });

    it('should detect frameworks from current project', () => {
      const result = detectarFrameworks(path.resolve(__dirname, '../../..'));
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('hasFramework', () => {
    it('should return false for non-existent directory', () => {
      expect(hasFramework('/tmp/non-existent-dir-xyz', 'React')).toBe(false);
    });

    it('should return boolean', () => {
      const result = hasFramework(path.resolve(__dirname, '../../..'), 'NonExistentFramework');
      expect(typeof result).toBe('boolean');
    });
  });
});
