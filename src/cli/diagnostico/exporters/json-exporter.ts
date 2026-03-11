// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: exporter que processa dados para JSON - loops são esperados
// SPDX-FileCopyrightText: 2025 Prometheus Contributors

/**
 * @module cli/diagnostico/exporters/json-exporter
 * @description Exportador JSON com suporte a ASCII escape e fragmentação
 * @see docs/REFACTOR-CLI-DIAGNOSTICAR.md - Sprint 2
 */

import fs from 'node:fs';
import path from 'node:path';

import type { JsonExportOptions, Ocorrencia, RelatorioJson } from '@';

// Re-export para compatibilidade
export type { JsonExportOptions, RelatorioJson };

  /* -------------------------- Função Principal -------------------------- */

/**
 * Gera relatório JSON a partir dos dados do diagnóstico
 *
 * @param dados - Dados do diagnóstico
 * @param options - Opções de exportação
 * @returns String JSON formatada
 */
export function gerarRelatorioJson(dados: Partial<RelatorioJson>, options: Partial<JsonExportOptions> = {}): string {
  // Normalizar options
  const opts: JsonExportOptions = {
    escapeAscii: options.escapeAscii ?? true,
    includeDetails: options.includeDetails ?? true,
    includeContext: options.includeContext ?? false,
    compact: options.compact ?? false,
    maxOcorrencias: options.maxOcorrencias
  };

  // Lista configurável de tipos a omitir
  const omitTypes = Array.isArray(options.omitTypes) ? options.omitTypes : [];

  // Processar ocorrências
  let ocorrencias = dados.ocorrencias || [];
  if (opts.maxOcorrencias && ocorrencias.length > opts.maxOcorrencias) {
    ocorrencias = ocorrencias.slice(0, opts.maxOcorrencias);
  }

  // Filtrar/normalizar ocorrências para relatório resumido
  const IGNORE_TIPOS_WHEN_NO_CONTEXT = new Set([
    'interface-inline-exportada',
    'tipo-literal-inline-complexo'
  ]);

  const processedOcorrencias = (opts.includeDetails ? ocorrencias : []).filter((o: Record<string, unknown>) => {
    // omitir tipos configurados explicitamente
    if (o && o.tipo && omitTypes.includes(String(o.tipo))) return false;
    // se não incluir contexto, removemos certos tipos ruidosos
    if (!opts.includeContext && o.tipo && IGNORE_TIPOS_WHEN_NO_CONTEXT.has(String(o.tipo))) {
      return false;
    }
    return true;
  }).map((o: Record<string, unknown>) => {
    // Montar forma reduzida de ocorrência adequada para relatório
    const arquivo = o.relPath || o.arquivo || '';
    const nivel = (o.nivel === 'erro' || o.nivel === 'aviso' || o.nivel === 'info') ? o.nivel : 'info';
    const mapped: Record<string, unknown> = {
      arquivo: String(arquivo),
      nivel,
      tipo: String(o.tipo || 'outros'),
      mensagem: String(o.mensagem || ''),
    };
    if (opts.includeContext) {
      if (o.linha !== undefined) mapped.linha = Number(o.linha);
      if (o.coluna !== undefined) mapped.coluna = Number(o.coluna);
      if (o.contexto) mapped.contexto = o.contexto;
    }
    return mapped as unknown as Ocorrencia;
  });

  // Construir relatório
  // Read package.json once to avoid multiple blocking operations
  let pkgInfo: { version?: string; name?: string } = {};
  try {
    pkgInfo = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
  } catch {
    // ignore - use defaults
  }

  const relatorio: RelatorioJson = {
    metadata: dados.metadata || {
      timestamp: new Date().toISOString(),
      schemaVersion: '1.0.0',
      modo: 'full',
      flags: [],
      prometheusVersion: pkgInfo.version || 'unknown',
      projectNome: pkgInfo.name || 'unknown'
    },
    stats: dados.stats || {
      arquivosAnalisados: 0,
      arquivosComProblemas: 0,
      totalOcorrencias: 0,
      porNivel: {
        erro: 0,
        aviso: 0,
        info: 0
      },
      porCategoria: {}
    },
    ocorrencias: processedOcorrencias as RelatorioJson['ocorrencias'],
    ...(dados.guardian && {
      guardian: dados.guardian
    }),
    ...(dados.arquetipos && {
      arquetipos: dados.arquetipos
    }),
    ...(dados.autoFix && {
      autoFix: dados.autoFix
    }),
    ...(dados.linguagens && {
      linguagens: dados.linguagens
    }),
    ...(dados.sugestoes && {
      sugestoes: dados.sugestoes
    })
  };

  // Não adicionar propriedades extras ao schema do relatório (manter compatibilidade com `RelatorioJson`)

  // Serializar para JSON
  const indent = opts.compact ? 0 : 2;
  let json = JSON.stringify(relatorio, null, indent);

  // Aplicar escape ASCII se solicitado
  if (opts.escapeAscii) {
    json = escapeNonAscii(json);
  }
  return json;
}

  /* -------------------------- Helpers de Escape -------------------------- */

