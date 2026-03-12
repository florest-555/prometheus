// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import detectorInterfacesInline from '../../../src/analistas/detectores/detector-interfaces-inline';

describe('detectorInterfacesInline', () => {
  it('should be defined', () => {
    expect(detectorInterfacesInline).toBeDefined();
  });

  it('should have a nome', () => {
    expect(typeof detectorInterfacesInline.nome).toBe('string');
  });

  it('should have test function', () => {
    expect(typeof detectorInterfacesInline.test).toBe('function');
  });

  it('should have aplicar function', () => {
    expect(typeof detectorInterfacesInline.aplicar).toBe('function');
  });
});
