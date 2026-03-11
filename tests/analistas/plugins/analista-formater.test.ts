// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/shared/impar/formater', () => ({
  formatarPrettierMinimo: vi.fn(),
}));

import { formatarPrettierMinimo } from '../../../src/shared/impar/formater';

async function getAnalistaFormatador() {
  vi.resetModules();
  const { analistaFormatador } = await import('../../../src/analistas/plugins/analista-formater');
  return analistaFormatador;
}

describe('analistaFormatador', () => {
  it('should be defined', async () => {
    const analistaFormatador = await getAnalistaFormatador();
    expect(analistaFormatador).toBeDefined();
  });

  it('should have correct name', async () => {
    const analistaFormatador = await getAnalistaFormatador();
    expect(analistaFormatador.nome).toBe('analista-formatador');
  });

  it('should identify JSON, Markdown, and YAML files', async () => {
    const analistaFormatador = await getAnalistaFormatador();
    expect(analistaFormatador.test('file.json')).toBe(true);
    expect(analistaFormatador.test('file.md')).toBe(true);
    expect(analistaFormatador.test('file.markdown')).toBe(true);
    expect(analistaFormatador.test('file.yaml')).toBe(true);
    expect(analistaFormatador.test('file.yml')).toBe(true);
    expect(analistaFormatador.test('file.js')).toBe(false);
  });

  it('should have aplicar function', async () => {
    const analistaFormatador = await getAnalistaFormatador();
    expect(typeof analistaFormatador.aplicar).toBe('function');
  });
});