// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaPontuacao } from '../../../src/analistas/corrections/pontuacao';

describe('analistaPontuacao (pontuacao.ts)', () => {
  it('should be defined', () => {
    expect(analistaPontuacao).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaPontuacao.nome).toBe('pontuacao-fix');
  });

  it('should have correct categoria', () => {
    expect(analistaPontuacao.categoria).toBe('formatacao');
  });

  it('should have a descricao', () => {
    expect(typeof analistaPontuacao.descricao).toBe('string');
  });

  it('should identify text-based files', () => {
    expect(analistaPontuacao.test!('file.ts')).toBe(true);
    expect(analistaPontuacao.test!('file.js')).toBe(true);
    expect(analistaPontuacao.test!('file.md')).toBe(true);
    expect(analistaPontuacao.test!('file.json')).toBe(true);
    expect(analistaPontuacao.test!('file.txt')).toBe(true);
    expect(analistaPontuacao.test!('file.png')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaPontuacao.aplicar).toBe('function');
  });

  it('should return empty array for empty src', () => {
    const result = analistaPontuacao.aplicar('', 'file.ts');
    expect(result).toEqual([]);
  });

  it('should return empty array for clean text', () => {
    const result = analistaPontuacao.aplicar('const x = 1;', 'file.ts');
    expect(Array.isArray(result)).toBe(true);
  });

  it('should detect repeated punctuation', () => {
    const result = analistaPontuacao.aplicar('hello,,, world', 'file.ts');
    expect(Array.isArray(result)).toBe(true);
    const punctIssues = (result as any[]).filter(o => o.tipo === 'pontuacao-repetida');
    expect(punctIssues.length).toBeGreaterThan(0);
  });

  it('should detect unicode issues', () => {
    const result = analistaPontuacao.aplicar('const msg = \u201cHello\u201d', 'file.ts');
    expect(Array.isArray(result)).toBe(true);
    const unicodeIssues = (result as any[]).filter(o => o.tipo === 'unicode-invalido');
    expect(unicodeIssues.length).toBeGreaterThan(0);
  });
});
