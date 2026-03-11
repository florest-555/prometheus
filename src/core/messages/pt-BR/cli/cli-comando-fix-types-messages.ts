// SPDX-License-Identifier: MIT-0

import {
  ACOES_SUGERIDAS,
  CATEGORIAS_TIPOS,
  DEPURACAO,
  DICAS,
  formatarTipoInseguro,
  gerarResumoCategoria,
  ICONES_FIX_TYPES as ICONES,
  MENSAGENS_CLI_CORRECAO_TIPOS,
  MENSAGENS_ERRO_FIX_TYPES as MENSAGENS_ERRO,
  MENSAGENS_INICIO_FIX_TYPES as MENSAGENS_INICIO,
  MENSAGENS_PROGRESSO_FIX_TYPES as MENSAGENS_PROGRESSO,
  MENSAGENS_RESUMO,
  MENSAGENS_SUCESSO_FIX_TYPES as MENSAGENS_SUCESSO,
  TEMPLATE_RESUMO_FINAL,
  TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS
} from '../core/index.js';
import { CliCommonMensagens } from './cli-common-messages.js';

export const CliComandoFixTypesMensagens = {
  descricao: 'Detecta e corrige tipos inseguros (any/unknown) no código',
  opcoes: {
    dryRun: CliCommonMensagens.opcoes.dryRun,
    target: 'Diretório ou arquivo específico para analisar (default: src)',
    confidence: 'Nível mínimo de confiança para aplicar correções (0-100) (default: 85)',
    verbose: CliCommonMensagens.opcoes.verbose,
    interactive: 'Modo interativo: confirma cada correção',
    export: 'Exporta relatórios JSON e Markdown para pasta relatorios/',
    include: CliCommonMensagens.opcoes.include,
    exclude: CliCommonMensagens.opcoes.exclude
  },
  // Exporting core messages through this object for convenience and consistency in CLI commands
  MENSAGENS_INICIO,
  MENSAGENS_PROGRESSO,
  MENSAGENS_RESUMO,
  MENSAGENS_ERRO,
  MENSAGENS_SUCESSO,
  MENSAGENS_CLI_CORRECAO_TIPOS,
  TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS,
  TEMPLATE_RESUMO_FINAL,
  DICAS,
  CATEGORIAS_TIPOS,
  ACOES_SUGERIDAS,
  DEPURACAO,
  ICONES,
  formatarTipoInseguro,
  gerarResumoCategoria
} as const;
