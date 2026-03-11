// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoMetricasMensagens = createI18nMessages({
  descricao: 'Inspeciona histórico de métricas de execuções anteriores',
  opcoes: {
    json: 'Saída em JSON estruturado (para CI/integrações)',
    limite: 'Quantidade de registros mais recentes (default 10)',
    export: 'Exporta histórico completo em JSON para arquivo',
    analistas: 'Exibe tabela agregada por analista (top 5)'
  },
  erroProcessar: (erro: string) => `Falha ao processar métricas: ${erro}`,
  historicoExportado: (destino: string) => `?? Histórico completo exportado para ${destino}`,
  linhaExecucao: (timestampISO: string, totalArquivos: number, duracaoAnalise: string, duracaoParsing: string, cacheHits: number, cacheMiss: number) => `- ${timestampISO} | arquivos=${totalArquivos} analise=${duracaoAnalise} parsing=${duracaoParsing} cache(h/m)=${cacheHits}/${cacheMiss}`,
  tituloTopAnalistas: (iconeInfo: string) => `${iconeInfo} Top analistas (por tempo acumulado):`,
  linhaTopAnalista: (nome: string, total: string, media: string, execucoes: number, ocorrencias: number) => `  • ${nome} total=${total} média=${media} exec=${execucoes} ocorr=${ocorrencias}`,
  medias: (mediaAnalise: string, mediaParsing: string) => `\nMédias (histórico completo): analise=${mediaAnalise}, parsing=${mediaParsing}`,
  linhaEmBranco: ''
}, {
  descricao: 'Inspects metrics history from previous executions',
  opcoes: {
    json: 'Output in structured JSON (for CI/integrations)',
    limite: 'Number of most recent records (default 10)',
    export: 'Exports complete history in JSON to file',
    analistas: 'Displays aggregated table by analyst (top 5)'
  },
  erroProcessar: (erro: string) => `Failed to process metrics: ${erro}`,
  historicoExportado: (destino: string) => `?? Complete history exported to ${destino}`,
  linhaExecucao: (timestampISO: string, totalArquivos: number, duracaoAnalise: string, duracaoParsing: string, cacheHits: number, cacheMiss: number) => `- ${timestampISO} | files=${totalArquivos} analysis=${duracaoAnalise} parsing=${duracaoParsing} cache(h/m)=${cacheHits}/${cacheMiss}`,
  tituloTopAnalistas: (iconeInfo: string) => `${iconeInfo} Top analysts (by accumulated time):`,
  linhaTopAnalista: (nome: string, total: string, media: string, execucoes: number, ocorrencias: number) => `  • ${nome} total=${total} avg=${media} exec=${execucoes} occur=${ocorrencias}`,
  medias: (mediaAnalise: string, mediaParsing: string) => `\nAverages (complete history): analysis=${mediaAnalise}, parsing=${mediaParsing}`,
  linhaEmBranco: ''
});
