// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaEstiloModerno } from '../../../src/analistas/detectores/detector-estilo-moderno';

describe('analistaEstiloModerno', () => {
  it('should be defined', () => {
    expect(analistaEstiloModerno).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaEstiloModerno.nome).toBe('estilo-moderno');
  });

  it('should have correct categoria', () => {
    expect(analistaEstiloModerno.categoria).toBe('estetica');
  });

  it('should have a descricao', () => {
    expect(typeof analistaEstiloModerno.descricao).toBe('string');
  });

  it('should identify JS/TS files', () => {
    expect(analistaEstiloModerno.test!('file.js')).toBe(true);
    expect(analistaEstiloModerno.test!('file.ts')).toBe(true);
    expect(analistaEstiloModerno.test!('file.jsx')).toBe(true);
    expect(analistaEstiloModerno.test!('file.tsx')).toBe(true);
    expect(analistaEstiloModerno.test!('file.mjs')).toBe(true);
    expect(analistaEstiloModerno.test!('file.cjs')).toBe(true);
    expect(analistaEstiloModerno.test!('file.css')).toBe(false);
    expect(analistaEstiloModerno.test!('file.json')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaEstiloModerno.aplicar).toBe('function');
  });

  it('should return null for empty src', async () => {
    const result = await analistaEstiloModerno.aplicar('', 'file.ts', null);
    expect(result).toBeNull();
  });

  it('should return null for null AST', async () => {
    const result = await analistaEstiloModerno.aplicar('const x = 1;', 'file.ts', null);
    expect(result).toBeNull();
  });
});
