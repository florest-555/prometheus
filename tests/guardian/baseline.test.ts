// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { carregarBaseline, salvarBaseline, carregarAssinaturaBaseline } from '../../src/guardian/baseline';
import * as persistencia from '../../src/shared/persistence/persistencia';
import * as fs from 'node:fs';

// Mocks
vi.mock('../../src/shared/persistence/persistencia', () => ({
  lerEstado: vi.fn(),
  salvarEstado: vi.fn(),
}));

vi.mock('node:fs', () => ({
  promises: {
    mkdir: vi.fn().mockResolvedValue(undefined),
  }
}));

describe('guardian/baseline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('carregarBaseline', () => {
    it('should return null if lerEstado throws', async () => {
      vi.mocked(persistencia.lerEstado).mockRejectedValue(new Error('Not found'));
      const result = await carregarBaseline();
      expect(result).toBeNull();
    });

    it('should return null if file content is empty or malformed', async () => {
      vi.mocked(persistencia.lerEstado).mockResolvedValue(null as any);
      expect(await carregarBaseline()).toBeNull();

      vi.mocked(persistencia.lerEstado).mockResolvedValue([] as any);
      expect(await carregarBaseline()).toBeNull();

      vi.mocked(persistencia.lerEstado).mockResolvedValue('string' as any);
      expect(await carregarBaseline()).toBeNull();
    });

    it('should parse legacy version 1 format', async () => {
      // version 1 had top-level keys like ".package.json" -> "hash"
      const mockLegacy = { '.package.json': 'abc', 'src/index.ts': 'def' };
      vi.mocked(persistencia.lerEstado).mockResolvedValue(mockLegacy as any);
      const result = await carregarBaseline();
      expect(result).toEqual(mockLegacy);
    });

    it('should parse version 2 format with snapshot object', async () => {
      const mockV2 = {
        version: 2,
        snapshot: { 'src/a.ts': '123' },
      };
      vi.mocked(persistencia.lerEstado).mockResolvedValue(mockV2 as any);
      const result = await carregarBaseline();
      expect(result).toEqual(mockV2.snapshot);
    });
  });

  describe('carregarAssinaturaBaseline', () => {
    it('should extract signature if available in version 2', async () => {
      const mockAssinatura = { data: 'my-sig', algorithm: 'pgp' };
      const mockV2 = {
        version: 2,
        snapshot: {},
        assinatura: mockAssinatura
      };
      vi.mocked(persistencia.lerEstado).mockResolvedValue(mockV2 as any);
      const result = await carregarAssinaturaBaseline();
      expect(result).toEqual(mockAssinatura);
    });

    it('should return undefined if no signature', async () => {
      const mockLegacy = { '.tsconfig.json': 'hash' };
      vi.mocked(persistencia.lerEstado).mockResolvedValue(mockLegacy as any);
      const result = await carregarAssinaturaBaseline();
      expect(result).toBeUndefined();
    });
  });

  describe('salvarBaseline', () => {
    it('should write the new baseline using version 2 structure and create directory mapping', async () => {
      const snapshot = { 'a.ts': 'abc' };
      await salvarBaseline(snapshot);
      expect(fs.promises.mkdir).toHaveBeenCalled();
      expect(persistencia.salvarEstado).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          snapshot,
          version: 2,
        })
      );
    });

    it('should store signature if provided', async () => {
      const snapshot = { 'a.ts': 'abc' };
      const assinatura = { signature: 'sig123', version: 1 };
      await salvarBaseline(snapshot, assinatura as any);
      expect(persistencia.salvarEstado).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          assinatura
        })
      );
    });
  });
});
