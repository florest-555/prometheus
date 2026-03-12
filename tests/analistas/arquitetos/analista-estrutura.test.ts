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

  it('should identify ideal directory for matched formats', async () => {
    const entries = [
      { relPath: 'src/main.ts', content: '', fullCaminho: '/tmp/src/main.ts', ast: null },
      { relPath: 'docs/guide.md', content: '', fullCaminho: '/tmp/docs/guide.md', ast: null },
      { relPath: 'config/settings.json', content: '', fullCaminho: '/tmp/config/settings.json', ast: null },
    ];
    const result = await analisarEstrutura(entries as any);
    expect(result[0].ideal).toBe('src');
    expect(result[1].ideal).toBe('docs');
    expect(result[2].ideal).toBe('config');
  });

  it('should identify ideal via regex for special filenames', async () => {
    // pattern: const [, tipo] = /\.([^.]+)\.[^.]+$/.exec(nome) ?? [];
    // This matches things like "something.test.ts" -> tipo = "test"
    // If CAMADAS has "test", it would work.
    // Let's check CAMADAS again. It doesn't have "test".
    // But we can test the fallback logic.
    const entries = [
      { relPath: 'unknown/file.ts', content: '', fullCaminho: '/tmp/unknown/file.ts', ast: null },
    ];
    const result = await analisarEstrutura(entries as any);
    // starts with src? No.
    // basename is "file.ts". regex /\.([^.]+)\.[^.]+$/ doesn't match a single dot at end well?
    // /\.([^.]+)\.[^.]+$/ means: dot, capture group (non-dots), dot, non-dots, end anchor.
    // "file.ts" doesn't have two dots.
    // "file.spec.ts" has.
    
    // If we mock CAMADAS or use existing ones:
    // Actually CAMADAS has 'ts': 'src'.
    // If filename is "index.all.ts", tipo is "all".
    
    const entries2 = [
      { relPath: 'other/config.prod.json', content: '', fullCaminho: '/tmp/other/config.prod.json', ast: null },
    ];
    // "config.prod.json" -> tipo = "prod". CAMADAS["prod"] is undefined.
    const result2 = await analisarEstrutura(entries2 as any);
    expect(result2[0].ideal).toBeNull();
  });

  it('should normalize slashes for matching', async () => {
     const entries = [
       { relPath: 'docs\\README.md', content: '', fullCaminho: '/tmp/docs/README.md', ast: null },
     ];
     const result = await analisarEstrutura(entries as any);
     expect(result[0].atual).toBe('docs');
     expect(result[0].ideal).toBe('docs');
  });
});

