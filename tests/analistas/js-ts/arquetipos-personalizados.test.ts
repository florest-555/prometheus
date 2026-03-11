// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  validarArquetipoPersonalizado,
  listarArquetiposOficiais,
  obterArquetipoOficial,
  criarTemplateArquetipoPersonalizado,
  gerarSugestaoArquetipoPersonalizado,
  integrarArquetipos,
} from '../../../src/analistas/js-ts/arquetipos-personalizados';

describe('arquetipos-personalizados', () => {
  describe('listarArquetiposOficiais', () => {
    it('should return a non-empty array', () => {
      const result = listarArquetiposOficiais();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return archetypes with nome property', () => {
      const result = listarArquetiposOficiais();
      for (const arq of result) {
        expect(arq.nome).toBeDefined();
        expect(typeof arq.nome).toBe('string');
      }
    });
  });

  describe('obterArquetipoOficial', () => {
    it('should return the official archetype when found', () => {
      const personalizado = {
        nome: 'meu-cli',
        descricao: 'CLI project',
        arquetipoOficial: 'cli-modular',
        estruturaPersonalizada: { diretorios: ['bin'], arquivosChave: [], padroesNomenclatura: {} },
      };
      const result = obterArquetipoOficial(personalizado as any);
      expect(result).not.toBeNull();
      expect(result!.nome).toBe('cli-modular');
    });

    it('should return null when archetype not found', () => {
      const personalizado = {
        nome: 'meu-projeto',
        descricao: '',
        arquetipoOficial: 'inexistente-xyz',
        estruturaPersonalizada: { diretorios: [], arquivosChave: [], padroesNomenclatura: {} },
      };
      const result = obterArquetipoOficial(personalizado as any);
      expect(result).toBeNull();
    });
  });

  describe('validarArquetipoPersonalizado', () => {
    it('should validate a valid archetype', () => {
      const arq = {
        nome: 'meu-projeto',
        descricao: 'Test',
        arquetipoOficial: 'cli-modular',
        estruturaPersonalizada: {
          diretorios: ['src'],
          arquivosChave: ['package.json'],
          padroesNomenclatura: {},
        },
      };
      const result = validarArquetipoPersonalizado(arq as any);
      expect(result.valido).toBe(true);
      expect(result.erros).toHaveLength(0);
    });

    it('should fail when nome is missing', () => {
      const arq = {
        descricao: 'Test',
        arquetipoOficial: 'cli-modular',
        estruturaPersonalizada: { diretorios: [], arquivosChave: [], padroesNomenclatura: {} },
      };
      const result = validarArquetipoPersonalizado(arq as any);
      expect(result.valido).toBe(false);
      expect(result.erros.length).toBeGreaterThan(0);
    });

    it('should fail when arquetipoOficial is missing', () => {
      const arq = {
        nome: 'test',
        descricao: '',
        estruturaPersonalizada: { diretorios: [], arquivosChave: [], padroesNomenclatura: {} },
      };
      const result = validarArquetipoPersonalizado(arq as any);
      expect(result.valido).toBe(false);
    });

    it('should fail when arquetipoOficial is unknown', () => {
      const arq = {
        nome: 'test',
        descricao: '',
        arquetipoOficial: 'unknown-type-xyz',
        estruturaPersonalizada: { diretorios: [], arquivosChave: [], padroesNomenclatura: {} },
      };
      const result = validarArquetipoPersonalizado(arq as any);
      expect(result.valido).toBe(false);
    });

    it('should fail when estruturaPersonalizada is missing', () => {
      const arq = {
        nome: 'test',
        descricao: '',
        arquetipoOficial: 'cli-modular',
      };
      const result = validarArquetipoPersonalizado(arq as any);
      expect(result.valido).toBe(false);
    });
  });

  describe('criarTemplateArquetipoPersonalizado', () => {
    it('should create a template with the given name', () => {
      const result = criarTemplateArquetipoPersonalizado(
        'meu-projeto',
        ['src', 'tests', 'bin'],
        ['package.json', 'tsconfig.json'],
        'cli-modular'
      );
      expect(result.nome).toBe('meu-projeto');
      expect(result.arquetipoOficial).toBe('cli-modular');
      expect(result.estruturaPersonalizada).toBeDefined();
    });

    it('should infer cli-modular when bin and cli dirs present', () => {
      const result = criarTemplateArquetipoPersonalizado(
        'meu-cli',
        ['bin', 'bin/index.js', 'cli', 'src'],
        ['package.json'],
        'generico'
      );
      expect(result.arquetipoOficial).toBe('cli-modular');
    });

    it('should infer api-rest-express when controllers and routes present', () => {
      const result = criarTemplateArquetipoPersonalizado(
        'minha-api',
        ['src/controllers', 'src/routes'],
        ['package.json'],
        'generico'
      );
      expect(result.arquetipoOficial).toBe('api-rest-express');
    });

    it('should infer fullstack when pages and api present', () => {
      const result = criarTemplateArquetipoPersonalizado(
        'fullstack',
        ['pages', 'api', 'components'],
        ['package.json'],
        'generico'
      );
      expect(result.arquetipoOficial).toBe('fullstack');
    });

    it('should include melhoresPraticas', () => {
      const result = criarTemplateArquetipoPersonalizado(
        'test',
        ['src'],
        ['package.json'],
      );
      expect(result.melhoresPraticas).toBeDefined();
      expect(Array.isArray(result.melhoresPraticas!.recomendado)).toBe(true);
    });
  });

  describe('gerarSugestaoArquetipoPersonalizado', () => {
    it('should generate a suggestion string', () => {
      const result = gerarSugestaoArquetipoPersonalizado({
        nome: 'meu-projeto',
        estruturaDetectada: ['src', 'tests'],
        arquivosRaiz: ['package.json', 'README.md'],
      });
      expect(typeof result).toBe('string');
      expect(result).toContain('meu-projeto');
      expect(result).toContain('prometheus diagnosticar');
    });
  });

  describe('integrarArquetipos', () => {
    it('should merge personalizado with oficial', () => {
      const personalizado = {
        nome: 'meu-cli',
        descricao: 'My custom CLI',
        arquetipoOficial: 'cli-modular',
        estruturaPersonalizada: {
          diretorios: ['bin', 'src/commands'],
          arquivosChave: ['package.json', 'tsconfig.json'],
          padroesNomenclatura: {},
        },
      };
      const oficial = {
        nome: 'cli-modular',
        descricao: 'CLI modular',
        requiredDirs: ['bin'],
        optionalDirs: ['src/cli'],
        pesoBase: 1.5,
        forbiddenDirs: ['pages'],
        dependencyHints: ['commander'],
        rootFilesAllowed: ['package.json'],
      };
      const result = integrarArquetipos(personalizado as any, oficial as any);
      expect(result.nome).toBe('meu-cli');
      expect(result.descricao).toBe('My custom CLI');
      expect(result.requiredDirs).toEqual(['bin', 'src/commands']);
      expect(result.optionalDirs).toEqual(['src/cli']);
      expect(result.forbiddenDirs).toEqual(['pages']);
    });
  });
});
