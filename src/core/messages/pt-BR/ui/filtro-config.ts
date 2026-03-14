// SPDX-License-Identifier: MIT-0
/**
 * Configurações centralizadas para o filtro inteligente de relatórios
 * Define prioridades, agrupamentos e categorização de problemas
 */

import {
  ICONES_ARQUIVO,
  ICONES_DIAGNOSTICO,
  ICONES_FEEDBACK,
} from '@core/messages/pt-BR/ui/icons.js';
import { i18n } from '@shared/helpers/i18n.js';

import type { AgrupamentoConfig, ConfigPrioridade, PrioridadeNivel } from '@';

// Re-exporta os tipos para compatibilidade
export type { AgrupamentoConfig, ConfigPrioridade, PrioridadeNivel };

const t = (pt: string, en: string): string => i18n({ 'pt-BR': pt, en });

  /* -------------------------- PRIORIDADES POR TIPO DE PROBLEMA -------------------------- */

export const PRIORIDADES: Record<string, ConfigPrioridade> = {
  // Críticos - Segurança e dados
  PROBLEMA_SEGURANCA: {
    prioridade: 'critica',
    icone: '[LOCK]',
    descricao: 'Vulnerabilidade de segurança detectada',
  },
  VULNERABILIDADE_SEGURANCA: {
    prioridade: 'critica',
    icone: '[ERRO]',
    descricao: 'Falha de segurança grave',
  },
  CREDENCIAIS_EXPOSTAS: {
    prioridade: 'critica',
    icone: '[LOCK]',
    descricao: 'Credenciais hardcoded ou expostas',
  },

  // Altos - Código frágil e bugs
  CODIGO_FRAGIL: {
    prioridade: 'alta',
    icone: '[AVISO]',
    descricao: 'Código suscetível a falhas',
  },
  'tipo-inseguro-any': {
    prioridade: 'alta',
    icone: '[HIGH]',
    descricao: 'Uso de tipo any que pode ser substituído',
  },
  'tipo-inseguro-unknown': {
    prioridade: 'media',
    icone: '[WARN]',
    descricao: 'Uso de tipo unknown que pode ser específico',
  },
  PROBLEMA_TESTE: {
    prioridade: 'alta',
    icone: '[TEST]',
    descricao: 'Problemas com testes',
  },
  'estrutura-suspeita': {
    prioridade: 'alta',
    icone: '[SCAN]',
    descricao: 'Estrutura de código suspeita',
  },
  COMPLEXIDADE_ALTA: {
    prioridade: 'alta',
    icone: '[STATS]',
    descricao: 'Complexidade ciclomática alta',
  },

  // Médios - Manutenibilidade e padrões
  PROBLEMA_DOCUMENTACAO: {
    prioridade: 'media',
    icone: '[DOC]',
    descricao: 'Documentação ausente ou inadequada',
  },
  'padrao-ausente': {
    prioridade: 'media',
    icone: '[GOAL]',
    descricao: 'Padrão recomendado ausente',
  },
  'estrutura-config': {
    prioridade: 'media',
    icone: '[CONFIG]',
    descricao: 'Problemas de configuração',
  },
  'estrutura-entrypoints': {
    prioridade: 'media',
    icone: '[ENTRY]',
    descricao: 'Entrypoints mal definidos',
  },
  ANALISE_ARQUITETURA: {
    prioridade: 'media',
    icone: '[BUILD]',
    descricao: 'Análise arquitetural',
  },

  // Baixos - Informativo e melhorias
  CONSTRUCOES_SINTATICAS: {
    prioridade: 'baixa',
    icone: '[SYNTAX]',
    descricao: 'Padrões sintáticos detectados',
  },
  CARACTERISTICAS_ARQUITETURA: {
    prioridade: 'baixa',
    icone: '[ARCH]',
    descricao: 'Características arquiteturais',
  },
  METRICAS_ARQUITETURA: {
    prioridade: 'baixa',
    icone: '[SIZE]',
    descricao: 'Métricas arquiteturais',
  },
  TODO_PENDENTE: {
    prioridade: 'baixa',
    icone: ICONES_FEEDBACK.dica,
    descricao: 'TODOs e tarefas pendentes',
  },
  IDENTIFICACAO_PROJETO: {
    prioridade: 'baixa',
    icone: '[TAG]',
    descricao: 'Identificação do tipo de projeto',
  },
  SUGESTAO_MELHORIA: {
    prioridade: 'baixa',
    icone: '[DICA]',
    descricao: 'Sugestão de melhoria',
  },
  EVIDENCIA_CONTEXTO: {
    prioridade: 'baixa',
    icone: '[SCAN]',
    descricao: 'Evidência de contexto',
  },
  TECNOLOGIAS_ALTERNATIVAS: {
    prioridade: 'baixa',
    icone: '[ALT]',
    descricao: 'Tecnologias alternativas sugeridas',
  },
};

  /* -------------------------- AGRUPAMENTOS INTELIGENTES POR PADRÃO DE MENSAGEM -------------------------- */

