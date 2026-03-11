// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaQualidadeTestes } from '../../../src/analistas/plugins/detector-qualidade-testes';

describe('analistaQualidadeTestes', () => {
  it('should be defined', () => {
    expect(analistaQualidadeTestes).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaQualidadeTestes.nome).toBe('qualidade-testes');
  });
});