// SPDX-License-Identifier: MIT-0

/**
 * Fonte única de exportação de tipos
 * Apenas re-exports limpos - toda lógica fica nos arquivos dedicados
 */

// Analistas
export * from '@pt-types/analistas/contexto.js';
// Agente
export * from '@pt-types/agent/index.js';
export type {
  ASTNode,
  CorrecaoConfig,
  CorrecaoResult,
  ResultadoAnaliseEstrutural,
} from '@pt-types/analistas/corrections.js';
export * from '@pt-types/analistas/corrections/type-safety.js';
export * from '@pt-types/analistas/detectores.js';
export * from '@pt-types/analistas/estrategistas.js';
export * from '@pt-types/analistas/handlers.js';
export * from '@pt-types/analistas/metricas.js';
export * from '@pt-types/analistas/modulos-dinamicos.js';
export * from '@pt-types/analistas/pontuacao.js';

// CLI
export * from '@pt-types/cli/comandos.js';
export * from '@pt-types/cli/diagnostico.js';
export * from '@pt-types/cli/diagnostico-handlers.js';
export * from '@pt-types/cli/exporters.js';
export * from '@pt-types/cli/handlers.js';
export * from '@pt-types/cli/log-extensions.js';
export * from '@pt-types/cli/metricas.js';
export * from '@pt-types/cli/metricas-analistas.js';
export * from '@pt-types/cli/options.js';
export * from '@pt-types/cli/processamento-diagnostico.js';

// Comum (agora em shared)

export * from '@pt-types/estrutura/arquetipos.js';

// Guardian
export * from '@pt-types/guardian/baseline.js';
export * from '@pt-types/guardian/gpg.js';
export * from '@pt-types/guardian/integridade.js';
export * from '@pt-types/guardian/registros.js';
export * from '@pt-types/guardian/resultado.js';
export * from '@pt-types/guardian/snapshot.js';

// Core
export * from '@pt-types/core/config/config.js';
export * from '@pt-types/core/config/filtros.js';
export * from '@pt-types/core/messages/index.js';
export * from '@pt-types/core/messages/log.js';
export * from '@pt-types/core/parsing/babel-narrow.js';
export * from '@pt-types/core/parsing/parser.js';
export * from '@pt-types/core/parsing/plugins.js';
export * from '@pt-types/core/utils/chalk.js';

// Core - Execution (evitar duplicatas)
export * from '@pt-types/core/execution/ambiente.js';
export * from '@pt-types/core/execution/estrutura-json.js';
export * from '@pt-types/core/execution/executor.js';
export * from '@pt-types/core/execution/linguagens.js';
export * from '@pt-types/core/execution/parse-erros.js';
export * from '@pt-types/core/execution/registry.js';
export * from '@pt-types/core/execution/scan.js';
export * from '@pt-types/core/execution/schema.js';
export * from '@pt-types/core/execution/workers.js';

// Core - Execution (exports específicos para evitar duplicatas)
export type {
  CacheValor,
  EstadoIncremental,
  RegistroHistorico,
} from '@pt-types/core/execution/executor.js';
export type {
  EstadoIncArquivo,
  EstadoIncrementalInquisidor,
  MetricasGlobais,
  SimbolosLog,
} from '@pt-types/core/execution/inquisidor.js';
export * from '@pt-types/core/execution/resultados.js';

// Core - Corrections
export * from '@pt-types/core/corrections/auto-fix.js';

// Core - Messages Types
export type {
  AgrupamentoConfig,
  ConfigPrioridade,
  FiltrosConfig,
  MetadadosRelatorioEstendido,
} from '@pt-types/core/messages.js';

// Projeto
export * from '@pt-types/projeto/contexto.js';
export * from '@pt-types/projeto/deteccao.js';

// Relatorios
export * from '@pt-types/relatorios/index.js';

// Shared
export * from '@pt-types/shared/index.js';

// Zeladores
export * from '@pt-types/zeladores/imports.js';
export * from '@pt-types/zeladores/mapa-reversao.js';
export * from '@pt-types/zeladores/poda.js';
export * from '@pt-types/zeladores/pontuacao.js';

// Licensas
export type {
  DisclaimerAddResult,
  DisclaimerVerifyResult,
  LicenseScanOptions,
  PackageInfo,
  ScanResult,
} from '@pt-types/licensas.js';

// Shell
export * from '@pt-types/shell.js';
