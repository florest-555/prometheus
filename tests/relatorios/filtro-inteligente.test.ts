// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { processarRelatorioResumo, gerarResumoExecutivo } from '../../src/relatorios/filtro-inteligente';

describe('filtro-inteligente', () => {
  describe('processarRelatorioResumo', () => {
    it('should handle empty occurrences', () => {
      const result = processarRelatorioResumo([]);
      expect(result.estatisticas.totalOcorrencias).toBe(0);
      expect(result.estatisticas.arquivosAfetados).toBe(0);
    });

    it('should process occurrences and group by type', () => {
      const ocorrencias = [
        { tipo: 'PROBLEMA_SEGURANCA', nivel: 'erro' as const, mensagem: 'test', relPath: 'a.ts', linha: 1, origem: 'test' },
        { tipo: 'PROBLEMA_SEGURANCA', nivel: 'erro' as const, mensagem: 'test2', relPath: 'b.ts', linha: 2, origem: 'test' },
        { tipo: 'TODO_PENDENTE', nivel: 'aviso' as const, mensagem: 'todo', relPath: 'c.ts', linha: 3, origem: 'test' },
      ];
      const result = processarRelatorioResumo(ocorrencias);
      expect(result.estatisticas.totalOcorrencias).toBe(3);
      expect(result.estatisticas.arquivosAfetados).toBe(3);
    });

    it('should respect limit parameter', () => {
      const ocorrencias = Array.from({ length: 100 }, (_, i) => ({
        tipo: `tipo_${i % 5}`,
        nivel: 'info' as const,
        mensagem: `msg ${i}`,
        relPath: `file${i}.ts`,
        linha: i + 1,
        origem: 'test',
      }));
      const result = processarRelatorioResumo(ocorrencias, 9);
      const total = result.problemasCriticos.length + result.problemasAltos.length + result.problemasOutros.length;
      expect(total).toBeLessThanOrEqual(9 + 3); // limit/3 for each category
    });
  });

  describe('gerarResumoExecutivo', () => {
    it('should return verde for no problems', () => {
      const result = gerarResumoExecutivo([]);
      expect(result.recomendacao).toBe('verde');
      expect(result.problemasCriticos).toBe(0);
      expect(result.problemasAltos).toBe(0);
    });

    it('should count vulnerabilities', () => {
      const ocorrencias = [
        { tipo: 'VULNERABILIDADE_SEGURANCA', nivel: 'erro' as const, mensagem: 'vuln', relPath: 'a.ts', linha: 1, origem: 'test' },
        { tipo: 'PROBLEMA_SEGURANCA', nivel: 'erro' as const, mensagem: 'sec', relPath: 'b.ts', linha: 2, origem: 'test' },
      ];
      const result = gerarResumoExecutivo(ocorrencias);
      expect(result.vulnerabilidades).toBe(2);
    });
  });
});
