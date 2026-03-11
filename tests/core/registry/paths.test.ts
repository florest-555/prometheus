// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { PROJETO_RAIZ, PROMETHEUS_DIRS, PROMETHEUS_ARQUIVOS, REPORT_PADROES, MIGRACAO_MAPA, resolveFilePath } from '../../../src/core/registry/paths';

describe('core/registry/paths', () => {
  describe('PROJETO_RAIZ', () => {
    it('should be a string', () => {
      expect(typeof PROJETO_RAIZ).toBe('string');
      expect(PROJETO_RAIZ.length).toBeGreaterThan(0);
    });
  });

  describe('PROMETHEUS_DIRS', () => {
    it('should have STATE directory', () => {
      expect(PROMETHEUS_DIRS.STATE).toContain('.prometheus');
    });

    it('should have METRICS_HISTORY directory', () => {
      expect(PROMETHEUS_DIRS.METRICS_HISTORY).toContain('historico-metricas');
    });

    it('should have REPORTS directory', () => {
      expect(PROMETHEUS_DIRS.REPORTS).toContain('relatorios');
    });
  });

  describe('PROMETHEUS_ARQUIVOS', () => {
    it('should have CONFIG path', () => {
      expect(PROMETHEUS_ARQUIVOS.CONFIG).toContain('prometheus.config.json');
    });

    it('should have GUARDIAN_BASELINE path', () => {
      expect(PROMETHEUS_ARQUIVOS.GUARDIAN_BASELINE).toContain('guardian.baseline.json');
    });

    it('should have REGISTRO_VIGIA path', () => {
      expect(PROMETHEUS_ARQUIVOS.REGISTRO_VIGIA).toContain('integridade.json');
    });
  });

  describe('REPORT_PADROES', () => {
    it('should generate diagnostico path', () => {
      const path = REPORT_PADROES.DIAGNOSTICO('2025-01-01');
      expect(path).toContain('prometheus-diagnostico-2025-01-01');
    });

    it('should generate summary JSON path', () => {
      const path = REPORT_PADROES.SUMMARY_JSON('2025-01-01');
      expect(path).toContain('prometheus-relatorio-summary-2025-01-01');
    });
  });

  describe('MIGRACAO_MAPA', () => {
    it('should be defined', () => {
      expect(MIGRACAO_MAPA).toBeDefined();
      expect(typeof MIGRACAO_MAPA).toBe('object');
    });
  });

  describe('resolveFilePath', () => {
    it('should return the path itself for unknown paths', () => {
      const result = resolveFilePath('/some/random/path.json');
      expect(result).toBe('/some/random/path.json');
    });
  });
});
