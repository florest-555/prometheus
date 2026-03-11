// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  VERSAO_ATUAL,
  HISTORICO_VERSOES,
  criarSchemaMetadata,
  validarSchema,
  criarRelatorioComVersao,
  extrairDados,
  versaoCompativel,
} from '../../../src/core/schema/version';

describe('core/schema/version', () => {
  describe('VERSAO_ATUAL', () => {
    it('should be a version string', () => {
      expect(VERSAO_ATUAL).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should be 1.0.0', () => {
      expect(VERSAO_ATUAL).toBe('1.0.0');
    });
  });

  describe('HISTORICO_VERSOES', () => {
    it('should contain current version', () => {
      expect(HISTORICO_VERSOES[VERSAO_ATUAL]).toBeDefined();
    });

    it('should have metadata for 1.0.0', () => {
      const v = HISTORICO_VERSOES['1.0.0'];
      expect(v.versao).toBe('1.0.0');
      expect(v.descricao).toBeDefined();
      expect(v.compatibilidade).toContain('1.0.0');
    });
  });

  describe('criarSchemaMetadata', () => {
    it('should create metadata for current version', () => {
      const meta = criarSchemaMetadata();
      expect(meta.versao).toBe(VERSAO_ATUAL);
      expect(meta.descricao).toBeDefined();
    });

    it('should accept custom description', () => {
      const meta = criarSchemaMetadata(VERSAO_ATUAL, 'Custom description');
      expect(meta.descricao).toBe('Custom description');
    });

    it('should throw for unknown version', () => {
      expect(() => criarSchemaMetadata('99.99.99')).toThrow();
    });
  });

  describe('validarSchema', () => {
    it('should validate valid report', () => {
      const report = {
        _schema: { versao: '1.0.0', criadoEm: '2025-01-01', descricao: 'test' },
        dados: {},
      };
      const result = validarSchema(report);
      expect(result.valido).toBe(true);
      expect(result.erros).toEqual([]);
    });

    it('should reject report without _schema', () => {
      const result = validarSchema({ dados: {} });
      expect(result.valido).toBe(false);
      expect(result.erros.length).toBeGreaterThan(0);
    });

    it('should reject report without dados', () => {
      const result = validarSchema({
        _schema: { versao: '1.0.0', criadoEm: '2025-01-01', descricao: 'test' },
      });
      expect(result.valido).toBe(false);
    });

    it('should reject null/undefined', () => {
      const result = validarSchema(null as any);
      expect(result.valido).toBe(false);
    });

    it('should reject unknown version', () => {
      const result = validarSchema({
        _schema: { versao: '99.99.99', criadoEm: '2025-01-01', descricao: 'test' },
        dados: {},
      });
      expect(result.valido).toBe(false);
    });
  });

  describe('criarRelatorioComVersao', () => {
    it('should create versioned report', () => {
      const report = criarRelatorioComVersao({ foo: 'bar' });
      expect(report._schema).toBeDefined();
      expect(report._schema.versao).toBe(VERSAO_ATUAL);
      expect(report.dados).toEqual({ foo: 'bar' });
    });
  });

  describe('extrairDados', () => {
    it('should extract data from report', () => {
      const report = criarRelatorioComVersao({ hello: 'world' });
      const data = extrairDados(report);
      expect(data).toEqual({ hello: 'world' });
    });
  });

  describe('versaoCompativel', () => {
    it('should return true for current version', () => {
      expect(versaoCompativel('1.0.0')).toBe(true);
    });

    it('should return false for unknown version', () => {
      expect(versaoCompativel('99.99.99')).toBe(false);
    });
  });
});
