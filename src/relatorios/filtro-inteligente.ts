// SPDX-License-Identifier: MIT-0
// @prometheus-disable tipo-literal-inline-complexo
// Justificativa: tipos locais para filtragem de relatórios
// Sistema inteligente de filtragem e priorização de relatórios
// Agrupa problemas similares e prioriza por impacto para evitar sobrecarga de informação

import { config } from '@core/config/config.js';
import {
  AGRUPAMENTOS_MENSAGEM,
  ICONES_FEEDBACK,
  PRIORIDADES,
  RelatorioMensagens
} from '@core/messages/index.js';
import { stripAnsi } from '@shared/helpers/ansi.js';

import type { Ocorrencia, OcorrenciaNivel, ProblemaAgrupado, RankingItem, RelatorioResumo, ResumoExecutivo } from '@';

/**
 * Processa e filtra ocorrências para gerar um relatório resumido inteligente
 */

export function processarRelatorioResumo(ocorrencias: Ocorrencia[], limitePrioridade = 30): RelatorioResumo {
  // Agrupar ocorrências por tipo e padrões de mensagem em uma só passagem
  const gruposPorTipo = new Map<string, Ocorrencia[]>();
  const gruposPorMensagem = new Map<string, Ocorrencia[]>();

  for (const ocorrencia of ocorrencias) {
    const tipo = String(ocorrencia.tipo || 'OUTROS');
    if (!gruposPorTipo.has(tipo)) {
      gruposPorTipo.set(tipo, []);
    }
    const grupoTipo = gruposPorTipo.get(tipo);
    if (grupoTipo) grupoTipo.push(ocorrencia);

    const mensagem = String(ocorrencia.mensagem || '');
    let agrupado = false;
    for (const grupo of AGRUPAMENTOS_MENSAGEM) {
      if (grupo.padrao.test(mensagem)) {
        if (!gruposPorMensagem.has(grupo.categoria)) {
          gruposPorMensagem.set(grupo.categoria, []);
        }
        const grupoMsg = gruposPorMensagem.get(grupo.categoria);
        if (grupoMsg) grupoMsg.push(ocorrencia);
        agrupado = true;
        break;
      }
    }
    if (!agrupado) {
      if (!gruposPorMensagem.has(tipo)) {
        gruposPorMensagem.set(tipo, []);
      }
      const grupoFallback = gruposPorMensagem.get(tipo);
      if (grupoFallback) grupoFallback.push(ocorrencia);
    }
  }

  // Converter grupos em problemas agrupados
  const problemasAgrupados: ProblemaAgrupado[] = [];

  // Processar grupos por tipo
  for (const [tipo, ocorrenciasTipo] of gruposPorTipo) {
    const config = PRIORIDADES[tipo] || {
      prioridade: 'baixa' as const,
      icone: ICONES_FEEDBACK.atencao
    };

    // Verificar se já existe agrupamento por mensagem
    const jaAgrupado = Array.from(gruposPorMensagem.keys()).some(categoria => {
      const ocorrenciasGrupo = gruposPorMensagem.get(categoria) || [];
      return ocorrenciasGrupo.some(o => o.tipo === tipo);
    });
    if (!jaAgrupado && ocorrenciasTipo.length > 0) {
      problemasAgrupados.push({
        categoria: tipo,
        prioridade: config.prioridade,
        icone: config.icone,
        titulo: formatarTituloTipo(tipo),
        quantidade: ocorrenciasTipo.length,
        ocorrencias: ocorrenciasTipo,
        resumo: gerarResumoOcorrencias(ocorrenciasTipo)
      });
    }
  }

  // Processar grupos por mensagem (prioritários)
  for (const agrupamento of AGRUPAMENTOS_MENSAGEM) {
    const ocorrenciasGrupo = gruposPorMensagem.get(agrupamento.categoria) || [];
    if (ocorrenciasGrupo.length > 0) {
      problemasAgrupados.push({
        categoria: agrupamento.categoria,
        prioridade: 'critica',
        // Grupos de mensagem são sempre prioritários
        icone: ICONES_FEEDBACK.atencao,
        titulo: agrupamento.titulo,
        quantidade: ocorrenciasGrupo.length,
        ocorrencias: ocorrenciasGrupo,
        resumo: RelatorioMensagens.resumo.labels.ocorrenciasDetectadas(ocorrenciasGrupo.length),
        acaoSugerida: agrupamento.acaoSugerida
      });
    }
  }

  // Ordenar por prioridade e quantidade
  problemasAgrupados.sort((a, b) => {
    const prioridadeOrdem = {
      critica: 0,
      alta: 1,
      media: 2,
      baixa: 3
    };
    const prioA = prioridadeOrdem[a.prioridade];
    const prioB = prioridadeOrdem[b.prioridade];
    if (prioA !== prioB) return prioA - prioB;
    return b.quantidade - a.quantidade; // Mais ocorrências primeiro
  });

  // Separar por níveis de prioridade
  const problemasCriticos = problemasAgrupados.filter(p => p.prioridade === 'critica');
  const problemasAltos = problemasAgrupados.filter(p => p.prioridade === 'alta');
  const problemasOutros = problemasAgrupados.filter(p => ['media', 'baixa'].includes(p.prioridade));

  // Calcular estatísticas
  const arquivosAfetados = new Set(ocorrencias.map(o => o.relPath).filter(path => path && path !== 'undefined')).size;
  const problemasPrioritarios = problemasCriticos.length + problemasAltos.length;
  const relatorioBase: RelatorioResumo = {
    problemasCriticos: problemasCriticos.slice(0, limitePrioridade / 3),
    problemasAltos: problemasAltos.slice(0, limitePrioridade / 3),
    problemasOutros: problemasOutros.slice(0, limitePrioridade / 3),
    estatisticas: {
      totalOcorrencias: ocorrencias.length,
      arquivosAfetados,
      problemasPrioritarios,
      problemasAgrupados: problemasAgrupados.length
    }
  };

  // Rankings úteis
  const topArquivos = gerarRanking(
    ocorrencias.map(o => o.relPath || RelatorioMensagens.resumo.labels.arquivoDesconhecido),
    8
  );
  const topTipos = gerarRanking(
    ocorrencias.map(o => String(o.tipo || 'OUTROS')),
    8
  );

  // Resumo executivo
  const resumoExecutivo = gerarResumoExecutivo(ocorrencias, relatorioBase);

  return {
    ...relatorioBase,
    topArquivos,
    topTipos,
    resumoExecutivo
  };
}

