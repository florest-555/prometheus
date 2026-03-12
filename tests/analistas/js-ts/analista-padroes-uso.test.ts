// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaPadroesUso } from '../../../src/analistas/js-ts/analista-padroes-uso';

describe('analistaPadroesUso', () => {
  it('should be defined', () => {
    expect(analistaPadroesUso).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaPadroesUso.nome).toBe('analista-padroes-uso');
  });

  it('should not be global', () => {
    expect(analistaPadroesUso.global).toBe(false);
  });

  it('should identify JS/TS files', () => {
    expect(analistaPadroesUso.test!('file.js')).toBe(true);
    expect(analistaPadroesUso.test!('file.ts')).toBe(true);
    expect(analistaPadroesUso.test!('file.json')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaPadroesUso.aplicar).toBe('function');
  });

  it('should return null for empty AST', () => {
    const result = analistaPadroesUso.aplicar('const x = 1;', 'file.ts', null);
    expect(result).toBeNull();
  });

  it('should return null for test files', () => {
    const result = analistaPadroesUso.aplicar('const x = 1;', 'file.test.ts', null);
    expect(result).toBeNull();
  });
});
