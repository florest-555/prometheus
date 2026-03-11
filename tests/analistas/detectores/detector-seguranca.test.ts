// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaSeguranca } from '../../../src/analistas/detectores/detector-seguranca';

describe('analistaSeguranca', () => {
  it('should be defined', () => {
    expect(analistaSeguranca).toBeDefined();
  });

  it('should have a nome', () => {
    expect(typeof analistaSeguranca.nome).toBe('string');
  });

  it('should have a categoria', () => {
    expect(typeof analistaSeguranca.categoria).toBe('string');
  });

  it('should have a descricao', () => {
    expect(typeof analistaSeguranca.descricao).toBe('string');
  });

  it('should have test function', () => {
    expect(typeof analistaSeguranca.test).toBe('function');
  });

  it('should have aplicar function', () => {
    expect(typeof analistaSeguranca.aplicar).toBe('function');
  });
});
