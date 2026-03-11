// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { OperarioEstrutura } from '../../../src/analistas/estrategistas/operario-estrutura';

describe('OperarioEstrutura', () => {
  it('should be defined', () => {
    expect(OperarioEstrutura).toBeDefined();
  });

  it('should have planejar method', () => {
    expect(typeof OperarioEstrutura.planejar).toBe('function');
  });

  it('should have toMapaMoves method', () => {
    expect(typeof OperarioEstrutura.toMapaMoves).toBe('function');
  });

  it('should have aplicar method', () => {
    expect(typeof OperarioEstrutura.aplicar).toBe('function');
  });

  it('should have ocorrenciasParaMapa method', () => {
    expect(typeof OperarioEstrutura.ocorrenciasParaMapa).toBe('function');
  });

  describe('toMapaMoves', () => {
    it('should return empty array when plano is undefined', () => {
      const result = OperarioEstrutura.toMapaMoves(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array when plano has no mover', () => {
      const result = OperarioEstrutura.toMapaMoves({} as any);
      expect(result).toEqual([]);
    });

    it('should convert plano mover items to mapa', () => {
      const plano = {
        mover: [
          { de: 'src/foo.ts', para: 'src/utils/foo.ts' },
          { de: 'bar.ts', para: 'src/bar.ts' },
        ]
      };
      const result = OperarioEstrutura.toMapaMoves(plano as any);
      expect(result).toHaveLength(2);
      expect(result[0].arquivo).toBe('src/foo.ts');
      expect(result[0].ideal).toBe('src/utils');
      expect(result[1].arquivo).toBe('bar.ts');
      expect(result[1].ideal).toBe('src');
    });

    it('should handle items without directory separator', () => {
      const plano = { mover: [{ de: 'foo.ts', para: 'bar.ts' }] };
      const result = OperarioEstrutura.toMapaMoves(plano as any);
      expect(result).toHaveLength(1);
      expect(result[0].ideal).toBeNull();
    });
  });

  describe('ocorrenciasParaMapa', () => {
    it('should return empty array when no ocorrencias', () => {
      expect(OperarioEstrutura.ocorrenciasParaMapa()).toEqual([]);
      expect(OperarioEstrutura.ocorrenciasParaMapa([])).toEqual([]);
    });

    it('should convert ocorrencias to mapa', () => {
      const ocorrencias = [
        { relPath: 'src/foo.ts', tipo: 'test', nivel: 'info', mensagem: 'test', linha: 1 },
        { relPath: 'src/bar.ts', tipo: 'test', nivel: 'info', mensagem: 'test', linha: 1 },
      ];
      const result = OperarioEstrutura.ocorrenciasParaMapa(ocorrencias as any);
      expect(result).toHaveLength(2);
      expect(result[0].arquivo).toBe('src/foo.ts');
      expect(result[0].atual).toBe('src/foo.ts');
      expect(result[0].ideal).toBeNull();
    });
  });
});
