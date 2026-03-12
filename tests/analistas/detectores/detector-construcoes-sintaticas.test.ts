// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaConstrucoesSintaticas } from '../../../src/analistas/detectores/detector-construcoes-sintaticas';

describe('analistaConstrucoesSintaticas', () => {
  it('should be defined', () => {
    expect(analistaConstrucoesSintaticas).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaConstrucoesSintaticas.nome).toBe('construcoes-sintaticas');
  });

  it('should have correct categoria', () => {
    expect(analistaConstrucoesSintaticas.categoria).toBe('estrutura');
  });

  it('should have a descricao', () => {
    expect(typeof analistaConstrucoesSintaticas.descricao).toBe('string');
  });

  it('should identify JS/TS files', () => {
    expect(analistaConstrucoesSintaticas.test!('file.js')).toBe(true);
    expect(analistaConstrucoesSintaticas.test!('file.ts')).toBe(true);
    expect(analistaConstrucoesSintaticas.test!('file.jsx')).toBe(true);
    expect(analistaConstrucoesSintaticas.test!('file.tsx')).toBe(true);
    expect(analistaConstrucoesSintaticas.test!('file.mjs')).toBe(true);
    expect(analistaConstrucoesSintaticas.test!('file.cjs')).toBe(true);
    expect(analistaConstrucoesSintaticas.test!('file.css')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaConstrucoesSintaticas.aplicar).toBe('function');
  });

  it('should return null for empty src', async () => {
    const result = await analistaConstrucoesSintaticas.aplicar('', 'file.ts', null);
    expect(result).toBeNull();
  });

  it('should return null for null AST', async () => {
    const result = await analistaConstrucoesSintaticas.aplicar('const x = 1;', 'file.ts', null);
    expect(result).toBeNull();
  });
});