/**
 * Formata o título do tipo de problema para exibição
 */

function formatarTituloTipo(tipo: string): string {
  const titulos: Record<string, string> = {
    PROBLEMA_SEGURANCA: 'Problemas de Segurança',
    VULNERABILIDADE_SEGURANCA: 'Vulnerabilidades de Segurança',
    CODIGO_FRAGIL: 'Código Frágil',
    PROBLEMA_TESTE: 'Problemas de Teste',
    PROBLEMA_DOCUMENTACAO: 'Problemas de Documentação',
    CONSTRUCOES_SINTATICAS: 'Construções Sintáticas',
    ANALISE_ARQUITETURA: 'Análise de Arquitetura',
    CARACTERISTICAS_ARQUITETURA: 'Características de Arquitetura',
    METRICAS_ARQUITETURA: 'Métricas de Arquitetura',
    TODO_PENDENTE: 'TODOs Pendentes',
    'padrao-ausente': 'Padrões Ausentes',
    'estrutura-suspeita': 'Estrutura Suspeita',
    'estrutura-config': 'Configuração de Estrutura',
    'estrutura-entrypoints': 'Pontos de Entrada',
    IDENTIFICACAO_PROJETO: 'Identificação do Projeto',
    SUGESTAO_MELHORIA: 'Sugestões de Melhoria',
    EVIDENCIA_CONTEXTO: 'Evidências de Contexto',
    TECNOLOGIAS_ALTERNATIVAS: 'Tecnologias Alternativas'
  };
  return titulos[tipo] || tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Gera um resumo das ocorrências para exibição
 */

function gerarResumoOcorrencias(ocorrencias: Ocorrencia[]): string {
  if (ocorrencias.length === 0) return RelatorioMensagens.comum.vazios.nenhumaOcorrencia;
  const arquivos = new Set(ocorrencias.map(o => o.relPath).filter(Boolean));
  const niveisFrequentes = ocorrencias.map(o => o.nivel).filter((nivel): nivel is OcorrenciaNivel => Boolean(nivel)).reduce((acc, nivel) => {
    acc[nivel] = (acc[nivel] || 0) + 1;
    return acc;
  }, {} as Record<OcorrenciaNivel, number>);
  const nivelMaisFrequente = Object.entries(niveisFrequentes).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0];
  let resumo = RelatorioMensagens.resumo.textos.ocorrencias(ocorrencias.length);
  if (arquivos.size > 1) {
    resumo += ` ${RelatorioMensagens.resumo.textos.emArquivos(arquivos.size)}`;
  }
  if (nivelMaisFrequente) {
    resumo += ` ${RelatorioMensagens.resumo.textos.maioria(nivelMaisFrequente)}`;
  }
  return resumo;
}

