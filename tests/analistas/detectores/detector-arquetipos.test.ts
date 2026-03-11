// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarArquetipos } from '../../../src/analistas/detectores/detector-arquetipos';

describe('detectarArquetipos', () => {
  it('should be defined', () => {
    expect(detectarArquetipos).toBeDefined();
    expect(typeof detectarArquetipos).toBe('function');
  });
});
