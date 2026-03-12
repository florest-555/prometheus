// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarFantasmas } from '../../../src/analistas/detectores/detector-fantasmas';

describe('detectarFantasmas', () => {
  it('should be defined', () => {
    expect(detectarFantasmas).toBeDefined();
    expect(typeof detectarFantasmas).toBe('function');
  });
});
