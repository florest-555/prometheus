// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaArquitetura } from '../../../src/analistas/detectores/detector-arquitetura';

describe('analistaArquitetura', () => {
  it('should be defined', () => {
    expect(analistaArquitetura).toBeDefined();
  });

  it('should have a nome', () => {
    expect(typeof analistaArquitetura.nome).toBe('string');
  });

  it('should have a categoria', () => {
    expect(typeof analistaArquitetura.categoria).toBe('string');
  });

  it('should have a descricao', () => {
    expect(typeof analistaArquitetura.descricao).toBe('string');
  });

  it('should have test function', () => {
    expect(typeof analistaArquitetura.test).toBe('function');
  });

  it('should have aplicar function', () => {
    expect(typeof analistaArquitetura.aplicar).toBe('function');
  });
});
