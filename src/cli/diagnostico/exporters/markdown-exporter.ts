// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: exporter que processa dados para markdown - loops são esperados
// SPDX-FileCopyrightText: 2025 Prometheus Contributors

/**
 * @module cli/diagnostico/exporters/markdown-exporter
 * @description Exportador Markdown com formatação rica e tabelas
 * @see docs/REFACTOR-CLI-DIAGNOSTICAR.md - Sprint 2
 */

import type {
  DadosRelatorioMarkdown,
  MarkdownExportOptions,
  Ocorrencia,
} from '@';

import type { ArquetipoResult } from '@cli/diagnostico/handlers/arquetipo-handler.js';
import type { AutoFixResult } from '@cli/diagnostico/handlers/auto-fix-handler.js';
import type { GuardianResult } from '@cli/diagnostico/handlers/guardian-handler.js';

// Re-export para compatibilidade
export type { DadosRelatorioMarkdown, MarkdownExportOptions };

  /* -------------------------- Função Principal -------------------------- */

/**
 * Gera relatório Markdown formatado
 */
export function gerarRelatorioMarkdown(
  dados: DadosRelatorioMarkdown,
  options: Partial<MarkdownExportOptions> = {},
): string {
  const opts: MarkdownExportOptions = {
    includeToc: options.includeToc ?? true,
    includeStats: options.includeStats ?? true,
    includeGuardian: options.includeGuardian ?? true,
    includeArquetipos: options.includeArquetipos ?? true,
    includeAutoFix: options.includeAutoFix ?? true,
    includeOcorrencias: options.includeOcorrencias ?? true,
    agruparPorArquivo: options.agruparPorArquivo ?? false,
    maxOcorrencias: options.maxOcorrencias,
    titulo: options.titulo ?? 'Relatório de Diagnóstico',
    subtitulo: options.subtitulo,
  };

  const secoes: string[] = [];

  // Cabeçalho
  secoes.push(
    gerarCabecalho(
      opts.titulo ?? 'Relatório de Diagnóstico',
      opts.subtitulo,
      dados.metadata,
    ),
  );

  // Índice
  if (opts.includeToc) {
    secoes.push(gerarIndice(opts, dados));
  }

  // Estatísticas
  if (opts.includeStats && dados.stats) {
    secoes.push(gerarSecaoStats(dados.stats, dados.linguagens));
  }

  // Guardian
  if (opts.includeGuardian && dados.guardian?.executado) {
    secoes.push(gerarSecaoGuardian(dados.guardian));
  }

  // Arquetipos
  if (opts.includeArquetipos && dados.arquetipos?.executado) {
    secoes.push(gerarSecaoArquetipos(dados.arquetipos));
  }

  // Auto-fix
  if (opts.includeAutoFix && dados.autoFix?.executado) {
    secoes.push(gerarSecaoAutoFix(dados.autoFix));
  }

  // Ocorrências
  if (
    opts.includeOcorrencias &&
    dados.ocorrencias &&
    dados.ocorrencias.length > 0
  ) {
    secoes.push(gerarSecaoOcorrencias(dados.ocorrencias, opts));
  }

  // Sugestões
  if (dados.sugestoes && dados.sugestoes.length > 0) {
    secoes.push(gerarSecaoSugestoes(dados.sugestoes));
  }

  // Rodapé
  secoes.push(gerarRodape());

  return secoes.join('\n\n---\n\n');
}

  /* -------------------------- Seções do Relatório -------------------------- */

function gerarCabecalho(
  titulo: string,
  subtitulo?: string,
  metadata?: DadosRelatorioMarkdown['metadata'],
): string {
  let md = `# ${titulo}\n\n`;

  if (subtitulo) {
    md += `> ${subtitulo}\n\n`;
  }

  if (metadata) {
    md += `**Data**: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}\n`;
    md += `**Modo**: ${metadata.modo}\n`;
    if (metadata.flags.length > 0) {
      md += `**Flags**: \`${metadata.flags.join('`, `')}\`\n`;
    }
  }

  return md;
}

function gerarIndice(
  opts: MarkdownExportOptions,
  dados: DadosRelatorioMarkdown,
): string {
  const itens: string[] = [];

  if (opts.includeStats && dados.stats) {
    itens.push('- [📊 Estatísticas](#-estatísticas)');
  }
  if (opts.includeGuardian && dados.guardian?.executado) {
    itens.push('- [🛡️ Guardian](#️-guardian)');
  }
  if (opts.includeArquetipos && dados.arquetipos?.executado) {
    itens.push('- [🏗️ Arquetipos](#️-arquetipos)');
  }
  if (opts.includeAutoFix && dados.autoFix?.executado) {
    itens.push('- [🔧 Auto-fix](#-auto-fix)');
  }
  if (
    opts.includeOcorrencias &&
    dados.ocorrencias &&
    dados.ocorrencias.length > 0
  ) {
    itens.push('- [Ocorrencias](#-ocorrencias)');
  }
  if (dados.sugestoes && dados.sugestoes.length > 0) {
    itens.push('- [Sugestoes](#-sugestoes)');
  }

  return `## Indice\n\n${itens.join('\n')}`;
}