/**
 * Gera relatório Markdown resumido
 */

export async function gerarRelatorioMarkdownResumo(relatorioResumo: RelatorioResumo, outputCaminho: string): Promise<void> {
  const {
    problemasCriticos,
    problemasAltos,
    problemasOutros,
    estatisticas,
    topArquivos,
    topTipos,
    resumoExecutivo
  } = relatorioResumo;
  const linhas: string[] = [];

  // Cabeçalho usando mensagens centralizadas
  linhas.push(`# ${RelatorioMensagens.resumo.titulo}`);
  linhas.push('');
  linhas.push(`> ${RelatorioMensagens.resumo.introducao}`);
  linhas.push('');

  // Estatisticas usando mensagens centralizadas
  linhas.push(`## ${RelatorioMensagens.resumo.secoes.estatisticas.titulo}`);
  linhas.push('');
  linhas.push(`- **${RelatorioMensagens.resumo.secoes.estatisticas.totalOcorrencias}**: ${estatisticas.totalOcorrencias.toLocaleString()}`);
  linhas.push(`- **${RelatorioMensagens.resumo.secoes.estatisticas.arquivosAfetados}**: ${estatisticas.arquivosAfetados.toLocaleString()}`);
  linhas.push(`- **${RelatorioMensagens.resumo.secoes.estatisticas.problemasPrioritarios}**: ${estatisticas.problemasPrioritarios}`);
  linhas.push(`- **${RelatorioMensagens.resumo.secoes.estatisticas.problemasAgrupados}**: ${estatisticas.problemasAgrupados}`);
  linhas.push('');

  if (resumoExecutivo) {
    linhas.push(`## ${RelatorioMensagens.resumo.secoes.executivo.titulo}`);
    linhas.push('');
    const recomendacaoLabel = RelatorioMensagens.resumo.secoes.executivo.recomendacaoLabels[resumoExecutivo.recomendacao];
    linhas.push(`- **${RelatorioMensagens.resumo.secoes.executivo.recomendacao}**: ${recomendacaoLabel}`);
    linhas.push(`- **${RelatorioMensagens.resumo.secoes.executivo.criticos}**: ${resumoExecutivo.problemasCriticos}`);
    linhas.push(`- **${RelatorioMensagens.resumo.secoes.executivo.altos}**: ${resumoExecutivo.problemasAltos}`);
    linhas.push(`- **${RelatorioMensagens.resumo.secoes.executivo.vulnerabilidades}**: ${resumoExecutivo.vulnerabilidades}`);
    linhas.push(`- **${RelatorioMensagens.resumo.secoes.executivo.quickFixes}**: ${resumoExecutivo.quickFixes}`);
    linhas.push('');
    linhas.push(resumoExecutivo.mensagem);
    linhas.push('');
  }

  // Problemas críticos usando mensagens centralizadas
  if (problemasCriticos.length > 0) {
    linhas.push(`## ${RelatorioMensagens.resumo.secoes.criticos.titulo}`);
    linhas.push('');
    for (const problema of problemasCriticos) {
      linhas.push(`### ${problema.icone} ${problema.titulo}`);
      linhas.push('');
      linhas.push(`**${RelatorioMensagens.resumo.labels.quantidade}**: ${problema.quantidade}`);
      linhas.push(`**${RelatorioMensagens.resumo.labels.resumo}**: ${problema.resumo}`);
      if (problema.acaoSugerida) {
        linhas.push(`**${RelatorioMensagens.resumo.labels.acaoSugerida}**: ${problema.acaoSugerida}`);
      }
      linhas.push('');

      // Mostrar algumas ocorrências de exemplo
      const exemplos = problema.ocorrencias.slice(0, 3);
      if (exemplos.length > 0) {
        linhas.push(`**${RelatorioMensagens.resumo.labels.exemplos}:**`);
        for (const exemplo of exemplos) {
        const arquivo = exemplo.relPath || RelatorioMensagens.resumo.labels.arquivoDesconhecido;
        const linha = exemplo.linha ? `:${exemplo.linha}` : '';
        linhas.push(`- \`${arquivo}${linha}\`: ${exemplo.mensagem}`);
      }
      if (problema.quantidade > 3) {
        linhas.push(`- ${RelatorioMensagens.resumo.labels.maisOcorrencias(problema.quantidade - 3)}`);
      }
      linhas.push('');
    }
    }
  }

  // Problemas altos usando mensagens centralizadas
  if (problemasAltos.length > 0) {
    linhas.push(`## ${RelatorioMensagens.resumo.secoes.altos.titulo}`);
    linhas.push('');
    for (const problema of problemasAltos) {
      linhas.push(`### ${problema.icone} ${problema.titulo}`);
      linhas.push('');
      linhas.push(`**${RelatorioMensagens.resumo.labels.quantidade}**: ${problema.quantidade} | **${RelatorioMensagens.resumo.labels.resumo}**: ${problema.resumo}`);
      if (problema.acaoSugerida) {
        linhas.push(`**${RelatorioMensagens.resumo.labels.acaoSugerida}**: ${problema.acaoSugerida}`);
      }
      linhas.push('');
    }
  }

  // Outros problemas (resumo) usando mensagens centralizadas
  if (problemasOutros.length > 0) {
    linhas.push(`## ${RelatorioMensagens.resumo.secoes.outros.titulo}`);
    linhas.push('');
    linhas.push('| Categoria | Quantidade | Resumo |');
    linhas.push('|-----------|------------|--------|');
    for (const problema of problemasOutros) {
      linhas.push(`| ${problema.icone} ${problema.titulo} | ${problema.quantidade} | ${problema.resumo} |`);
    }
    linhas.push('');
  }

  if (topArquivos && topArquivos.length > 0) {
    linhas.push(`## ${RelatorioMensagens.resumo.secoes.topArquivos.titulo}`);
    linhas.push('');
    linhas.push(`| ${RelatorioMensagens.resumo.secoes.topArquivos.arquivo} | ${RelatorioMensagens.resumo.secoes.topArquivos.ocorrencias} |`);
    linhas.push('|---|---:|');
    for (const item of topArquivos) {
      linhas.push(`| ${item.label} | ${item.quantidade} |`);
    }
    linhas.push('');
  }

  if (topTipos && topTipos.length > 0) {
    linhas.push(`## ${RelatorioMensagens.resumo.secoes.topTipos.titulo}`);
    linhas.push('');
    linhas.push(`| ${RelatorioMensagens.resumo.secoes.topTipos.tipo} | ${RelatorioMensagens.resumo.secoes.topTipos.ocorrencias} |`);
    linhas.push('|---|---:|');
    for (const item of topTipos) {
      linhas.push(`| ${item.label} | ${item.quantidade} |`);
    }
    linhas.push('');
  }

  linhas.push(`## ${RelatorioMensagens.resumo.secoes.proximosPassos.titulo}`);
  linhas.push('');
  for (const item of RelatorioMensagens.resumo.secoes.proximosPassos.itens) {
    linhas.push(`- ${item}`);
  }
  linhas.push('');

  // Rodapé
  linhas.push('---');
  linhas.push('');
  linhas.push(`${RelatorioMensagens.resumo.rodape.dica}`);
  linhas.push('');
  const locale = config.LANGUAGE === 'en' ? 'en-US' : 'pt-BR';
  linhas.push(`**${RelatorioMensagens.resumo.rodape.geradoEm}**: ${new Date().toLocaleString(locale)}`);
  const {
    salvarEstado
  } = await import('@shared/persistence/persistencia.js');
  const conteudo = linhas.map(stripAnsi).join('\n');
  await salvarEstado(outputCaminho, conteudo);
}

