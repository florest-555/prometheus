// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { createEstatisticas, estatisticasUsoGlobal } from '../../src/shared/stats';

describe('stats', () => {
  describe('createEstatisticas', () => {
    it('should return an object with all keys', () => {
      const stats = createEstatisticas();
      expect(stats).toBeDefined();
      expect(stats.requires).toEqual({});
      expect(stats.consts).toEqual({});
      expect(stats.exports).toEqual({});
      expect(stats.vars).toEqual({});
      expect(stats.lets).toEqual({});
      expect(stats.evals).toEqual({});
      expect(stats.withs).toEqual({});
    });

    it('should return a new object each time', () => {
      const a = createEstatisticas();
      const b = createEstatisticas();
      expect(a).not.toBe(b);
    });
  });

  describe('estatisticasUsoGlobal', () => {
    it('should be defined', () => {
      expect(estatisticasUsoGlobal).toBeDefined();
    });

    it('should have all keys', () => {
      expect(estatisticasUsoGlobal).toHaveProperty('requires');
      expect(estatisticasUsoGlobal).toHaveProperty('consts');
      expect(estatisticasUsoGlobal).toHaveProperty('exports');
    });
  });
});
