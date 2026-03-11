// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaComandosCli, extractHandlerInfo } from '../../../src/analistas/js-ts/analista-comandos-cli';

describe('analistaComandosCli', () => {
  it('should be defined', () => {
    expect(analistaComandosCli).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaComandosCli.nome).toBe('analista-comandos-cli');
  });

  it('should identify JS/TS files', () => {
    expect(analistaComandosCli.test!('src/cli/command.ts')).toBe(true);
    expect(analistaComandosCli.test!('src/index.js')).toBe(true);
    expect(analistaComandosCli.test!('file.json')).toBe(false);
  });

  it('should reject test files', () => {
    expect(analistaComandosCli.test!('tests/cli.test.ts')).toBe(false);
    expect(analistaComandosCli.test!('foo.spec.ts')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaComandosCli.aplicar).toBe('function');
  });

  it('should return empty array when no AST', () => {
    const result = analistaComandosCli.aplicar('', 'file.ts', null);
    expect(result).toEqual([]);
  });
});

describe('extractHandlerInfo', () => {
  it('should be defined', () => {
    expect(extractHandlerInfo).toBeDefined();
    expect(typeof extractHandlerInfo).toBe('function');
  });

  it('should return null for null input', () => {
    expect(extractHandlerInfo(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(extractHandlerInfo(undefined)).toBeNull();
  });

  it('should return null for non-function nodes', () => {
    expect(extractHandlerInfo({ type: 'Identifier', name: 'foo' })).toBeNull();
  });
});