/**
 * Gera resumo executivo mostrando apenas problemas críticos e de alta prioridade
 * Ideal para tomada de decisão e overview rápido
 */

export function gerarResumoExecutivo(
  ocorrencias: Ocorrencia[],
  relatorioBase?: Pick<RelatorioResumo, 'problemasCriticos' | 'problemasAltos'>,
): ResumoExecutivo {
  const relatorio = relatorioBase ?? processarRelatorioResumo(ocorrencias);
  const problemasCriticos = relatorio.problemasCriticos.reduce((sum: number, p: ProblemaAgrupado) => sum + p.quantidade, 0);
  const problemasAltos = relatorio.problemasAltos.reduce((sum: number, p: ProblemaAgrupado) => sum + p.quantidade, 0);

  // Contadores específicos
  const vulnerabilidades = ocorrencias.filter(o => o.tipo === 'VULNERABILIDADE_SEGURANCA' || o.tipo === 'PROBLEMA_SEGURANCA').length;
  const quickFixes = ocorrencias.filter(o => o.tipo === 'QUICK_FIX_DISPONIVEL').length;

  // Determina recomendação baseada em prioridade
  let recomendacao: 'verde' | 'amarelo' | 'vermelho';
  let mensagem: string;
  if (problemasCriticos > 10) {
    recomendacao = 'vermelho';
    mensagem = RelatorioMensagens.resumo.secoes.executivo.mensagens.critico(problemasCriticos);
  } else if (problemasCriticos > 0 || problemasAltos > 50) {
    recomendacao = 'amarelo';
    mensagem = RelatorioMensagens.resumo.secoes.executivo.mensagens.atencao(problemasCriticos, problemasAltos);
  } else {
    recomendacao = 'verde';
    mensagem = RelatorioMensagens.resumo.secoes.executivo.mensagens.bom(quickFixes);
  }
  return {
    problemasCriticos,
    problemasAltos,
    vulnerabilidades,
    quickFixes,
    recomendacao,
    mensagem,
    detalhes: [...relatorio.problemasCriticos, ...relatorio.problemasAltos]
  };
}

function gerarRanking(valores: string[], limite: number): RankingItem[] {
  const contagem = new Map<string, number>();
  for (const valor of valores) {
    const key = String(valor || 'desconhecido');
    contagem.set(key, (contagem.get(key) || 0) + 1);
  }
  return Array.from(contagem.entries())
    .map(([label, quantidade]) => ({ label, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, limite);
}
