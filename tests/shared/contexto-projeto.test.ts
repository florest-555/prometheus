// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarContextoProjeto, isRelevanteParaAnalise, sugerirFrameworks } from '../../src/shared/contexto-projeto';

describe('contexto-projeto', () => {
  describe('detectarContextoProjeto', () => {
    it('should detect test files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'foo.test.ts',
        conteudo: 'describe("test", () => {})',
        relPath: 'tests/foo.test.ts',
      });
      expect(result.isTest).toBe(true);
    });

    it('should detect TypeScript files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'foo.ts',
        conteudo: 'const x = 1;',
        relPath: 'src/foo.ts',
      });
      expect(result.linguagens).toContain('typescript');
    });

    it('should detect JavaScript files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'foo.js',
        conteudo: 'const x = 1;',
        relPath: 'src/foo.js',
      });
      expect(result.linguagens).toContain('javascript');
    });

    it('should detect config files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'tsconfig.json',
        conteudo: '{}',
        relPath: 'tsconfig.json',
      });
      expect(result.isConfiguracao).toBe(true);
    });

    it('should detect Discord bot files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'bot.ts',
        conteudo: "import { Client } from 'discord.js';",
        relPath: 'src/bot.ts',
      });
      expect(result.isBot).toBe(true);
      expect(result.frameworks).toContain('discord.js');
    });

    it('should detect CLI files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'cli.ts',
        conteudo: "import { program } from 'commander'; program.option('-v');",
        relPath: 'src/cli.ts',
      });
      expect(result.isCLI).toBe(true);
    });

    it('should detect backend files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'server.ts',
        conteudo: "import express from 'express'; const app = express();",
        relPath: 'src/server.ts',
      });
      expect(result.isBackend).toBe(true);
      expect(result.isWebApp).toBe(true);
    });

    it('should detect frontend files by JSX extension', () => {
      const result = detectarContextoProjeto({
        arquivo: 'App.tsx',
        conteudo: 'export default function App() { return <div/>; }',
        relPath: 'src/App.tsx',
      });
      expect(result.isFrontend).toBe(true);
    });

    it('should detect infrastructure files', () => {
      const result = detectarContextoProjeto({
        arquivo: 'index.ts',
        conteudo: 'export default function main() {}',
        relPath: 'src/index.ts',
      });
      expect(result.isInfrastructure).toBe(true);
    });

    it('should detect library by export patterns', () => {
      const result = detectarContextoProjeto({
        arquivo: 'utils.ts',
        conteudo: 'export function helper() { return 1; }',
        relPath: 'src/utils.ts',
      });
      expect(result.isLibrary).toBe(true);
    });

    it('should detect frontend by browser APIs', () => {
      const result = detectarContextoProjeto({
        arquivo: 'ui.ts',
        conteudo: 'document.getElementById("app"); window.location.href = "/";',
        relPath: 'src/ui.ts',
      });
      expect(result.isFrontend).toBe(true);
    });
  });

  describe('isRelevanteParaAnalise', () => {
    it('should return false for test files', () => {
      expect(isRelevanteParaAnalise({ isTest: true } as any, 'comando')).toBe(false);
    });

    it('should return false for config files', () => {
      expect(isRelevanteParaAnalise({ isConfiguracao: true } as any, 'web')).toBe(false);
    });

    it('should return true for bot context when analyzing bot', () => {
      expect(isRelevanteParaAnalise({
        isBot: true, isCLI: false, isTest: false, isConfiguracao: false, isInfrastructure: false,
      } as any, 'bot')).toBe(true);
    });

    it('should return true for web context when analyzing web', () => {
      expect(isRelevanteParaAnalise({
        isWebApp: true, isTest: false, isConfiguracao: false, isInfrastructure: false,
      } as any, 'web')).toBe(true);
    });
  });

  describe('sugerirFrameworks', () => {
    it('should suggest frameworks for bot without detected frameworks', () => {
      const result = sugerirFrameworks({ isBot: true, frameworks: [] } as any);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should suggest frameworks for CLI without detected frameworks', () => {
      const result = sugerirFrameworks({ isCLI: true, frameworks: [] } as any);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should not suggest when framework already detected', () => {
      const result = sugerirFrameworks({ isBot: true, frameworks: ['discord.js'] } as any);
      expect(result).toEqual([]);
    });
  });
});
