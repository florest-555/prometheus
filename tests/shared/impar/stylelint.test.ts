// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { lintCssLikeStylelint, isLikelyIntentionalDuplicate } from '../../../src/shared/impar/stylelint';

describe('shared/impar/stylelint', () => {

  describe('isLikelyIntentionalDuplicate', () => {
    it('should correctly bypass viewport unit fallbacks', () => {
      expect(isLikelyIntentionalDuplicate('height', '100vh', '100dvh')).toBe(true);
      expect(isLikelyIntentionalDuplicate('width', '100vw', '100dvw')).toBe(true);
    });

    it('should bypass css custom properties fallbacks', () => {
      expect(isLikelyIntentionalDuplicate('color', 'red', 'var(--color-red)')).toBe(true);
    });

    it('should bypass color definition fallbacks', () => {
      expect(isLikelyIntentionalDuplicate('color', '#000', 'rgba(0,0,0,0.5)')).toBe(true);
      expect(isLikelyIntentionalDuplicate('background-color', 'rgb(0,0,0)', 'hsl(0,0%,0%)')).toBe(true);
    });

    it('should bypass gradient or image fallbacks', () => {
      expect(isLikelyIntentionalDuplicate('background', 'url(fallback.png)', 'linear-gradient(black, white)')).toBe(true);
      expect(isLikelyIntentionalDuplicate('background-image', 'image-set(url(1x.png) 1x)', 'url(old.png)')).toBe(true);
    });

    it('should bypass @font-face src multiple entries', () => {
      expect(isLikelyIntentionalDuplicate('src', 'url(font.eot)', 'url(font.woff2)', { currentAtRule: 'font-face' })).toBe(true);
      expect(isLikelyIntentionalDuplicate('src', 'url(font.eot)', 'url(font.woff2)')).toBe(false); // only if inside font-face
    });

    it('should bypass vendor prefixes', () => {
      expect(isLikelyIntentionalDuplicate('-webkit-transform', 'scale(1)', 'scale(1)')).toBe(true);
    });

    it('should NOT bypass actual duplications', () => {
      expect(isLikelyIntentionalDuplicate('margin', '10px', '20px')).toBe(false);
      expect(isLikelyIntentionalDuplicate('display', 'block', 'none')).toBe(false);
      expect(isLikelyIntentionalDuplicate('display', 'flex', 'grid')).toBe(false); // suspect but flag it
    });
  });

  describe('lintCssLikeStylelint', () => {
    it('should flag empty source file', () => {
      const result = lintCssLikeStylelint({ code: '  \n   ', relPath: 'empty.css' });
      expect(result).toHaveLength(1);
      expect(result[0].rule).toBe('no-empty-source');
    });

    it('should flag invalid double-slash comments', () => {
      const code = `
        .class {
          // not allowed comment
          color: red;
        }
      `;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      const warning = result.find(w => w.rule === 'no-invalid-double-slash-comments');
      expect(warning).toBeDefined();
      expect(warning?.line).toBe(3);
    });

  it('should catch syntax errors gracefully', () => {
      // CSS-Tree is very resilient and does not throw for invalid CSS syntax if it can be represented as an AST.
      // However, we want to test our TRY/CATCH failsafe block.
      // By passing an object that bypasses our local `code.trim()` check but crashes inside `csstree.parse`,
      // we can natively force the exception and verify that it registers as a 'syntax-error'.
      const badCode = {
        trim: () => 'a {}',
        split: () => ['a {}'],
        charCodeAt: () => { throw new Error('Crash tokenizer'); },
        length: 10
      } as any;

      const result = lintCssLikeStylelint({ code: badCode, relPath: 'err.css' });
      
      const warning = result.find(w => w.rule === 'syntax-error');
      expect(warning).toBeDefined();
    });

    it('should flag HTTP imports', () => {
      const code = `@import url('http://insecure.test');`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      expect(result.some(w => w.rule === 'no-http-at-import-rules')).toBe(true);
    });

    it('should flag duplicate imports', () => {
      const code = `@import "style.css";\n@import "style.css";`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      expect(result.some(w => w.rule === 'no-duplicate-at-import-rules')).toBe(true);
    });

    it('should flag duplicate keyframes', () => {
      const code = `@keyframes spin { to { transform: rotate(360deg); } }\n@keyframes spin { to { top: 0; } }`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      expect(result.some(w => w.rule === 'no-duplicate-keyframes')).toBe(true);
    });

    it('should flag duplicate selectors', () => {
      const code = `.btn { color: red; }\n.btn { background: blue; }`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      expect(result.some(w => w.rule === 'no-duplicate-selectors')).toBe(true);
    });

    it('should flag important properties', () => {
      const code = `.btn { color: red !important; }`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      expect(result.some(w => w.rule === 'declaration-no-important')).toBe(true);
    });

    it('should flag duplicate properties', () => {
      const code = `.btn {\n  color: red;\n  color: blue;\n}`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      const props = result.filter(w => w.rule === 'declaration-block-no-duplicate-properties');
      expect(props).toHaveLength(1);
    });

    it('should ignore duplicate properties if they are fallbacks', () => {
      const code = `.btn {\n  height: 100vh;\n  height: 100dvh;\n}`;
      const result = lintCssLikeStylelint({ code, relPath: 'test.css' });
      // should have no duplicate warnings
      expect(result.some(w => w.rule === 'declaration-block-no-duplicate-properties')).toBe(false);
    });
  });

});
