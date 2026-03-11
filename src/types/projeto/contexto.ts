// SPDX-License-Identifier: MIT-0
/**
 * Tipos para detecção de contexto de projetos
 * Originalmente em: src/shared/contexto-projeto.ts
 */

export interface ContextoProjeto {
  isBot: boolean;
  isCLI: boolean;
  isWebApp: boolean;
  isLibrary: boolean;
  isTest: boolean;
  isConfiguracao: boolean;
  isInfrastructure: boolean;
  isBackend: boolean;
  isFrontend: boolean;
  isServerComponent: boolean;
  frameworks: string[];
  linguagens: string[];
  arquetipo?: string;
}
export interface DetectarContextoOpcoes {
  arquivo: string;
  conteudo: string;
  relPath?: string;
  packageJson?: Record<string, unknown>;
}
