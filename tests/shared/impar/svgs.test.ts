// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { otimizarSvgLikeSvgo, shouldSugerirOtimizacaoSvg, SVG_OPT_MIN_BYTES_SALVO, SVG_OPT_MIN_PORCENTAGEM_SALVO } from '../../../src/shared/impar/svgs';

describe('shared/impar/svgs', () => {

  describe('shouldSugerirOtimizacaoSvg', () => {
    it('should suggest if saved bytes >= minimum boundary', () => {
      // SVG_OPT_MIN_BYTES_SALVO = 40
      expect(shouldSugerirOtimizacaoSvg(100, 60)).toBe(true); // Saved exactly 40
      expect(shouldSugerirOtimizacaoSvg(100, 50)).toBe(true); // Saved 50
    });

    it('should suggest if saved percentage is >= minimum', () => {
      // SVG_OPT_MIN_PORCENTAGEM_SALVO = 5
      expect(shouldSugerirOtimizacaoSvg(1000, 950)).toBe(true); // Saved exactly 5% (50 < 40 = false, but pct >= 5% = true)
      expect(shouldSugerirOtimizacaoSvg(1000, 940)).toBe(true); // Saved 6%
    });

    it('should not suggest if saving is minimal', () => {
      expect(shouldSugerirOtimizacaoSvg(100, 97)).toBe(false); // Saved 3 bytes, 3%
    });

    it('should return false on invalid inputs', () => {
      expect(shouldSugerirOtimizacaoSvg(-10, 50)).toBe(false);
      expect(shouldSugerirOtimizacaoSvg(100, 150)).toBe(false);
      expect(shouldSugerirOtimizacaoSvg(0, 50)).toBe(false);
      expect(shouldSugerirOtimizacaoSvg(NaN, 50)).toBe(false);
    });
  });

  describe('otimizarSvgLikeSvgo', () => {
    it('should detect inline scripts and yield warnings without removing them automatically', () => {
      const svg = `<svg><script>alert(1)</script><path d="1" onclick="fail()"></path><a href="javascript:vo()">a</a></svg>`;
      const res = otimizarSvgLikeSvgo({ svg });
      expect(res.warnings).toContain('script-inline');
      expect(res.warnings).toContain('evento-inline');
      expect(res.warnings).toContain('javascript-url');
      // Should not remove them
      expect(res.data).toContain('<script>');
    });

    it('should normalize EOL and remove BOM', () => {
      const svg = `\uFEFF<svg>\r\n<path/></svg>`;
      const res = otimizarSvgLikeSvgo({ svg });
      expect(res.mudancas).toContain('normalizar-eol');
      expect(res.mudancas).toContain('remover-bom');
      expect(res.data.charCodeAt(0)).not.toBe(0xFEFF);
      expect(res.data).not.toContain('\r\n');
    });

    it('should remove xml prolog and doctype', () => {
      const svg = `<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">\n<svg></svg>`;
      const res = otimizarSvgLikeSvgo({ svg });
      expect(res.mudancas).toContain('remover-xml-prolog');
      expect(res.mudancas).toContain('remover-doctype');
      expect(res.data).not.toContain('<?xml');
      expect(res.data).not.toContain('<!DOCTYPE');
    });

    it('should remove comments, metadata, empty defs and root attrs', () => {
      const svg = `<svg version="1.1" enable-background="new 0 0 500 500" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- comment --><metadata>123</metadata><defs></defs><path/></svg>`;
      const res = otimizarSvgLikeSvgo({ svg });
      
      expect(res.mudancas).toEqual(expect.arrayContaining([
        'remover-comentarios',
        'remover-metadata',
        'remover-defs-vazio',
        'remover-version',
        'remover-enable-background',
        'remover-xmlns-xlink', // Since we have no xlink: attributes inside
      ]));
      
      expect(res.data).not.toContain('<!--');
      expect(res.data).not.toContain('<metadata>');
      expect(res.data).not.toContain('<defs>');
      expect(res.data).not.toContain('version=');
      expect(res.data).not.toContain('enable-background=');
      expect(res.data).not.toContain('xmlns:xlink=');
    });

    it('should colapse spaces between tags and trim correctly', () => {
      const svg = `<svg>\n  <g>\n    <path />\n  </g>\n</svg>    `;
      const res = otimizarSvgLikeSvgo({ svg });
      expect(res.mudancas).toContain('colapsar-espacos-entre-tags');
      expect(res.mudancas).toContain('trim-final');
      // `<svg><g><path /></g></svg>\n`
      expect(res.data).toContain('<svg><g><path /></g></svg>\n');
    });

    it('should properly track bytes and changes', () => {
      const svg = `<?xml?>\r\n<!-- cm -->\n<svg version="1.1"></svg>`;
      const res = otimizarSvgLikeSvgo({ svg });
      expect(res.changed).toBe(true);
      expect(res.originalBytes).toBeGreaterThan(0);
      expect(res.optimizedBytes).toBeLessThan(res.originalBytes);
    });
  });
});
