// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { salvarRegistros, carregarRegistros } from '../../src/guardian/registros';
import * as persistencia from '../../src/shared/persistence/persistencia';
import * as fs from 'node:fs';

vi.mock('../../src/shared/persistence/persistencia', () => ({
  salvarEstado: vi.fn(),
  lerEstado: vi.fn(),
}));

vi.mock('node:fs', () => ({
  promises: {
    mkdir: vi.fn().mockResolvedValue(undefined),
  }
}));

describe('guardian/registros', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('salvarRegistros', () => {
    it('should call salvarEstado with properly formatted records', async () => {
      const fileEntries = [
        { relPath: 'a.ts', content: 'const a = 1;', fullPath: '/a.ts' },
      ];
      await salvarRegistros(fileEntries, './dummy/integridade.json');
      expect(persistencia.salvarEstado).toHaveBeenCalled();
      expect(fs.promises.mkdir).toHaveBeenCalled();
    });

    it('should ignore empty content or missing relPath', async () => {
      const fileEntries = [
        { relPath: '', content: 'const a = 1;', fullPath: '/a.ts' },
        { relPath: 'b.ts', content: '   ', fullPath: '/b.ts' },
      ];
      await salvarRegistros(fileEntries, './dummy/integridade.json');
      expect(persistencia.salvarEstado).toHaveBeenCalledWith('./dummy/integridade.json', []);
    });
  });

  describe('carregarRegistros', () => {
    it('should return loaded records when available', async () => {
      const mockRecords = [{ arquivo: 'a.ts', hash: 'abc' }];
      vi.mocked(persistencia.lerEstado).mockResolvedValue(mockRecords);
      const result = await carregarRegistros();
      expect(result).toEqual(mockRecords);
    });

    it('should return empty array when loading fails', async () => {
      vi.mocked(persistencia.lerEstado).mockRejectedValue(new Error('File not found'));
      const result = await carregarRegistros();
      expect(result).toEqual([]);
    });
  });
});