function gerarSecaoStats(
  stats: NonNullable<DadosRelatorioMarkdown['stats']>,
  linguagens?: DadosRelatorioMarkdown['linguagens'],
): string {
  let md = '## Estatisticas\n\n';

  // Tabela principal
  md += '| Métrica | Valor |\n';
  md += '|---------|-------|\n';
  md += `| Arquivos analisados | ${stats.arquivosAnalisados} |\n`;
  md += `| Arquivos com problemas | ${stats.arquivosComProblemas} |\n`;
  md += `| Total de ocorrências | ${stats.totalOcorrencias} |\n`;

  if (stats.tempoExecucao) {
    const tempoSeg = (stats.tempoExecucao / 1000).toFixed(2);
    md += `| Tempo de execução | ${tempoSeg}s |\n`;
  }

  // Breakdown por nível
  md += '\n### Por Nível\n\n';
  md += '| Nível | Quantidade |\n';
  md += '|-------|------------|\n';
  md += `| ❌ Erro | ${stats.porNivel.erro} |\n`;
  md += `| ⚠️ Aviso | ${stats.porNivel.aviso} |\n`;
  md += `| ℹ️ Info | ${stats.porNivel.info} |\n`;

  // Breakdown por categoria
  if (Object.keys(stats.porCategoria).length > 0) {
    md += '\n### Por Categoria\n\n';
    md += '| Categoria | Quantidade |\n';
    md += '|-----------|------------|\n';

    const categorias = Object.entries(stats.porCategoria)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10

    for (const [categoria, count] of categorias) {
      md += `| ${categoria} | ${count} |\n`;
    }
  }

  // Linguagens
  if (linguagens && Object.keys(linguagens.extensoes).length > 0) {
    md += '\n### Linguagens Detectadas\n\n';
    md += '| Extensão | Arquivos |\n';
    md += '|----------|----------|\n';

    const extensoes = Object.entries(linguagens.extensoes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10

    for (const [ext, count] of extensoes) {
      md += `| .${ext} | ${count} |\n`;
    }
  }

  return md;
}

function gerarSecaoGuardian(guardian: GuardianResult): string {
  let md = '## 🛡️ Guardian\n\n';

  md += `**Status**: ${guardian.status ?? 'desconhecido'}\n`;
  md += `**Problemas**: ${guardian.temProblemas ? '❌ Detectados' : '✅ Nenhum'}\n\n`;

  if (guardian.resultado?.detalhes && guardian.resultado.detalhes.length > 0) {
    md += `### Detalhes\n\n`;
    for (const detalhe of guardian.resultado.detalhes) {
      md += `- ${detalhe}\n`;
    }
    md += '\n';
  }

  if (guardian.drift && guardian.drift > 0) {
    md += `### Drift Detectado\n\n`;
    md += `- Mudanças: ${guardian.drift}\n`;
  }

  return md;
}

function gerarSecaoArquetipos(arquetipos: ArquetipoResult): string {
  let md = '## 🏗️ Arquetipos\n\n';

  if (arquetipos.principal) {
    md += `**Arquétipo Principal**: ${arquetipos.principal.tipo}\n`;
    md += `**Confiança**: ${(arquetipos.principal.confianca * 100).toFixed(1)}%\n\n`;
  }

  if (arquetipos.arquetipos && arquetipos.arquetipos.length > 1) {
    md += '### Outros Candidatos\n\n';
    md += '| Arquétipo | Confiança | Características |\n';
    md += '|-----------|-----------|------------------|\n';

    for (const arq of arquetipos.arquetipos.slice(1, 6)) {
      const caracteristicas = arq.caracteristicas?.slice(0, 3).join(', ') ?? '';
      md += `| ${arq.tipo} | ${(arq.confianca * 100).toFixed(1)}% | ${caracteristicas} |\n`;
    }
  }

  if (arquetipos.salvo) {
    md += '\n✅ Arquétipo salvo em `prometheus.repo.arquetipo.json`\n';
  }

  return md;
}

function gerarSecaoAutoFix(autoFix: AutoFixResult): string {
  let md = '## 🔧 Auto-fix\n\n';

  md += `**Modo**: ${autoFix.mode}\n`;
  md += `**Dry-run**: ${autoFix.dryRun ? 'Sim' : 'Não'}\n\n`;

  md += '### Estatísticas\n\n';
  md += '| Métrica | Valor |\n';
  md += '|---------|-------|\n';
  md += `| Arquivos analisados | ${autoFix.stats.arquivosAnalisados} |\n`;
  md += `| Arquivos modificados | ${autoFix.stats.arquivosModificados} |\n`;
  md += `| Correções aplicadas | ${autoFix.stats.correcoesAplicadas} |\n`;
  md += `| Correções sugeridas | ${autoFix.stats.correcoesSugeridas} |\n`;
  md += `| Correções puladas | ${autoFix.stats.correcoesPuladas} |\n`;

  if (
    autoFix.correcoesPorTipo &&
    Object.keys(autoFix.correcoesPorTipo).length > 0
  ) {
    md += '\n### Por Tipo\n\n';
    md += '| Tipo | Quantidade |\n';
    md += '|------|------------|\n';

    for (const [tipo, count] of Object.entries(autoFix.correcoesPorTipo)) {
      md += `| ${tipo} | ${count} |\n`;
    }
  }

  return md;
}

function gerarSecaoOcorrencias(
  ocorrencias: Ocorrencia[],
  opts: MarkdownExportOptions,
): string {
  let md = '## Ocorrencias\n\n';

  // Limitar se necessário
  let lista = ocorrencias;
  if (opts.maxOcorrencias && lista.length > opts.maxOcorrencias) {
    lista = lista.slice(0, opts.maxOcorrencias);
    md += `> Mostrando ${opts.maxOcorrencias} de ${ocorrencias.length} ocorrências\n\n`;
  }

  if (opts.agruparPorArquivo) {
    md += gerarOcorrenciasPorArquivo(lista);
  } else {
    md += gerarTabelaOcorrencias(lista);
  }

  return md;
}

function gerarTabelaOcorrencias(ocorrencias: Ocorrencia[]): string {
  let md = '| Arquivo | Linha | Nível | Tipo | Mensagem |\n';
  md += '|---------|-------|-------|------|----------|\n';

  for (const ocorrencia of ocorrencias) {
    const arquivo = ocorrencia.relPath || 'desconhecido';
    const linha = ocorrencia.linha ?? '-';
    const nivel = getNivelIcon(ocorrencia.nivel || 'info');
    const tipo = ocorrencia.tipo || 'outros';
    const rawMensagem = ocorrencia.mensagem;
    const mensagemEscapada = rawMensagem
      .replace(/\\/g, '\\\\')
      .replace(/\|/g, '\\|');
    const mensagem = mensagemEscapada.slice(0, 80);

    md += `| ${arquivo} | ${linha} | ${nivel} | ${tipo} | ${mensagem} |\n`;
  }

  return md;
}

function gerarOcorrenciasPorArquivo(ocorrencias: Ocorrencia[]): string {
  const porArquivo = new Map<string, Ocorrencia[]>();

  for (const ocorrencia of ocorrencias) {
    const arquivo = ocorrencia.relPath || 'desconhecido';
    if (!porArquivo.has(arquivo)) {
      porArquivo.set(arquivo, []);
    }
    const listaArquivo = porArquivo.get(arquivo);
    if (listaArquivo) {
      listaArquivo.push(ocorrencia);
    }
  }

  let md = '';

  for (const [arquivo, lista] of porArquivo) {
    md += `### 📄 ${arquivo}\n\n`;

    for (const ocorrencia of lista) {
      const nivel = getNivelIcon(ocorrencia.nivel || 'info');
      const linha = ocorrencia.linha ? `:${ocorrencia.linha}` : '';
      md += `- ${nivel} **${ocorrencia.tipo}**${linha}: ${ocorrencia.mensagem}\n`;
    }

    md += '\n';
  }

  return md;
}

function gerarSecaoSugestoes(sugestoes: string[]): string {
  let md = '## 💡 Sugestões\n\n';

  for (const sugestao of sugestoes) {
    md += `- ${sugestao}\n`;
  }

  return md;
}

function gerarRodape(): string {
  return `---\n\n*Gerado por Prometheus v0.2.0 em ${new Date().toLocaleString('pt-BR')}*`;
}

  /* -------------------------- Helpers -------------------------- */

function getNivelIcon(nivel: string): string {
  switch (nivel) {
    case 'erro':
      return '❌';
    case 'aviso':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '•';
  }
}

/**
 * Escapa caracteres especiais do Markdown
 */
export function escaparMarkdown(texto: string): string {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/`/g, '\\`');
}
