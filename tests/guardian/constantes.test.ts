// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { LINHA_BASE_CAMINHO, REGISTRO_VIGIA_CAMINHO_PADRAO, ALGORITMO_HASH } from '../../src/guardian/constantes';

describe('guardian/constantes', () => {
  it('should export LINHA_BASE_CAMINHO', () => {
    expect(LINHA_BASE_CAMINHO).toBeDefined();
    expect(typeof LINHA_BASE_CAMINHO).toBe('string');
    expect(LINHA_BASE_CAMINHO.length).toBeGreaterThan(0);
  });

  it('should export REGISTRO_VIGIA_CAMINHO_PADRAO', () => {
    expect(REGISTRO_VIGIA_CAMINHO_PADRAO).toBeDefined();
    expect(typeof REGISTRO_VIGIA_CAMINHO_PADRAO).toBe('string');
  });

  it('should export ALGORITMO_HASH', () => {
    expect(ALGORITMO_HASH).toBeDefined();
    expect(typeof ALGORITMO_HASH).toBe('string');
  });
});
