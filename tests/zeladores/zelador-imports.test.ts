// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { executarZeladorImports, gerarRelatorioCorrecoes } from '../../src/zeladores/zelador-imports';

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'prometheus-'));
  try {
    return await fn(tmpDir);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

async function writeFileEnsuringDir(filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
}

describe('zeladores/zelador-imports', () => {
  describe('executarZeladorImports', () => {
    it('should correctly fix @types/types.js imports', async () => {
      await withTempDir(async (root) => {
        const srcFile = path.join(root, 'src', 'test.ts');
        await writeFileEnsuringDir(srcFile, "import type { Something } from '@types/types.js';");

        const resultados = await executarZeladorImports(['src'], { dryRun: false, projectRaiz: root });

        expect(resultados).toHaveLength(1);
        expect(resultados[0].modificado).toBe(true);
        expect(resultados[0].correcoes[0].para).toBe('@types/types');

        const updated = await fs.readFile(srcFile, 'utf8');
        expect(updated).toBe("import type { Something } from '@types/types';");
      });
    });

    it('should correctly fix @types/subpath imports', async () => {
      await withTempDir(async (root) => {
        const srcFile = path.join(root, 'src', 'test.ts');
        await writeFileEnsuringDir(srcFile, "import type { Something } from '@types/other/path';");

        const resultados = await executarZeladorImports(['src'], { dryRun: false, projectRaiz: root });

        expect(resultados).toHaveLength(1);
        expect(resultados[0].modificado).toBe(true);
        expect(resultados[0].correcoes[0].para).toBe('@types/types');

        const updated = await fs.readFile(srcFile, 'utf8');
        expect(updated).toBe("import type { Something } from '@types/types';");
      });
    });

    it('should skip node_modules', async () => {
      await withTempDir(async (root) => {
        const nmFile = path.join(root, 'node_modules', 'pkg', 'index.ts');
        await writeFileEnsuringDir(nmFile, "import type { Something } from '@types/types.js';");

        const resultados = await executarZeladorImports(['.'], { dryRun: false, projectRaiz: root });

        expect(resultados).toHaveLength(0);
      });
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
