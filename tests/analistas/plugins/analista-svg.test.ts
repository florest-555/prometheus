// SPDX-License-Identifier: MIT-0
import { analistaSvg } from '../../../src/analistas/plugins/analista-svg';

vi.mock('../../../src/shared/impar/svgs', () => ({
  otimizarSvgLikeSvgo: vi.fn(() => ({ warnings: [], changed: false, originalBytes: 0, optimizedBytes: 0, mudancas: 0 })),
  shouldSugerirOtimizacaoSvg: vi.fn(() => false),
}));

describe('analistaSvg', () => {
  it('should be defined', () => {
    expect(analistaSvg).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaSvg.nome).toBe('analista-svg');
  });

  it('should identify SVG files', () => {
    expect(analistaSvg.test('file.svg')).toBe(true);
    expect(analistaSvg.test('file.png')).toBe(false);
  });

  it('should return warning when file does not look like SVG', async () => {
    const result = await analistaSvg.aplicar('<html></html>', 'file.svg');
    expect(result).not.toBeNull();
    expect(result?.length).toBeGreaterThan(0);
    expect(result?.[0].mensagem).toContain('não contém uma tag <svg>');
  });

  it('should return null when no issues', async () => {
    const result = await analistaSvg.aplicar('<svg viewBox="0 0 100 100"></svg>', 'file.svg');
    expect(result).toBeNull();
  });
});