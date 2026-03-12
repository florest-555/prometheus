// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDisclaimer, verifyDisclaimer } from '../../src/licensas/disclaimer';
import { promises as fs } from 'node:fs';
import { execFile } from 'node:child_process';

vi.mock('node:fs', () => ({
  promises: {
    readdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    access: vi.fn(),
  }
}));

vi.mock('node:child_process', () => ({
  execFile: vi.fn(),
}));

describe('licensas/disclaimer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('addDisclaimer', () => {
    it('should throw if disclaimer file not found', async () => {
      vi.mocked(fs.access).mockRejectedValueOnce(new Error('not found'));
      await expect(addDisclaimer()).rejects.toThrow('Disclaimer not found');
    });

    it('should add disclaimer to files that dont have it', async () => {
      // Mock disclaimer file exists
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockImplementation(async (path) => {
        if (path.toString().includes('AVISO-PROVENIENCIA.md')) return 'DISCLAIMER HEADER';
        return 'FILE CONTENT';
      });

      // Mock git ls-files
      vi.mocked(execFile).mockImplementation((_cmd, _args, _opts, callback) => {
        (callback as any)(null, 'file1.md\nfile2.md', '');
        return {} as any;
      });

      const result = await addDisclaimer({ root: '/tmp' });
      expect(result.updatedArquivos).toContain('file1.md');
      expect(result.updatedArquivos).toContain('file2.md');
      expect(fs.writeFile).toHaveBeenCalledTimes(2);
    });

    it('should skip files that already have the marker', async () => {
       vi.mocked(fs.access).mockResolvedValue(undefined);
       vi.mocked(fs.readFile).mockImplementation(async (path) => {
         if (path.toString().includes('AVISO-PROVENIENCIA.md')) return 'DISCLAIMER HEADER';
         return 'Proveniência e Autoria\nContent';
       });

       vi.mocked(execFile).mockImplementation((_cmd, _args, _opts, callback) => {
         (callback as any)(null, 'file1.md', '');
         return {} as any;
       });

       // Clear calls specifically for this test to be double sure
       vi.mocked(fs.readFile).mockClear();
       vi.mocked(fs.writeFile).mockClear();

       const result = await addDisclaimer({ root: '/tmp' });
       expect(result.updatedArquivos).toHaveLength(0);
       expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('verifyDisclaimer', () => {
    it('should identify missing disclaimers', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue('Plain content');
      vi.mocked(execFile).mockImplementation((_cmd, _args, _opts, callback) => {
        (callback as any)(null, 'file1.md', '');
        return {} as any;
      });

      const result = await verifyDisclaimer({ root: '/tmp' });
      expect(result.missing).toContain('file1.md');
    });
  });
});