/**
 * Escapa caracteres não-ASCII como \uXXXX
 * Trata pares substitutos para emojis e caracteres fora do BMP
 */
function escapeNonAscii(str: string): string {
  let resultado = '';
  let i = 0;
  while (i < str.length) {
    const code = str.charCodeAt(i);

    // ASCII básico (0-127) - manter como está
    if (code < 128) {
      resultado += str[i];
      i++;
      continue;
    }

    // High surrogate (início de par substituto)
    if (code >= 0xd800 && code <= 0xdbff) {
      // Verificar se há low surrogate seguinte
      if (i + 1 < str.length) {
        const nextCodigo = str.charCodeAt(i + 1);
        if (nextCodigo >= 0xdc00 && nextCodigo <= 0xdfff) {
          // Par substituto válido - escapar ambos
          resultado += `\\u${code.toString(16).padStart(4, '0')}`;
          resultado += `\\u${nextCodigo.toString(16).padStart(4, '0')}`;
          i += 2;
          continue;
        }
      }
    }

    // Caractere BMP não-ASCII ou surrogate isolado
    resultado += `\\u${code.toString(16).padStart(4, '0')}`;
    i++;
  }
  return resultado;
}

/**
 * Valida se uma string JSON está bem formada
 */
export function validarJson(json: string): {
  valido: boolean;
  erro?: string;
} {
  try {
    JSON.parse(json);
    return {
      valido: true
    };
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    return {
      valido: false,
      erro: mensagem
    };
  }
}

  /* -------------------------- Helpers de Construção -------------------------- */

/**
 * Cria objeto de metadata para o relatório
 */
export function criarMetadata(modo: RelatorioJson['metadata']['modo'], flags: string[], filtros?: RelatorioJson['metadata']['filtros']): RelatorioJson['metadata'] {
  return {
    timestamp: new Date().toISOString(),
    schemaVersion: '1.0.0',
    modo,
    flags,
    ...(filtros && {
      filtros
    })
  };
}

/**
 * Cria objeto de stats a partir de ocorrências
 */
export function criarStats(ocorrencias: Ocorrencia[]): RelatorioJson['stats'] {
  const porNivel = {
    erro: 0,
    aviso: 0,
    info: 0
  };
  const porCategoria: Record<string, number> = {};
  const porRegra: Record<string, number> = {};
  const arquivosSet = new Set<string>();
  for (const ocorrencia of ocorrencias) {
    // Contar por nível (type-safe)
    const nivel = ocorrencia.nivel || 'info';
    if (nivel === 'erro' || nivel === 'aviso' || nivel === 'info') {
      porNivel[nivel] = porNivel[nivel] + 1;
    }

    // Contar por categoria/tipo
    const tipo = ocorrencia.tipo || 'outros';
    porCategoria[tipo] = (porCategoria[tipo] || 0) + 1;
    porRegra[tipo] = (porRegra[tipo] || 0) + 1;

    // Rastrear arquivos únicos
    if (ocorrencia.relPath) {
      arquivosSet.add(ocorrencia.relPath);
    }
  }
  const arquivosComProblemas = arquivosSet.size;
  return {
    arquivosAnalisados: arquivosSet.size,
    arquivosComProblemas,
    totalOcorrencias: ocorrencias.length,
    porNivel,
    porCategoria,
    byRule: porRegra
  };
}

/**
 * Cria objeto de linguagens a partir de extensões
 */
export function criarLinguagens(extensoes: Record<string, number>): RelatorioJson['linguagens'] {
  const total = Object.values(extensoes).reduce((sum, count) => sum + count, 0);
  return {
    total,
    extensoes
  };
}
