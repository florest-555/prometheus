// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { registroAnalistas, listarAnalistas } from '../../../src/analistas/registry/registry';

describe('registry', () => {
  it('should export registroAnalistas', () => {
    expect(registroAnalistas).toBeDefined();
    expect(Array.isArray(registroAnalistas)).toBe(true);
  });

  it('should have non-empty registry', () => {
    expect(registroAnalistas.length).toBeGreaterThan(0);
  });

  it('should export listarAnalistas', () => {
    expect(listarAnalistas).toBeDefined();
    expect(typeof listarAnalistas).toBe('function');
  });

  it('should return info for all registered analistas', () => {
    const lista = listarAnalistas();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
    for (const item of lista) {
      expect(typeof item.nome).toBe('string');
      expect(typeof item.categoria).toBe('string');
    }
  });
});
