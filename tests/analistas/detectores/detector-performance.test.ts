// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaDesempenho } from '../../../src/analistas/detectores/detector-performance';

describe('analistaDesempenho', () => {
  it('should be defined', () => {
    expect(analistaDesempenho).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaDesempenho.nome).toBeDefined();
    expect(typeof analistaDesempenho.nome).toBe('string');
  });

  it('should have a categoria', () => {
    expect(typeof analistaDesempenho.categoria).toBe('string');
  });

  it('should have a descricao', () => {
    expect(typeof analistaDesempenho.descricao).toBe('string');
  });

  it('should have test function', () => {
    expect(typeof analistaDesempenho.test).toBe('function');
  });

  it('should have aplicar function', () => {
    expect(typeof analistaDesempenho.aplicar).toBe('function');
  });
});
