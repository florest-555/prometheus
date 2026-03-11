// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

import { ICONES_ACAO, ICONES_RELATORIO } from '../ui/icons.js';

export const CliExportersMensagens = createI18nMessages({
  poda: {
    relatoriosExportados: (dir: string) => `Relatórios de poda exportados para: ${dir}`,
    falhaExportar: (erroMensagem: string) => `Falha ao exportar relatórios de poda: ${erroMensagem}`
  },
  guardian: {
    relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Relatórios Guardian exportados:`,
    caminhoMarkdown: (caminhoMd: string) => `   Markdown: ${caminhoMd}`,
    caminhoJson: (caminhoJson: string) => `   JSON: ${caminhoJson}`,
    falhaExportar: (erroMensagem: string) => `Falha ao exportar relatórios Guardian: ${erroMensagem}`,
    markdown: {
      titulo: '# Relatório Guardian - Verificação de Integridade',
      geradoEm: (ts: string) => `**Gerado em:** ${ts}`,
      comando: '**Comando:** `prometheus guardian`',
      statusTitulo: (icone: string, status: string) => `## ${icone} Status: ${status}`,
      baselineTitulo: '## [INFO] Baseline',
      driftTitulo: '## [ATENCAO] Drift Detectado',
      deltaConfianca: (n: number) => `- **Delta de confiança:** ${n}%`,
      arquetipoAlterado: (simOuNao: string) => `- **Arquétipo alterado:** ${simOuNao}`,
      arquivosNovos: '### Arquivos Novos',
      arquivosRemovidos: '### Arquivos Removidos',
      errosTitulo: '## [ERRO] Erros',
      avisosTitulo: '## [AVISO] Avisos',
      recomendacoesTitulo: '## [INFO] Recomendações',
      recomendacaoOk: '- [SUCESSO] Projeto está íntegro - nenhuma ação necessária',
      recomendacaoErro: '- [ERRO] Resolver erros críticos antes de prosseguir',
      recomendacaoErroRevise: '- [INFO] Revisar arquivos listados acima',
      recomendacaoDrift: '- [AVISO] Drift de arquétipo detectado - revisar mudanças',
      recomendacaoDriftInfo: '- [INFO] Considerar atualizar baseline se mudanças forem intencionais'
    }
  },
  fixTypes: {
    relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Relatórios de fix-types exportados:`,
    caminhoMarkdown: (caminhoMd: string) => `   Markdown: ${caminhoMd}`,
    caminhoJson: (caminhoJson: string) => `   JSON: ${caminhoJson}`,
    falhaExportar: (erroMensagem: string) => `Falha ao exportar relatórios de fix-types: ${erroMensagem}`,
    markdown: {
      titulo: '# Relatório de Análise de Tipos Inseguros',
      geradoEm: (ts: string) => `**Gerado em:** ${ts}`,
      comando: '**Comando:** `prometheus fix-types`',
      confiancaMin: (min: number) => `**Confiança Mínima:** ${min}%`,
      resumoExecutivo: '## [RESUMO] Resumo Executivo',
      totalCasos: (n: number) => `- **Total de Casos:** ${n}`,
      confiancaMedia: (n: number) => `- **Confiança Média:** ${n}%`,
      distribuicaoTitulo: '### Distribuição por Categoria',
      distribuicaoLegitimo: (total: number, pct: number) => `| [SUCESSO] LEGÍTIMO | ${total} | ${pct}% | Uso correto - nenhuma ação necessária |`,
      distribuicaoMelhoravel: (total: number, pct: number) => `| [AVISO] MELHORÁVEL | ${total} | ${pct}% | Pode ser mais específico - revisão manual recomendada |`,
      distribuicaoCorrigir: (total: number, pct: number) => `| [ERRO] CORRIGIR | ${total} | ${pct}% | Deve ser substituído - correção necessária |`,
      distribuicaoTabelaHeader: '| Categoria | Total | Percentual | Descrição |',
      distribuicaoTabelaDivider: '|-----------|-------|------------|-----------|',
      altaPrioridadeTitulo: '## [ERRO] Correções de Alta Prioridade (≥85% confiança)',
      altaPrioridadeItem: (idx: number, arquivo: string, linha: number | string, conf: number) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
      incertosTitulo: '## [AVISO] Casos com Análise Incerta (<70% confiança)',
      incertosIntro: '*Estes casos requerem revisão manual cuidadosa - múltiplas possibilidades detectadas*',
      incertosItem: (idx: number, arquivo: string, linha: number | string, conf: number) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
      listaCompletaTitulo: '## [INFO] Lista Completa de Casos',
      listaCompletaCategoria: (prefixo: string, titulo: string, qtd: number) => `### ${prefixo} ${titulo} (${qtd} casos)`,
      listaCompletaItem: (arquivo: string, linha: number | string, conf: number) => `- **${arquivo}:${linha}** (${conf}%)`
    }
  },
  reestruturacao: {
    relatoriosExportados: (modoPrefixo: string, dir: string) => `Relatórios de reestruturação ${modoPrefixo}exportados para: ${dir}`,
    falhaExportar: (modoPrefixo: string, erroMensagem: string) => `Falha ao exportar relatórios ${modoPrefixo}de reestruturação: ${erroMensagem}`
  }
}, {
  poda: {
    relatoriosExportados: (dir: string) => `Pruning reports exported to: ${dir}`,
    falhaExportar: (erroMensagem: string) => `Failed to export pruning reports: ${erroMensagem}`
  },
  guardian: {
    relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} Guardian reports exported:`,
    caminhoMarkdown: (caminhoMd: string) => `   Markdown: ${caminhoMd}`,
    caminhoJson: (caminhoJson: string) => `   JSON: ${caminhoJson}`,
    falhaExportar: (erroMensagem: string) => `Failed to export Guardian reports: ${erroMensagem}`,
    markdown: {
      titulo: '# Guardian Report - Integrity Verification',
      geradoEm: (ts: string) => `**Generated at:** ${ts}`,
      comando: '**Command:** `prometheus guardian`',
      statusTitulo: (icone: string, status: string) => `## ${icone} Status: ${status}`,
      baselineTitulo: '## [INFO] Baseline',
      driftTitulo: '## [ATTENTION] Drift Detected',
      deltaConfianca: (n: number) => `- **Confidence delta:** ${n}%`,
      arquetipoAlterado: (simOuNao: string) => `- **Archetype changed:** ${simOuNao}`,
      arquivosNovos: '### New Files',
      arquivosRemovidos: '### Removed Files',
      errosTitulo: '## [ERROR] Errors',
      avisosTitulo: '## [WARNING] Warnings',
      recomendacoesTitulo: '## [INFO] Recommendations',
      recomendacaoOk: '- [SUCCESS] Project is healthy - no action needed',
      recomendacaoErro: '- [ERROR] Resolve critical errors before proceeding',
      recomendacaoErroRevise: '- [INFO] Review files listed above',
      recomendacaoDrift: '- [WARNING] Archetype drift detected - review changes',
      recomendacaoDriftInfo: '- [INFO] Consider updating baseline if changes are intentional'
    }
  },
  fixTypes: {
    relatoriosExportadosTitulo: `${ICONES_ACAO.export} ${ICONES_RELATORIO.detalhado} fix-types reports exported:`,
    caminhoMarkdown: (caminhoMd: string) => `   Markdown: ${caminhoMd}`,
    caminhoJson: (caminhoJson: string) => `   JSON: ${caminhoJson}`,
    falhaExportar: (erroMensagem: string) => `Failed to export fix-types reports: ${erroMensagem}`,
    markdown: {
      titulo: '# Unsafe Types Analysis Report',
      geradoEm: (ts: string) => `**Generated at:** ${ts}`,
      comando: '**Command:** `prometheus fix-types`',
      confiancaMin: (min: number) => `**Minimum Confidence:** ${min}%`,
      resumoExecutivo: '## [SUMMARY] Executive Summary',
      totalCasos: (n: number) => `- **Total Cases:** ${n}`,
      confiancaMedia: (n: number) => `- **Average Confidence:** ${n}%`,
      distribuicaoTitulo: '### Distribution by Category',
      distribuicaoTabelaHeader: '| Category | Total | Percentage | Description |',
      distribuicaoTabelaDivider: '|-----------|-------|------------|-----------|',
      distribuicaoLegitimo: (total: number, pct: number) => `| [SUCCESS] LEGITIMATE | ${total} | ${pct}% | Correct usage - no action needed |`,
      distribuicaoMelhoravel: (total: number, pct: number) => `| [WARNING] IMPROVABLE | ${total} | ${pct}% | Can be more specific - manual review recommended |`,
      distribuicaoCorrigir: (total: number, pct: number) => `| [ERROR] FIX | ${total} | ${pct}% | Must be replaced - fix required |`,
      altaPrioridadeTitulo: '## [ERROR] High Priority Fixes (≥85% confidence)',
      altaPrioridadeItem: (idx: number, arquivo: string, linha: number | string, conf: number) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
      incertosTitulo: '## [WARNING] Cases with Uncertain Analysis (<70% confidence)',
      incertosIntro: '*These cases require careful manual review - multiple possibilities detected*',
      incertosItem: (idx: number, arquivo: string, linha: number | string, conf: number) => `### ${idx}. ${arquivo}:${linha} (${conf}%)`,
      listaCompletaTitulo: '## [INFO] Full Case List',
      listaCompletaCategoria: (prefixo: string, titulo: string, qtd: number) => `### ${prefixo} ${titulo} (${qtd} cases)`,
      listaCompletaItem: (arquivo: string, linha: number | string, conf: number) => `- **${arquivo}:${linha}** (${conf}%)`
    }
  },
  reestruturacao: {
    relatoriosExportados: (modoPrefixo: string, dir: string) => `Restructuring reports ${modoPrefixo}exported to: ${dir}`,
    falhaExportar: (modoPrefixo: string, erroMensagem: string) => `Failed to export ${modoPrefixo}restructuring reports: ${erroMensagem}`
  }
});