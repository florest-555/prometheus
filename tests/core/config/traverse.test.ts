// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { traverse, __setTraverseModule } from '../../../src/core/config/traverse';

describe('core/config/traverse', () => {
  describe('traverse', () => {
    it('should be a function', () => {
      expect(typeof traverse).toBe('function');
    });
  });

  describe('__setTraverseModule', () => {
    it('should be a function', () => {
      expect(typeof __setTraverseModule).toBe('function');
    });

    it('should accept a function as module', () => {
      const mockFn = () => {};
      __setTraverseModule(mockFn);
      // Even without actually calling traverse, we verify the setter works
    });
  });
});
