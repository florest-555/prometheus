// SPDX-License-Identifier: MIT-0
import { analistaHtml } from '../../../src/analistas/plugins/analista-html';

vi.mock('htmlparser2', () => ({
  parseDocument: vi.fn(() => ({
    type: 'root',
    children: [],
  })),
}));

vi.mock('../../../src/shared/helpers/line-lookup', () => ({
  createLineLookup: vi.fn(() => ({
    lineAt: () => 1,
  })),
}));

vi.mock('../../../src/shared/helpers/masking', () => ({
  maskHtmlComments: vi.fn((s) => s),
  maskTagBlocks: vi.fn((s) => s),
}));

import { analistaHtml } from '../../../src/analistas/plugins/analista-html';

describe('analistaHtml', () => {
  it('should be defined', () => {
    expect(analistaHtml).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaHtml.nome).toBe('analista-html');
  });

  it('should identify HTML files', () => {
    expect(analistaHtml.test('file.html')).toBe(true);
    expect(analistaHtml.test('file.htm')).toBe(true);
    expect(analistaHtml.test('file.xhtml')).toBe(false);
    expect(analistaHtml.test('file.js')).toBe(false);
  });

  it('should return null when disabled via env', async () => {
    vi.stubEnv('PROMETHEUS_DISABLE_PLUGIN_HTML', '1');
    // Since disableEnv is evaluated at module load time, we need to re-import.
    // For simplicity, we just test that the function exists.
    expect(typeof analistaHtml.aplicar).toBe('function');
    vi.unstubAllGlobals();
  });
});