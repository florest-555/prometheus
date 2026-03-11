// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { config, configPadrao, aplicarConfigParcial } from '../../../src/core/config/config';

describe('core/config/config', () => {
  describe('configPadrao', () => {
    it('should be defined', () => {
      expect(configPadrao).toBeDefined();
    });

    it('should have VERBOSE as false by default', () => {
      expect(configPadrao.VERBOSE).toBe(false);
    });

    it('should have LOG_LEVEL as info', () => {
      expect(configPadrao.LOG_LEVEL).toBe('info');
    });

    it('should have LANGUAGE as pt-BR', () => {
      expect(configPadrao.LANGUAGE).toBe('pt-BR');
    });

    it('should have GUARDIAN_ENABLED as true', () => {
      expect(configPadrao.GUARDIAN_ENABLED).toBe(true);
    });

    it('should have ANALISE_LIMITES defined', () => {
      expect(configPadrao.ANALISE_LIMITES).toBeDefined();
      expect(configPadrao.ANALISE_LIMITES.FUNCOES_LONGAS.MAX_LINHAS).toBe(30);
      expect(configPadrao.ANALISE_LIMITES.FUNCOES_LONGAS.MAX_PARAMETROS).toBe(4);
    });

    it('should have SCANNER_EXTENSOES_COM_AST', () => {
      expect(configPadrao.SCANNER_EXTENSOES_COM_AST).toContain('.ts');
      expect(configPadrao.SCANNER_EXTENSOES_COM_AST).toContain('.js');
      expect(configPadrao.SCANNER_EXTENSOES_COM_AST).toContain('.jsx');
      expect(configPadrao.SCANNER_EXTENSOES_COM_AST).toContain('.tsx');
    });

    it('should have testPadroes', () => {
      expect(configPadrao.testPadroes).toBeDefined();
      expect(configPadrao.testPadroes.files.length).toBeGreaterThan(0);
    });
  });

  describe('config', () => {
    it('should be a clone of configPadrao', () => {
      expect(config).toBeDefined();
      expect(config.VERBOSE).toBe(configPadrao.VERBOSE);
      expect(config.LOG_LEVEL).toBe(configPadrao.LOG_LEVEL);
    });

    it('should not be the same reference', () => {
      expect(config).not.toBe(configPadrao);
    });
  });

  describe('aplicarConfigParcial', () => {
    it('should be defined', () => {
      expect(aplicarConfigParcial).toBeDefined();
      expect(typeof aplicarConfigParcial).toBe('function');
    });

    it('should return diffs', () => {
      const original = config.VERBOSE;
      const diffs = aplicarConfigParcial({ VERBOSE: true });
      expect(typeof diffs).toBe('object');
      // restore
      aplicarConfigParcial({ VERBOSE: original });
    });
  });
});
