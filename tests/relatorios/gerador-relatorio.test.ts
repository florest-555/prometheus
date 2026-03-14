// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gerarRelatorioMarkdown, gerarRelatorioJson } from '../../src/relatorios/gerador-relatorio';

vi.mock('../../src/shared/persistence/persistencia.js', () => ({
  salvarEstado: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@relatorios/filtro-inteligente.js', () => ({
  processarRelatorioResumo: vi.fn().mockReturnValue({}),
  gerarRelatorioMarkdownResumo: vi.fn().mockResolvedValue(undefined),
}));

describe('gerador-relatorio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('gerarRelatorioMarkdown', () => {
    it('should generate full markdown report', async () => {
      const mockResult = {
        totalArquivos: 5,
        ocorrencias: [{ tipo: 'test', mensagem: 'msg' }],
        guardian: { status: 'verificado', timestamp: '2025-01-01', totalArquivos: 10 },
        timestamp: 1600000000000,
        duracaoMs: 1500
      };
      await gerarRelatorioMarkdown(mockResult as any, '/out.md', false);
      const persist = await import('../../src/shared/persistence/persistencia.js');
      expect(persist.salvarEstado).toHaveBeenCalledWith('/out.md', expect.any(String));
      const calledWithUrl = (persist.salvarEstado as any).mock.calls[0][1];
      expect(typeof calledWithUrl).toBe('string');
      // We know it generates the report header etc
      expect(calledWithUrl).toContain('Relatório');
    });

    it('should generate brief markdown report using filtro-inteligente', async () => {
      const mockResult = {
        totalArquivos: 5,
        ocorrencias: [{ tipo: 'test', mensagem: 'msg' }],
        timestamp: 1600000000000,
      };
      await gerarRelatorioMarkdown(mockResult as any, '/out.md', true);
      const { gerarRelatorioMarkdownResumo } = await import('@relatorios/filtro-inteligente.js');
      expect(gerarRelatorioMarkdownResumo).toHaveBeenCalled();
    });
  });

  describe('gerarRelatorioJson', () => {
    it('should generate and save JSON report', async () => {
      const mockResult = { totalArquivos: 10, ocorrencias: [] };
      await gerarRelatorioJson(mockResult as any, '/out.json');
      const persist = await import('../../src/shared/persistence/persistencia.js');
      expect(persist.salvarEstado).toHaveBeenCalledWith('/out.json', expect.any(Object));
      const arg = (persist.salvarEstado as any).mock.calls[0][1];
      expect(JSON.stringify(arg)).toContain('10');
    });
  });
});
