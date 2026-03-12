// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { 
  getAutoFixConfig, 
  isCategoryAllowed, 
  hasMinimumConfidence, 
  shouldExcludeFile, 
  shouldExcludeFunction,
  PADRAO_AUTO_CORRECAO_CONFIGURACAO,
  CONSERVADORA_AUTO_CORRECAO_CONFIGURACAO,
  AGRESSIVA_AUTO_CORRECAO_CONFIGURACAO
} from '../../../../src/core/config/auto/auto-fix-config';

describe('core/config/auto/auto-fix-config', () => {
  describe('getAutoFixConfig', () => {
    it('should return balanced config by default', () => {
      expect(getAutoFixConfig()).toBe(PADRAO_AUTO_CORRECAO_CONFIGURACAO);
      expect(getAutoFixConfig('balanced')).toBe(PADRAO_AUTO_CORRECAO_CONFIGURACAO);
    });

    it('should return conservative config', () => {
      expect(getAutoFixConfig('conservative')).toBe(CONSERVADORA_AUTO_CORRECAO_CONFIGURACAO);
    });

    it('should return aggressive config', () => {
      expect(getAutoFixConfig('aggressive')).toBe(AGRESSIVA_AUTO_CORRECAO_CONFIGURACAO);
    });
  });

  describe('isCategoryAllowed', () => {
    it('should check if category is in allowed list', () => {
      const config = { allowedCategories: ['security', 'style'] } as any;
      expect(isCategoryAllowed('security', config)).toBe(true);
      expect(isCategoryAllowed('performance', config)).toBe(false);
    });

    it('should return true if no allowedCategories set', () => {
      expect(isCategoryAllowed('any', {} as any)).toBe(true);
    });
  });

  describe('hasMinimumConfidence', () => {
    it('should check confidence threshold', () => {
      const config = { minConfidence: 80 } as any;
      expect(hasMinimumConfidence(85, config)).toBe(true);
      expect(hasMinimumConfidence(75, config)).toBe(false);
      expect(hasMinimumConfidence(80, config)).toBe(true);
    });

    it('should return true if no minConfidence set', () => {
      expect(hasMinimumConfidence(0, {} as any)).toBe(true);
    });
  });

  describe('shouldExcludeFile', () => {
    it('should return true if path matches exclude patterns', () => {
      const config = { excludePadroes: ['**/node_modules/**', 'dist/*.js'] } as any;
      expect(shouldExcludeFile('project/node_modules/lib/index.js', config)).toBe(true);
      expect(shouldExcludeFile('dist/bundle.js', config)).toBe(true);
      expect(shouldExcludeFile('src/main.ts', config)).toBe(false);
    });

    it('should return false if no patterns set', () => {
      expect(shouldExcludeFile('any.js', {} as any)).toBe(false);
    });
  });

  describe('shouldExcludeFunction', () => {
    it('should return true if name matches exclude patterns', () => {
      const config = { excludeFunctionPatterns: ['^test', '.*Helper$'] } as any;
      expect(shouldExcludeFunction('testFunction', config)).toBe(true);
      expect(shouldExcludeFunction('myHelper', config)).toBe(true);
      expect(shouldExcludeFunction('main', config)).toBe(false);
    });

    it('should return false if no patterns set', () => {
      expect(shouldExcludeFunction('any', {} as any)).toBe(false);
    });
  });
});
