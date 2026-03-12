// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analisarEstrutura, CAMADAS, CONCORRENCIA } from '../../../src/analistas/arquitetos/analista-estrutura';

describe('analista-estrutura', () => {
  it('should export analisarEstrutura', () => {
    expect(analisarEstrutura).toBeDefined();
    expect(typeof analisarEstrutura).toBe('function');
  });

  it('should export CAMADAS', () => {
    expect(CAMADAS).toBeDefined();
    expect(typeof CAMADAS).toBe('object');
    expect(CAMADAS.ts).toBe('src');
    expect(CAMADAS.js).toBe('src');
    expect(CAMADAS.json).toBe('config');
    expect(CAMADAS.md).toBe('docs');
  });

  it('should export CONCORRENCIA as a number', () => {
    expect(typeof CONCORRENCIA).toBe('number');
    expect(CONCORRENCIA).toBeGreaterThan(0);
  });

  it('should analyze file entries structure', async () => {
    const entries = [
      { relPath: 'src/index.ts', content: '', fullCaminho: '/tmp/src/index.ts', ast: null },
      { relPath: 'docs/README.md', content: '', fullCaminho: '/tmp/docs/README.md', ast: null },
    ];
    const result = await analisarEstrutura(entries as any);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].arquivo).toBe('src/index.ts');
    expect(result[0].atual).toBe('src');
    expect(result[1].arquivo).toBe('docs/README.md');
    expect(result[1].atual).toBe('docs');
  });

  it('should handle empty entries', async () => {
    const result = await analisarEstrutura([]);
    expect(result).toEqual([]);
  });
});
