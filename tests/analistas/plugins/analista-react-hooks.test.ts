// SPDX-License-Identifier: MIT-0
import { analistaReactHooks } from '../../../src/analistas/plugins/analista-react-hooks';

describe('analistaReactHooks', () => {
  it('should be defined', () => {
    expect(analistaReactHooks).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaReactHooks.nome).toBe('analista-react-hooks');
  });

  it('should identify React files', () => {
    expect(analistaReactHooks.test('file.jsx')).toBe(true);
    expect(analistaReactHooks.test('file.tsx')).toBe(true);
    expect(analistaReactHooks.test('file.js')).toBe(true);
    expect(analistaReactHooks.test('file.ts')).toBe(true);
    expect(analistaReactHooks.test('file.json')).toBe(false);
  });

  it('should return null when no hooks usage', async () => {
    const result = await analistaReactHooks.aplicar('const x = 1;', 'file.jsx');
    expect(result).toBeNull();
  });
});
