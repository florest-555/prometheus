// SPDX-License-Identifier: MIT-0

export interface ProblemaDocumentacao {
  tipo: string;
  linha: number;
  coluna: number;
  contexto?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  descricao?: string;
  sugestao?: string;
}

export interface ProblemaPerformance {
  tipo: string;
  linha: number;
  coluna: number;
  descricao?: string;
  impacto?: 'baixo' | 'medio' | 'alto';
  sugestao?: string;
}

export interface ProblemaFormatacao {
  tipo: string;
  linha?: number;
  coluna?: number;
  mensagem?: string;
}

export interface ProblemaSeguranca {
  tipo:
    | 'eval-usage'
    | 'dangerous-html'
    | 'weak-crypto'
    | 'unsafe-regex'
    | 'prototype-pollution'
    | 'path-traversal'
    | 'hardcoded-secrets'
    | 'unhandled-async'
    | 'unhandled-async-event'
    | 'sql-injection'
    | 'command-injection'
    | 'xxe'
    | 'insecure-deserialization'
    | 'catastrophic-regex'
    | 'weak-random'
    | 'insecure-cookie'
    | 'missing-csrf'
    | 'hardcoded-ip'
    | 'jwt-weak'
    | 'tar-pit'
    | 'bypass-security'
    | 'ssrf'
    | 'xss-avancado'
    | 'open-redirect';
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  linha: number;
  coluna?: number;
  sugestao: string;
}

export interface ProblemaTeste {
  tipo:
    | 'missing-tests'
    | 'poor-coverage'
    | 'flaky-test'
    | 'slow-test'
    | 'test-smells'
    | 'mock-abuse';
  descricao: string;
  severidade: 'baixa' | 'media' | 'alta';
  linha: number;
  sugestao: string;
}

export interface FragilidadesDetalhesArgs {
  severidade: string;
  total: number;
  tipos: Record<string, number>;
  amostra: string[];
}
