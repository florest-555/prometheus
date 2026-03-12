// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { gerarRelatorioCorrecoes } from '../../src/zeladores/zelador-imports';

describe('zelador-imports', () => {
  describe('gerarRelatorioCorrecoes', () => {
    it('should generate report for empty results', () => {
      const result = gerarRelatorioCorrecoes([]);
      expect(result).toContain('Relatório de Correções de Imports');
      expect(result).toContain('Arquivos processados: 0');
      expect(result).toContain('Arquivos modificados: 0');
    });

    it('should report modified files', () => {
      const result = gerarRelatorioCorrecoes([
        {
          arquivo: 'src/foo.ts',
          correcoes: [{ tipo: 'tipos-extensao', de: '@types/types.js', para: '@types/types', linha: 1 }],
          modificado: true,
        },
      ]);
      expect(result).toContain('Arquivos modificados: 1');
      expect(result).toContain('Total de correções: 1');
      expect(result).toContain('src/foo.ts');
    });

    it('should report errors', () => {
      const result = gerarRelatorioCorrecoes([
        { arquivo: 'src/bar.ts', correcoes: [], modificado: false, erro: 'read failed' },
      ]);
      expect(result).toContain('Erros: 1');
      expect(result).toContain('read failed');
    });
  });
});
