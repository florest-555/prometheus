// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import detectorTiposInseguros from '../../../src/analistas/detectores/detector-tipos-inseguros';

describe('detectorTiposInseguros', () => {
  it('should be defined', () => {
    expect(detectorTiposInseguros).toBeDefined();
  });

  it('should have a nome', () => {
    expect(typeof detectorTiposInseguros.nome).toBe('string');
  });

  it('should have test function', () => {
    expect(typeof detectorTiposInseguros.test).toBe('function');
  });

  it('should have aplicar function', () => {
    expect(typeof detectorTiposInseguros.aplicar).toBe('function');
  });
});
