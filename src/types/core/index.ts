// SPDX-License-Identifier: MIT-0
/**
 * @fileoverview Exportações centralizadas de tipos do core
 */

// Auto-Fix (Corrections)
export type { QuickFix } from '@pt-types/core/corrections/auto-fix.js';

// Configuração
export type {
  AutoFixConfig,
  ConfigExcludesPadrao,
  ConfiguracaoPontuacao,
  PatternBasedQuickFix,
  ValidationResult,
} from '@pt-types/core/config/config.js';

// Mensagens
export type {
  AgrupamentoConfig,
  ConfigPrioridade,
  FiltrosConfig,
  MetadadosRelatorioEstendido,
  PrioridadeNivel,
} from '@pt-types/core/messages.js';

// Execution
export type {
  CacheValor,
  EstadoIncremental,
  EstadoIncrementalExecutor,
  ExecutorEventEmitter,
  RegistroHistorico,
} from '@pt-types/core/execution/executor.js';
export type {
  EstadoIncArquivo,
  MetricasGlobais,
  SimbolosLog,
} from '@pt-types/core/execution/inquisidor.js';
export type { MigrationResult } from '@pt-types/core/execution/registry.js';
export type { RelatorioComVersao, SchemaMetadata } from '@pt-types/core/execution/schema.js';
export type {
  WorkerPoolOptions,
  WorkerResult,
  WorkerTask,
} from '@pt-types/core/execution/workers.js';
