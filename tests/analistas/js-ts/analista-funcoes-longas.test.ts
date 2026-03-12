// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaFuncoesLongas } from '../../../src/analistas/js-ts/analista-funcoes-longas';

describe('analistaFuncoesLongas', () => {
  it('should be defined', () => {
    expect(analistaFuncoesLongas).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaFuncoesLongas.nome).toBe('analista-funcoes-longas');
  });

  it('should have correct categoria', () => {
    expect(analistaFuncoesLongas.categoria).toBe('complexidade');
  });

  it('should have a descricao', () => {
    expect(analistaFuncoesLongas.descricao).toBeDefined();
    expect(typeof analistaFuncoesLongas.descricao).toBe('string');
  });

  it('should not be global', () => {
    expect(analistaFuncoesLongas.global).toBe(false);
  });

  it('should identify JS/TS files', () => {
    expect(analistaFuncoesLongas.test!('file.js')).toBe(true);
    expect(analistaFuncoesLongas.test!('file.ts')).toBe(true);
    expect(analistaFuncoesLongas.test!('file.json')).toBe(false);
    expect(analistaFuncoesLongas.test!('file.css')).toBe(false);
  });

  it('should have limites defined', () => {
    expect(analistaFuncoesLongas.limites).toBeDefined();
    expect(analistaFuncoesLongas.limites!.linhas).toBeGreaterThan(0);
    expect(analistaFuncoesLongas.limites!.params).toBeGreaterThan(0);
    expect(analistaFuncoesLongas.limites!.aninhamento).toBeGreaterThan(0);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaFuncoesLongas.aplicar).toBe('function');
  });

  it('should return empty for simple code without AST', () => {
    const result = analistaFuncoesLongas.aplicar('const x = 1;', 'test.ts', null);
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[]).length).toBe(0);
  });
});
