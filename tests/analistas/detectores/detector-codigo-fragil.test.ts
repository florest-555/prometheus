// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaCodigoFragil } from '../../../src/analistas/detectores/detector-codigo-fragil';

describe('analistaCodigoFragil', () => {
  it('should be defined', () => {
    expect(analistaCodigoFragil).toBeDefined();
  });

  it('should have a nome', () => {
    expect(typeof analistaCodigoFragil.nome).toBe('string');
  });

  it('should have a categoria', () => {
    expect(typeof analistaCodigoFragil.categoria).toBe('string');
  });

  it('should have test function', () => {
    expect(typeof analistaCodigoFragil.test).toBe('function');
  });

  it('should have aplicar function', () => {
    expect(typeof analistaCodigoFragil.aplicar).toBe('function');
  });
});