export const AGRUPAMENTOS_MENSAGEM: AgrupamentoConfig[] = [
  // Segurança Crítica
  {
    padrao:
      /token hardcoded|senha hardcoded|chave hardcoded|api.*key.*hardcoded/i,
    categoria: 'SEGURANCA_HARDCODED',
    get titulo() { return t('Credenciais Hardcoded Detectadas', 'Hardcoded Credentials Detected'); },
    prioridade: 'critica',
    icone: ICONES_ARQUIVO.lock,
    get acaoSugerida() { return t('Mover credenciais para variáveis de ambiente (.env)', 'Move credentials to environment variables (.env)'); },
  },
  {
    padrao: /sql.*injection|xss|csrf|path.*traversal|command.*injection/i,
    categoria: 'VULNERABILIDADES_WEB',
    get titulo() { return t('Vulnerabilidades Web Detectadas', 'Web Vulnerabilities Detected'); },
    prioridade: 'critica',
    icone: '[ERRO]',
    get acaoSugerida() { return t('Aplicar sanitização e validação de entrada', 'Apply input sanitization and validation'); },
  },

  // Código Frágil (Alta)
  {
    padrao: /tipo.*inseguro.*any|any.*inseguro|unsafe.*any/i,
    categoria: 'TIPOS_ANY_INSEGUROS',
    get titulo() { return t('Tipos Any Inseguros Detectados', 'Unsafe Any Types Detected'); },
    prioridade: 'alta',
    icone: '[HIGH]',
    get acaoSugerida() { return t('Substituir any por tipos específicos para melhorar type safety', 'Replace any with specific types to improve type safety'); },
  },
  {
    padrao: /tipo.*inseguro.*unknown|unknown.*inseguro|unsafe.*unknown/i,
    categoria: 'TIPOS_UNKNOWN_GENERICOS',
    get titulo() { return t('Tipos Unknown Genéricos', 'Generic Unknown Types'); },
    prioridade: 'media',
    icone: '[WARN]',
    get acaoSugerida() { return t('Adicionar type guards ou substituir por tipos específicos', 'Add type guards or replace with specific types'); },
  },
  {
    padrao: /missing-tests|missing tests|sem testes|no.*tests/i,
    categoria: 'TESTES_AUSENTES',
    get titulo() { return t('Arquivos Sem Testes', 'Files Without Tests'); },
    prioridade: 'alta',
    icone: '[TEST]',
    get acaoSugerida() { return t('Implementar testes unitários para melhorar cobertura', 'Implement unit tests to improve coverage'); },
  },
  {
    padrao: /complexidade.*alta|complex.*high|cyclomatic.*complexity/i,
    categoria: 'COMPLEXIDADE_ALTA',
    get titulo() { return t('Código com Alta Complexidade', 'High Complexity Code'); },
    prioridade: 'alta',
    icone: '[STATS]',
    get acaoSugerida() { return t('Refatorar em funções menores para melhorar legibilidade', 'Refactor into smaller functions to improve readability'); },
  },
  {
    padrao: /acoplamento.*alto|coupling.*high|tight.*coupling/i,
    categoria: 'ACOPLAMENTO_ALTO',
    get titulo() { return t('Alto Acoplamento Entre Módulos', 'High Coupling Between Modules'); },
    prioridade: 'alta',
    icone: '[LINK]',
    get acaoSugerida() { return t('Revisar dependências e aplicar padrões de desacoplamento', 'Review dependencies and apply decoupling patterns'); },
  },

  // Manutenibilidade (Média)
  {
    padrao:
      /missing-jsdoc|missing documentation|sem documentação|no.*documentation/i,
    categoria: 'DOCUMENTACAO_AUSENTE',
    get titulo() { return t('Documentação Ausente', 'Missing Documentation'); },
    prioridade: 'media',
    icone: '[DOC]',
    get acaoSugerida() { return t('Adicionar JSDoc/comentários para melhorar manutenibilidade', 'Add JSDoc/comments to improve maintainability'); },
  },
  {
    padrao: /console\.log|console-log|debug.*statement/i,
    categoria: 'CONSOLE_LOGS',
    get titulo() { return t('Console.log em Código de Produção', 'Console.log in Production Code'); },
    prioridade: 'media',
    icone: '[LOG]',
    get acaoSugerida() { return t('Remover ou substituir por sistema de logging adequado', 'Remove or replace with a proper logging system'); },
  },
  {
    padrao: /código.*duplicado|duplicate.*code|copy.*paste/i,
    categoria: 'DUPLICACAO_CODIGO',
    get titulo() { return t('Código Duplicado Detectado', 'Duplicate Code Detected'); },
    prioridade: 'media',
    icone: '[COPY]',
    get acaoSugerida() { return t('Extrair para funções/módulos reutilizáveis', 'Extract into reusable functions/modules'); },
  },
  {
    padrao: /função.*longa|long.*function|function.*too.*large/i,
    categoria: 'FUNCOES_LONGAS',
    get titulo() { return t('Funções Muito Longas', 'Very Long Functions'); },
    prioridade: 'media',
    icone: '[SIZE]',
    get acaoSugerida() { return t('Dividir em funções menores e mais coesas', 'Split into smaller, cohesive functions'); },
  },

  // Baixa prioridade
  {
    padrao: /todo|fixme|hack|workaround/i,
    categoria: 'TAREFAS_PENDENTES',
    get titulo() { return t('Tarefas Pendentes no Código', 'Pending Tasks in Code'); },
    prioridade: 'baixa',
    icone: ICONES_FEEDBACK.dica,
    get acaoSugerida() { return t('Revisar e resolver TODOs/FIXMEs pendentes', 'Review and resolve pending TODOs/FIXMEs'); },
  },
  {
    padrao: /magic.*number|número.*mágico/i,
    categoria: 'NUMEROS_MAGICOS',
    get titulo() { return t('Números Mágicos no Código', 'Magic Numbers in Code'); },
    prioridade: 'baixa',
    icone: ICONES_DIAGNOSTICO.stats,
    get acaoSugerida() { return t('Substituir por constantes nomeadas', 'Replace with named constants'); },
  },
];

  /* -------------------------- HELPERS -------------------------- */

