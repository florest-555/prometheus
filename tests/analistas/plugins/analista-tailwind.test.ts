// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaTailwind } from '../../../src/analistas/plugins/analista-tailwind';

describe('analistaTailwind', () => {
  it('should be defined', () => {
    expect(analistaTailwind).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaTailwind.nome).toBe('analista-tailwind');
  });
});