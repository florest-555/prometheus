// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaDuplicacoes } from '../../../src/analistas/detectores/detector-duplicacoes';

describe('analistaDuplicacoes', () => {
  it('should be defined', () => {
    expect(analistaDuplicacoes).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaDuplicacoes.nome).toBe('detector-duplicacoes');
  });

  it('should have correct categoria', () => {
    expect(analistaDuplicacoes.categoria).toBe('estrutura');
  });

  it('should have a descricao', () => {
    expect(typeof analistaDuplicacoes.descricao).toBe('string');
  });

  it('should have limites defined', () => {
    expect(analistaDuplicacoes.limites).toBeDefined();
    expect(analistaDuplicacoes.limites!.similaridadeMinima).toBe(80);
    expect(analistaDuplicacoes.limites!.tamanhoMinimoFuncao).toBe(5);
  });

  it('should identify JS/TS files', () => {
    expect(analistaDuplicacoes.test!('file.js')).toBe(true);
    expect(analistaDuplicacoes.test!('file.ts')).toBe(true);
    expect(analistaDuplicacoes.test!('file.jsx')).toBe(true);
    expect(analistaDuplicacoes.test!('file.tsx')).toBe(true);
    expect(analistaDuplicacoes.test!('file.css')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaDuplicacoes.aplicar).toBe('function');
  });

  it('should return empty array when no AST', async () => {
    const result = await analistaDuplicacoes.aplicar('', 'file.ts', null);
    expect(result).toEqual([]);
  });

  it('should return empty array when no contexto', async () => {
    const result = await analistaDuplicacoes.aplicar('const x = 1;', 'file.ts', null);
    expect(result).toEqual([]);
  });
});
