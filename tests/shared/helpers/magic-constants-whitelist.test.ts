// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  DISCORD_LIMITES,
  HTTP_STATUS_CODIGOS,
  COMUM_LIMITES,
  MATH_CONSTANTES,
  FRAMEWORK_WHITELISTS,
  isWhitelistedConstant,
  getConstantDescription,
} from '../../../src/shared/helpers/magic-constants-whitelist';

describe('magic-constants-whitelist', () => {
  describe('constants', () => {
    it('should export DISCORD_LIMITES', () => {
      expect(DISCORD_LIMITES).toBeDefined();
      expect(Array.isArray(DISCORD_LIMITES)).toBe(true);
      expect(DISCORD_LIMITES.length).toBeGreaterThan(0);
    });

    it('should export HTTP_STATUS_CODIGOS', () => {
      expect(HTTP_STATUS_CODIGOS).toBeDefined();
      expect(HTTP_STATUS_CODIGOS.some(r => r.value === 200)).toBe(true);
      expect(HTTP_STATUS_CODIGOS.some(r => r.value === 404)).toBe(true);
      expect(HTTP_STATUS_CODIGOS.some(r => r.value === 500)).toBe(true);
    });

    it('should export COMUM_LIMITES', () => {
      expect(COMUM_LIMITES).toBeDefined();
      expect(COMUM_LIMITES.length).toBeGreaterThan(0);
    });

    it('should export MATH_CONSTANTES', () => {
      expect(MATH_CONSTANTES).toBeDefined();
      expect(MATH_CONSTANTES.some(r => r.value === 0)).toBe(true);
      expect(MATH_CONSTANTES.some(r => r.value === 1)).toBe(true);
      expect(MATH_CONSTANTES.some(r => r.value === -1)).toBe(true);
    });

    it('should export FRAMEWORK_WHITELISTS', () => {
      expect(FRAMEWORK_WHITELISTS).toBeDefined();
      expect(FRAMEWORK_WHITELISTS['Discord.js']).toBeDefined();
      expect(FRAMEWORK_WHITELISTS['Express']).toBeDefined();
    });

    it('each rule should have value and description', () => {
      for (const rule of [...DISCORD_LIMITES, ...HTTP_STATUS_CODIGOS, ...COMUM_LIMITES, ...MATH_CONSTANTES]) {
        expect(typeof rule.value).toBe('number');
        expect(typeof rule.description).toBe('string');
      }
    });
  });

  describe('isWhitelistedConstant', () => {
    it('should whitelist math constants', () => {
      expect(isWhitelistedConstant(0, [])).toBe(true);
      expect(isWhitelistedConstant(1, [])).toBe(true);
      expect(isWhitelistedConstant(-1, [])).toBe(true);
      expect(isWhitelistedConstant(100, [])).toBe(true);
    });

    it('should whitelist HTTP status codes', () => {
      expect(isWhitelistedConstant(200, [])).toBe(true);
      expect(isWhitelistedConstant(404, [])).toBe(true);
      expect(isWhitelistedConstant(500, [])).toBe(true);
    });

    it('should whitelist common limits', () => {
      expect(isWhitelistedConstant(50, [])).toBe(true);
    });

    it('should not whitelist random numbers', () => {
      expect(isWhitelistedConstant(12345, [])).toBe(false);
      expect(isWhitelistedConstant(42, [])).toBe(false);
    });

    it('should use user whitelist', () => {
      expect(isWhitelistedConstant(42, [], [42])).toBe(true);
    });

    it('should whitelist framework-specific values', () => {
      expect(isWhitelistedConstant(2000, ['Discord.js'])).toBe(true);
      expect(isWhitelistedConstant(6000, ['Discord.js'])).toBe(true);
    });
  });

  describe('getConstantDescription', () => {
    it('should return description for known constants', () => {
      expect(getConstantDescription(200, [])).toBe('HTTP OK');
      expect(getConstantDescription(0, [])).toBe('Zero/inicial');
    });

    it('should return undefined for unknown constants', () => {
      expect(getConstantDescription(12345, [])).toBeUndefined();
    });

    it('should return framework-specific descriptions', () => {
      expect(getConstantDescription(2000, ['Discord.js'])).toBeDefined();
    });
  });
});
