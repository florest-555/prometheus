// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gerarRelatorioCorrecoes } from '../../src/zeladores/zelador-imports';
import { promises as fs } from 'node:fs';

// Mock dependency modules to avoid actual file system interaction
vi.mock('node:fs', () => ({
  promises: {
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    access: vi.fn(),
  }
}));

// We need to export executingZeladorImports as executarZeladorImports if we correctly name it
// Actually in the file it is 'executarZeladorImports'
import { executarZeladorImports } from '../../src/zeladores/zelador-imports';

describe('zeladores/zelador-imports', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('executarZeladorImports', () => {
    it('should correctly fix @types/types.js imports', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValueOnce([
        { name: 'test.ts', isFile: () => true, isDirectory: () => false }
      ] as any);
      
      const originalContent = "import type { Something } from '@types/types.js';";
      vi.mocked(fs.readFile).mockResolvedValue(originalContent);

      const resultados = await executarZeladorImports(['src'], { dryRun: false });
      
      expect(resultados).toHaveLength(1);
      expect(resultados[0].modificado).toBe(true);
      expect(resultados[0].correcoes[0].para).toBe('@types/types');
      
      const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
      expect(writeCall[1]).toBe("import type { Something } from '@types/types';");
    });

    it('should correctly fix @types/subpath imports', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValueOnce([
        { name: 'test.ts', isFile: () => true, isDirectory: () => false }
      ] as any);
      
      const originalContent = "import type { Something } from '@types/other/path';";
      vi.mocked(fs.readFile).mockResolvedValue(originalContent);

      const resultados = await executarZeladorImports(['src'], { dryRun: false });
      
      expect(resultados[0].modificado).toBe(true);
      expect(resultados[0].correcoes[0].para).toBe('@types/types');
    });

    it('should skip node_modules', async () => {
       vi.mocked(fs.access).mockResolvedValue(undefined);
       vi.mocked(fs.readdir).mockResolvedValueOnce([
         { name: 'node_modules', isFile: () => false, isDirectory: () => true }
       ] as any);

       // Ensure no leakage from previous tests
       vi.mocked(fs.readFile).mockResolvedValue('content'); 
       vi.mocked(fs.readFile).mockClear();

       const resultados = await executarZeladorImports(['src']);
       expect(resultados).toHaveLength(0);
       expect(vi.mocked(fs.readFile)).not.toHaveBeenCalled();
    });
  });

  describe('gerarRelatorioCorrecoes', () => {
    it('should generate a summary report', () => {
      const results = [
        {
          arquivo: 'src/test.ts',
          modificado: true,
          correcoes: [
            { tipo: 'tipos-extensao', de: '@types/types.js', para: '@types/types', linha: 1 }
          ]
        },
        {
          arquivo: 'src/fail.ts',
          modificado: false,
          erro: 'Permission denied'
        }
      ];

      const report = gerarRelatorioCorrecoes(results as any);
      expect(report).toContain('# Relatório de Correções de Imports');
      expect(report).toContain('Arquivos modificados: 1');
      expect(report).toContain('Erros: 1');
      expect(report).toContain('tipos-extensao: 1');
    });
  });
});
