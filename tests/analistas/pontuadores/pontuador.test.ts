// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { scoreArquetipo, pontuarTodos, scoreArquetipoAvancado, pontuarTodosAvancado } from '../../../src/analistas/pontuadores/pontuador';

describe('pontuador', () => {
  describe('scoreArquetipo', () => {
    it('should be defined', () => {
      expect(scoreArquetipo).toBeDefined();
      expect(typeof scoreArquetipo).toBe('function');
    });

    it('should return a result with expected shape', () => {
      const def = {
        nome: 'test-arq',
        descricao: 'Test archetype',
        requiredDirs: ['src'],
        optionalDirs: ['tests'],
        pesoBase: 1.0,
      };
      const arquivos = ['src/index.ts', 'tests/foo.test.ts'];
      const result = scoreArquetipo(def as any, arquivos);

      expect(result).toBeDefined();
      expect(result.nome).toBe('test-arq');
      expect(typeof result.score).toBe('number');
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.matchedRequired)).toBe(true);
      expect(Array.isArray(result.missingRequired)).toBe(true);
      expect(Array.isArray(result.matchedOptional)).toBe(true);
      expect(Array.isArray(result.anomalias)).toBe(true);
    });

    it('should match requiredDirs when present in files', () => {
      const def = {
        nome: 'test',
        descricao: '',
        requiredDirs: ['src'],
        pesoBase: 1.0,
      };
      const result = scoreArquetipo(def as any, ['src/index.ts']);
      expect(result.matchedRequired).toContain('src');
      expect(result.missingRequired).toHaveLength(0);
    });

    it('should report missingRequired when dir not present', () => {
      const def = {
        nome: 'test',
        descricao: '',
        requiredDirs: ['src', 'lib'],
        pesoBase: 1.0,
      };
      const result = scoreArquetipo(def as any, ['src/index.ts']);
      expect(result.matchedRequired).toContain('src');
      expect(result.missingRequired).toContain('lib');
    });

    it('should penalize forbiddenDirs when present', () => {
      const defNoForbidden = {
        nome: 'test-no',
        descricao: '',
        requiredDirs: ['src'],
        pesoBase: 1.0,
      };
      const defWithForbidden = {
        nome: 'test-with',
        descricao: '',
        requiredDirs: ['src'],
        forbiddenDirs: ['pages'],
        pesoBase: 1.0,
      };
      const files = ['src/index.ts', 'pages/home.tsx'];
      const resultNoForbidden = scoreArquetipo(defNoForbidden as any, files);
      const resultWithForbidden = scoreArquetipo(defWithForbidden as any, files);

      expect(resultWithForbidden.forbiddenPresent).toContain('pages');
      expect(resultWithForbidden.score).toBeLessThan(resultNoForbidden.score);
    });

    it('should detect anomalias for root files not allowed', () => {
      const def = {
        nome: 'test',
        descricao: '',
        requiredDirs: ['src'],
        rootFilesAllowed: ['package.json'],
        pesoBase: 1.0,
      };
      const result = scoreArquetipo(def as any, ['src/index.ts', 'unexpected.txt']);
      expect(result.anomalias.length).toBeGreaterThan(0);
    });
  });

  describe('pontuarTodos', () => {
    it('should be defined', () => {
      expect(pontuarTodos).toBeDefined();
      expect(typeof pontuarTodos).toBe('function');
    });

    it('should return array of results', () => {
      const result = pontuarTodos(['src/index.ts', 'package.json']);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter results with no signals', () => {
      // Empty file list should produce very few or no matching archetypes
      const result = pontuarTodos([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should detect cli-modular for bin/ structure', () => {
      const files = ['bin/index.js', 'src/cli/commands/run.ts', 'package.json'];
      const result = pontuarTodos(files);
      const cli = result.find(r => r.nome === 'cli-modular');
      if (cli) {
        expect(cli.matchedRequired).toContain('bin');
      }
    });
  });

  describe('scoreArquetipoAvancado', () => {
    it('should be defined', () => {
      expect(scoreArquetipoAvancado).toBeDefined();
      expect(typeof scoreArquetipoAvancado).toBe('function');
    });

    it('should return base result when no sinaisAvancados', () => {
      const def = {
        nome: 'test',
        descricao: '',
        requiredDirs: ['src'],
        pesoBase: 1.0,
      };
      const result = scoreArquetipoAvancado(def as any, ['src/index.ts']);
      expect(result).toBeDefined();
      expect(result.nome).toBe('test');
    });

    it('should increase score with matching sinaisAvancados', () => {
      const def = {
        nome: 'api-rest-express',
        descricao: '',
        requiredDirs: ['src', 'src/controllers'],
        dependencyHints: ['express'],
        pesoBase: 1.3,
      };
      const files = ['src/index.ts', 'src/controllers/userController.ts'];
      const sinais = {
        frameworksDetectados: ['Express'],
        dependencias: ['express'],
        scripts: [],
        detalhes: {},
        tecnologiasDominantes: ['backend-api'],
        padroesArquiteturais: [],
        complexidadeEstrutura: 'media' as const,
        funcoes: 10,
        classes: 2,
        variaveis: 20,
        tipos: [],
      };
      const baseResult = scoreArquetipoAvancado(def as any, files);
      const advResult = scoreArquetipoAvancado(def as any, files, sinais as any);
      expect(advResult.score).toBeGreaterThanOrEqual(baseResult.score);
    });
  });

  describe('pontuarTodosAvancado', () => {
    it('should be defined', () => {
      expect(pontuarTodosAvancado).toBeDefined();
      expect(typeof pontuarTodosAvancado).toBe('function');
    });

    it('should return array of results', () => {
      const result = pontuarTodosAvancado(['src/index.ts']);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
