// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarArquetipoNode } from '../../../src/analistas/plugins/detector-node';

describe('detectarArquetipoNode', () => {
  it('should be defined', () => {
    expect(detectarArquetipoNode).toBeDefined();
  });

  it('should return empty array when no package.json', () => {
    const result = detectarArquetipoNode(['src/index.ts', 'README.md']);
    expect(result).toEqual([]);
  });

  it('should return candidates when package.json present', () => {
    const result = detectarArquetipoNode(['package.json', 'bin/index.js']);
    expect(result.length).toBeGreaterThan(0);
    // Ensure each candidate has expected shape
    result.forEach((c) => {
      expect(c).toHaveProperty('nome');
      expect(c).toHaveProperty('score');
      expect(typeof c.score).toBe('number');
    });
  });

  it('should match cli-modular arquetipo when bin folder present', () => {
    const result = detectarArquetipoNode(['package.json', 'bin/cli.js', 'src/cli/commands.ts']);
    const cliModular = result.find(r => r.nome === 'cli-modular');
    expect(cliModular).toBeDefined();
    expect(cliModular!.score).toBeGreaterThan(0);
  });
});