/**
 * Obtém a prioridade de um tipo de problema
 */
export function getPrioridade(tipo: string): ConfigPrioridade {
  return (
    PRIORIDADES[tipo] || {
      prioridade: 'baixa',
      icone: ICONES_ARQUIVO.arquivo,
      descricao: t('Problema não categorizado', 'Uncategorized issue'),
    }
  );
}

/**
 * Encontra agrupamento por mensagem
 */
export function findAgrupamento(mensagem: string): AgrupamentoConfig | null {
  for (const grupo of AGRUPAMENTOS_MENSAGEM) {
    if (grupo.padrao.test(mensagem)) {
      return grupo;
    }
  }
  return null;
}

/**
 * Ordena problemas por prioridade
 */
export function ordenarPorPrioridade<
  T extends { prioridade?: PrioridadeNivel },
>(problemas: T[]): T[] {
  const ordem: Record<PrioridadeNivel, number> = {
    critica: 0,
    alta: 1,
    media: 2,
    baixa: 3,
  };

  return [...problemas].sort((a, b) => {
    const prioA = a.prioridade || 'baixa';
    const prioB = b.prioridade || 'baixa';
    return ordem[prioA] - ordem[prioB];
  });
}

/**
 * Conta problemas por prioridade
 */
export function contarPorPrioridade<T extends { prioridade?: PrioridadeNivel }>(
  problemas: T[],
): Record<PrioridadeNivel, number> {
  const contagem: Record<PrioridadeNivel, number> = {
    critica: 0,
    alta: 0,
    media: 0,
    baixa: 0,
  };

  for (const prob of problemas) {
    const prio = prob.prioridade || 'baixa';
    contagem[prio]++;
  }

  return contagem;
}
