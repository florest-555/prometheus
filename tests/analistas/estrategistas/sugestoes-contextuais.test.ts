// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaSugestoesContextuais } from '../../../src/analistas/estrategistas/sugestoes-contextuais';

describe('analistaSugestoesContextuais', () => {
  it('should be defined', () => {
    expect(analistaSugestoesContextuais).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaSugestoesContextuais.nome).toBe('sugestoes-contextuais');
  });

  it('should have correct categoria', () => {
    expect(analistaSugestoesContextuais.categoria).toBe('estrategia');
  });

  it('should have a descricao', () => {
    expect(analistaSugestoesContextuais.descricao).toBeDefined();
    expect(typeof analistaSugestoesContextuais.descricao).toBe('string');
  });

  it('should be global', () => {
    expect(analistaSugestoesContextuais.global).toBe(true);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaSugestoesContextuais.aplicar).toBe('function');
  });

  it('should return empty array when no contexto', async () => {
    const result = await analistaSugestoesContextuais.aplicar('', '', null);
    expect(result).toEqual([]);
  });

  it('should return empty array when contexto has no arquivos', async () => {
    const contexto = {
      arquivos: [],
      baseDir: '/tmp',
      report: () => {}
    };
    const result = await analistaSugestoesContextuais.aplicar('', '', null, undefined, contexto as any);
    expect(Array.isArray(result)).toBe(true);
  });
});
