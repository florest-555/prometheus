// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  incrementar,
  garantirArray,
  criarOcorrenciaErroAnalista,
  executarComTratamentoErro,
  executarAsyncComTratamentoErro,
} from '../../../src/shared/helpers/helpers-analistas';

describe('helpers-analistas', () => {
  describe('incrementar', () => {
    it('should initialize counter to 1', () => {
      const c: Record<string, number> = {};
      incrementar(c, 'foo');
      expect(c.foo).toBe(1);
    });

    it('should increment existing counter', () => {
      const c: Record<string, number> = { foo: 3 };
      incrementar(c, 'foo');
      expect(c.foo).toBe(4);
    });

    it('should handle multiple keys', () => {
      const c: Record<string, number> = {};
      incrementar(c, 'a');
      incrementar(c, 'b');
      incrementar(c, 'a');
      expect(c.a).toBe(2);
      expect(c.b).toBe(1);
    });
  });

  describe('garantirArray', () => {
    it('should return empty array for null', () => {
      expect(garantirArray(null)).toEqual([]);
    });

    it('should return empty array for undefined', () => {
      expect(garantirArray(undefined)).toEqual([]);
    });

    it('should return the array itself', () => {
      const arr = [1, 2, 3];
      expect(garantirArray(arr)).toBe(arr);
    });

    it('should return empty array for non-array', () => {
      expect(garantirArray([] as any)).toEqual([]);
    });
  });

  describe('criarOcorrenciaErroAnalista', () => {
    it('should create an error occurrence from Error', () => {
      const result = criarOcorrenciaErroAnalista({
        nome: 'test-analista',
        relPath: 'src/foo.ts',
        erro: new Error('test error'),
      });
      expect(result).toBeDefined();
      expect(result.tipo).toBe('erro-analista');
      expect(result.nivel).toBe('aviso');
      expect(result.mensagem).toContain('test-analista');
      expect(result.mensagem).toContain('test error');
    });

    it('should create an error occurrence from string', () => {
      const result = criarOcorrenciaErroAnalista({
        nome: 'my-analista',
        relPath: 'src/bar.ts',
        erro: 'something wrong',
      });
      expect(result.mensagem).toContain('something wrong');
    });

    it('should use default line 1 when not provided', () => {
      const result = criarOcorrenciaErroAnalista({
        nome: 'test',
        relPath: 'test.ts',
        erro: 'err',
      });
      expect(result.linha).toBe(1);
    });
  });

  describe('executarComTratamentoErro', () => {
    it('should return result when function succeeds', () => {
      const result = executarComTratamentoErro(
        () => [{ tipo: 'info', nivel: 'info', mensagem: 'ok', relPath: 'a.ts' }] as any,
        'test', 'a.ts'
      );
      expect(result).toHaveLength(1);
      expect(result[0].tipo).toBe('info');
    });

    it('should catch errors and return error occurrence', () => {
      const result = executarComTratamentoErro(
        () => { throw new Error('boom'); },
        'test-analista', 'b.ts'
      );
      expect(result).toHaveLength(1);
      expect(result[0].tipo).toBe('erro-analista');
    });
  });

  describe('executarAsyncComTratamentoErro', () => {
    it('should return result when async function succeeds', async () => {
      const result = await executarAsyncComTratamentoErro(
        async () => [{ tipo: 'info', nivel: 'info', mensagem: 'ok', relPath: 'a.ts' }] as any,
        'test', 'a.ts'
      );
      expect(result).toHaveLength(1);
    });

    it('should catch async errors', async () => {
      const result = await executarAsyncComTratamentoErro(
        async () => { throw new Error('async boom'); },
        'test', 'c.ts'
      );
      expect(result).toHaveLength(1);
      expect(result[0].tipo).toBe('erro-analista');
    });
  });
});
