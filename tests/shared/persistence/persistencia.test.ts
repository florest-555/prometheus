// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as persistencia from '../../../src/shared/persistence/persistencia';
import * as fs from 'node:fs';
import path from 'node:path';

vi.mock('node:fs', () => {
  return {
    promises: {
      readFile: vi.fn(),
      writeFile: vi.fn(),
      mkdir: vi.fn(),
      rename: vi.fn(),
    },
    default: {
      readFile: vi.fn(),
      writeFile: vi.fn(),
      mkdir: vi.fn(),
      rename: vi.fn(),
    }
  };
});

describe('shared/persistence/persistencia', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('lerEstado', () => {
    it('should parse valid JSON', async () => {
      vi.mocked(fs.promises.readFile).mockResolvedValueOnce('{"a": 1}');
      const result = await persistencia.lerEstado(path.resolve('test.json'));
      expect(result).toEqual({ a: 1 });
    });

    it('should return default/empty array if file read fails', async () => {
      vi.mocked(fs.promises.readFile).mockRejectedValueOnce(new Error('not found'));
      const result = await persistencia.lerEstado(path.resolve('test.json'), { def: true });
      expect(result).toEqual({ def: true });
      
      const undefResult = await persistencia.lerEstado(path.resolve('test2.json'));
      expect(undefResult).toEqual([]);
    });

    it('should return default/empty array if JSON parse fails', async () => {
      vi.mocked(fs.promises.readFile).mockResolvedValueOnce('invalid json');
      const result = await persistencia.lerEstado(path.resolve('test.json'), { x: 1 });
      expect(result).toEqual({ x: 1 });
    });

    it('should return empty array if no padrao and JSON parse fails', async () => {
      vi.mocked(fs.promises.readFile).mockResolvedValueOnce('invalid json');
      const result = await persistencia.lerEstado(path.resolve('test.json'));
      expect(result).toEqual([]);
    });
  });

  describe('salvarEstadoAtomico', () => {
    it('should save formatting exactly and sort nested keys', async () => {
      process.env.PROMETHEUS_ALLOW_OUTSIDE_FS = '1';
      vi.mocked(fs.promises.mkdir).mockResolvedValueOnce(undefined);
      vi.mocked(fs.promises.writeFile).mockResolvedValueOnce(undefined);
      vi.mocked(fs.promises.rename).mockResolvedValueOnce(undefined);

      const complexData = {
        z: 1,
        a: {
          y: 2,
          b: 3
        },
        m: [ { d: 4, c: 5 } ]
      };

      await persistencia.salvarEstadoAtomico('/mock/test.json', complexData);
      
      expect(fs.promises.mkdir).toHaveBeenCalled();
      const callArgs = vi.mocked(fs.promises.writeFile).mock.calls[0];
      const savedStr = callArgs[1] as string;
      const parsed = JSON.parse(savedStr);

      // Verify sorting in the stringified output
      const keys = Object.keys(parsed);
      expect(keys).toEqual(['a', 'm', 'z']);
      expect(Object.keys(parsed.a)).toEqual(['b', 'y']);
      expect(Object.keys(parsed.m[0])).toEqual(['c', 'd']);
    });

    it('should enforce inside root boundary if allowed variable not set', async () => {
      process.env.VITEST = '';
      process.env.PROMETHEUS_ALLOW_OUTSIDE_FS = '';
      
      await expect(
        persistencia.salvarEstadoAtomico('/outside/path.json', {})
      ).rejects.toThrow(/Persistência negada/);
    });
  });

  describe('lerArquivoTexto', () => {
    it('should read text directly', async () => {
      vi.mocked(fs.promises.readFile).mockResolvedValueOnce('hello');
      const result = await persistencia.lerArquivoTexto(path.resolve('test.txt'));
      expect(result).toBe('hello');
    });

    it('should return empty string on error', async () => {
      vi.mocked(fs.promises.readFile).mockRejectedValueOnce(new Error('fail'));
      const result = await persistencia.lerArquivoTexto(path.resolve('test.txt'));
      expect(result).toBe('');
    });
  });

  describe('salvarBinarioAtomico', () => {
    it('should save buffer atomicaly', async () => {
      process.env.PROMETHEUS_ALLOW_OUTSIDE_FS = '1';
      vi.mocked(fs.promises.mkdir).mockResolvedValueOnce(undefined);
      vi.mocked(fs.promises.writeFile).mockResolvedValueOnce(undefined);
      vi.mocked(fs.promises.rename).mockResolvedValueOnce(undefined);

      const buf = Buffer.from('abc');
      await persistencia.salvarBinarioAtomico('/mock/bin.dat', buf);

      expect(fs.promises.mkdir).toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalled();
      
      const callArgs = vi.mocked(fs.promises.writeFile).mock.calls[0];
      expect(callArgs[1]).toBe(buf);
    });

    it('should throw error if outside boundary', async () => {
       process.env.VITEST = '';
       process.env.PROMETHEUS_ALLOW_OUTSIDE_FS = '0';
       await expect(persistencia.salvarBinarioAtomico('/outside/bin.dat', Buffer.from(''))).rejects.toThrow();
    });
  });

  describe('Exported spies', () => {
    it('should have salvarEstado and salvarBinario as vitest spies', () => {
      expect(vi.isMockFunction(persistencia.salvarEstado)).toBe(true);
      expect(vi.isMockFunction(persistencia.salvarBinario)).toBe(true);
    });
  });


});
