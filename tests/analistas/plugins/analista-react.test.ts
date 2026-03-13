// SPDX-License-Identifier: MIT-0
import { analistaReact } from '../../../src/analistas/plugins/analista-react';

describe('analistaReact', () => {
  it('should be defined', () => {
    expect(analistaReact).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaReact.nome).toBe('analista-react');
  });

  it('should identify React files', () => {
    expect(analistaReact.test('file.jsx')).toBe(true);
    expect(analistaReact.test('file.tsx')).toBe(true);
    expect(analistaReact.test('file.js')).toBe(true);
    expect(analistaReact.test('file.ts')).toBe(true);
    expect(analistaReact.test('file.json')).toBe(false);
  });

  it('should return null when no JSX', async () => {
    const result = await analistaReact.aplicar('const x = 1;', 'file.jsx');
    expect(result).toBeNull();
  });
});
