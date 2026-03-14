// SPDX-License-Identifier: MIT-0
/**
 * @fileoverview Exportações centralizadas de tipos de analistas
 *
 * Re-exporta todos os tipos relacionados a analistas, detectores,
 * estrategistas e suas funcionalidades.
 */

// Markdown
export type {
  MarkdownAnaliseArquivo,
  MarkdownAnaliseStats,
  MarkdownDetectorOptions,
  MarkdownLicensePatterns,
  MarkdownProblema,
  MarkdownProblemaTipo,
  MarkdownSeveridade,
  MarkdownWhitelistConfig,
} from '@pt-types/analistas/markdown.js';

// Detectores
export type {
  AnaliseArquitetural,
  BlocoFuncao,
  ConstrucaoSintatica,
  DuplicacaoEncontrada,
  DuplicateEntry,
  EstatisticasArquivo,
  ExportInfo,
  Fragilidade,
  FragilidadesDetalhesArgs,
  ImportInfo,
  InlineTypeOccurrence,
  InterfaceInlineDetection,
  ProblemaDocumentacao,
  ProblemaFormatacao,
  ProblemaPerformance,
  ProblemaQualidade,
  ProblemaSeguranca,
  ProblemaTeste,
  ResultadoContexto,
  TipoFragilidade,
} from '@pt-types/analistas/detectores.js';

// Contexto (já exportado em detectores, mas mantido para compatibilidade)
export type {
  EvidenciaContexto,
  ResultadoDeteccaoContextual,
} from '@pt-types/analistas/contexto.js';

// Estrategistas
export type {
  ArquivoMeta,
  OpcoesPlanejamento,
  ResultadoEstrutural,
  ResultadoPlanejamento,
  SinaisProjetoAvancados,
} from '@pt-types/analistas/estrategistas.js';

// Correções
export type {
  ASTNode,
  CategorizacaoUnknown,
  CorrecaoConfig,
  CorrecaoResult,
  ResultadoAnaliseEstrutural,
} from '@pt-types/analistas/corrections.js';
