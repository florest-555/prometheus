// SPDX-License-Identifier: MIT-0

/**
 * Fonte única de exportação de tipos
 * Apenas re-exports limpos - toda lógica fica nos arquivos dedicados
 */

// Analistas
export * from './analistas/contexto.js';
export type {
  ASTNode,
  CorrecaoConfig,
  CorrecaoResult,
  ResultadoAnaliseEstrutural,
} from './analistas/corrections.js';
export * from './analistas/corrections/type-safety.js';
export * from './analistas/detectores.js';
export * from './analistas/estrategistas.js';
export * from './analistas/handlers.js';
export * from './analistas/metricas.js';
export * from './analistas/modulos-dinamicos.js';
export * from './analistas/pontuacao.js';

// CLI
export * from './cli/comandos.js';
export * from './cli/diagnostico.js';
export * from './cli/diagnostico-handlers.js';
export * from './cli/exporters.js';
export * from './cli/handlers.js';
export * from './cli/log-extensions.js';
export * from './cli/metricas.js';
export * from './cli/metricas-analistas.js';
export * from './cli/options.js';
export * from './cli/processamento-diagnostico.js';

// Comum (agora em shared)

export * from './estrutura/arquetipos.js';

// Guardian
export * from './guardian/baseline.js';
export * from './guardian/gpg.js';
export * from './guardian/integridade.js';
export * from './guardian/registros.js';
export * from './guardian/resultado.js';
export * from './guardian/snapshot.js';

// Core
export * from './core/config/config.js';
export * from './core/config/filtros.js';
export * from './core/messages/index.js';
export * from './core/messages/log.js';
export * from './core/parsing/babel-narrow.js';
export * from './core/parsing/parser.js';
export * from './core/parsing/plugins.js';
export * from './core/utils/chalk.js';

// Core - Execution (evitar duplicatas)
export * from './core/execution/ambiente.js';
export * from './core/execution/estrutura-json.js';
export * from './core/execution/executor.js';
export * from './core/execution/linguagens.js';
export * from './core/execution/parse-erros.js';
export * from './core/execution/registry.js';
export * from './core/execution/scan.js';
export * from './core/execution/schema.js';
export * from './core/execution/workers.js';

// Core - Execution (exports específicos para evitar duplicatas)
export type {
  CacheValor,
  EstadoIncremental,
  RegistroHistorico,
} from './core/execution/executor.js';
export type {
  EstadoIncArquivo,
  EstadoIncrementalInquisidor,
  MetricasGlobais,
  SimbolosLog,
} from './core/execution/inquisidor.js';
export * from './core/execution/resultados.js';

// Core - Corrections
export * from './core/corrections/auto-fix.js';

// Core - Messages Types
export type {
  AgrupamentoConfig,
  ConfigPrioridade,
  FiltrosConfig,
  MetadadosRelatorioEstendido,
} from './core/messages.js';

// Projeto
export * from './projeto/contexto.js';
export * from './projeto/deteccao.js';

// Relatorios
export * from './relatorios/index.js';

// Shared
export * from './shared/index.js';

// Zeladores
export * from './zeladores/imports.js';
export * from './zeladores/mapa-reversao.js';
export * from './zeladores/poda.js';
export * from './zeladores/pontuacao.js';

// Licensas
export type {
  DisclaimerAddResult,
  DisclaimerVerifyResult,
  LicenseScanOptions,
  PackageInfo,
  ScanResult,
} from './licensas.js';
