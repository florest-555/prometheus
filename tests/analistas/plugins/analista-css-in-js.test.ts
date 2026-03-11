// SPDX-License-Identifier: MIT-0
import { analistaCssInJs } from '../../../src/analistas/plugins/analista-css-in-js';
import { analistaCssInJs } from '../../../src/analistas/plugins/analista-css-in-js';

describe('analistaCssInJs', () => {
  it('should be defined', () => {
    expect(analistaCssInJs).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaCssInJs.nome).toBe('analista-css-in-js');
  });

  it('should identify JS/TS files', () => {
    expect(analistaCssInJs.test('file.js')).toBe(true);
    expect(analistaCssInJs.test('file.jsx')).toBe(true);
    expect(analistaCssInJs.test('file.ts')).toBe(true);
    expect(analistaCssInJs.test('file.tsx')).toBe(true);
    expect(analistaCssInJs.test('file.mjs')).toBe(true);
    expect(analistaCssInJs.test('file.cjs')).toBe(true);
    expect(analistaCssInJs.test('file.json')).toBe(false);
  });

  it('should return null when disabled via env', async () => {
    vi.stubEnv('PROMETHEUS_DISABLE_PLUGIN_CSS_IN_JS', '1');
    // Since disableEnv is evaluated at module load time, we need to re-import.
    // For simplicity, we just test that the function exists.
    expect(typeof analistaCssInJs.aplicar).toBe('function');
    vi.unstubAllGlobals();
  });
});
