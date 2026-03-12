// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { addDisclaimer, verifyDisclaimer } from '../../src/licensas/disclaimer';

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

describe('licensas/disclaimer', () => {
  describe('addDisclaimer', () => {
    it('should throw if disclaimer file not found', async () => {
      await withTempDir(async (root) => {
        await expect(addDisclaimer({ root })).rejects.toThrow('Disclaimer not found');
      });
    });

    it('should add disclaimer to files that dont have it', async () => {
      await withTempDir(async (root) => {
        const disclaimerPath = path.join(root, 'docs', 'partials', 'AVISO-PROVENIENCIA.md');
        await writeFileEnsuringDir(disclaimerPath, 'DISCLAIMER HEADER');
        await writeFileEnsuringDir(path.join(root, 'file1.md'), 'FILE CONTENT 1');
        await writeFileEnsuringDir(path.join(root, 'file2.md'), 'FILE CONTENT 2');

        const result = await addDisclaimer({ root });
        expect(result.updatedArquivos).toContain('file1.md');
        expect(result.updatedArquivos).toContain('file2.md');

        const updated1 = await fs.readFile(path.join(root, 'file1.md'), 'utf8');
        const updated2 = await fs.readFile(path.join(root, 'file2.md'), 'utf8');
        expect(updated1.startsWith('DISCLAIMER HEADER')).toBe(true);
        expect(updated2.startsWith('DISCLAIMER HEADER')).toBe(true);
      });
    });

    it('should skip files that already have the marker', async () => {
      await withTempDir(async (root) => {
        const disclaimerPath = path.join(root, 'docs', 'partials', 'AVISO-PROVENIENCIA.md');
        await writeFileEnsuringDir(disclaimerPath, 'DISCLAIMER HEADER');
        await writeFileEnsuringDir(path.join(root, 'file1.md'), 'Proveniência e Autoria\nContent');

        const result = await addDisclaimer({ root });
        expect(result.updatedArquivos).toHaveLength(0);
      });
    });
  });

  describe('verifyDisclaimer', () => {
    it('should identify missing disclaimers', async () => {
      await withTempDir(async (root) => {
        const disclaimerPath = path.join(root, 'docs', 'partials', 'AVISO-PROVENIENCIA.md');
        await writeFileEnsuringDir(disclaimerPath, 'DISCLAIMER HEADER');
        await writeFileEnsuringDir(path.join(root, 'file1.md'), 'Plain content');

        const result = await verifyDisclaimer({ root });
        expect(result.missing).toContain('file1.md');
      });
    });
  });
});
