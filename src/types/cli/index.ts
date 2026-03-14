// SPDX-License-Identifier: MIT-0
/**
 * @fileoverview Exportações centralizadas de tipos da CLI
 */

// Options e Filtros
export type {
  FiltrosProcessados,
  FixTypesOptions,
  FlagsBrutas,
  FlagsNormalizadas,
  FormatoSaida,
  ModoAutoFix,
  ModoOperacao,
  NivelLog,
  OpcoesProcessamentoFiltros,
  OtimizarSvgOptions,
  PrometheusGlobalFlags,
  ResultadoValidacao,
} from '@pt-types/cli/options.js';

// Handlers
export type {
  CasoTipoInseguro,
  FixTypesExportOptions,
  FixTypesExportResult,
  GuardianBaselineCli as GuardianBaseline, // Alias para compatibilidade
  GuardianBaselineCli,
  GuardianExportOptions,
  GuardianExportResult,
  PodaExportOptions,
  PodaExportResult,
  ReestruturacaoExportOptions,
  ReestruturacaoExportResult,
} from '@pt-types/cli/handlers.js';

// Exporters
export type {
  DadosRelatorioMarkdown,
  JsonExportOptions,
  MarkdownExportOptions,
  RelatorioJson,
  ResultadoSharding,
  ShardInfo,
  ShardingOptions,
} from '@pt-types/cli/exporters.js';

// Diagnostico Handlers
export type {
  ArquetipoOptions,
  ArquetipoResult,
  AutoFixOptions,
  AutoFixResult,
  GuardianOptions,
  GuardianResultadoProcessamento,
} from '@pt-types/cli/diagnostico-handlers.js';

// Diagnóstico Base
export type {
  LocBabel,
  OpcoesDiagnosticoBase,
  ResultadoDiagnosticoBase,
} from '@pt-types/cli/diagnostico.js';

// Comandos CLI
export type {
  FormatarCommandOpts,
  FormatResult,
  OtimizarSvgCommandOpts,
  ParentWithOpts,
} from '@pt-types/cli/comandos.js';

// Log Extensions
export type { LogExtensions } from '@pt-types/cli/log-extensions.js';

// Processamento Diagnóstico (tipos completos)
export type {
  OpcoesProcessamentoDiagnostico,
  ResultadoProcessamentoDiagnostico,
} from '@pt-types/cli/processamento-diagnostico.js';

// Métricas
export type {
  MetricaAnalistaLike,
  MetricaExecucao,
  MetricaExecucaoLike,
  SnapshotPerf,
} from '@pt-types/cli/metricas.js';
