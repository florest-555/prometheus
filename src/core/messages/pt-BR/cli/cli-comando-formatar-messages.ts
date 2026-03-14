// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoFormatarMensagens = createI18nMessages({
  descricao: 'Aplica a formatação interna estilo Prometheus (whitespace, seções, finais de linha)',
  opcoes: {
    check: 'Apenas verifica se arquivos precisariam de formatação (default)',
    write: 'Aplica as mudanças no filesystem',
    engine: 'Motor de formatação: auto|interno|prettier (auto tenta usar Prettier do projeto e cai no interno)',
    include: 'Glob pattern a INCLUIR (pode repetir a flag ou usar vírgulas / espaços para múltiplos)',
    exclude: 'Glob pattern a EXCLUIR adicionalmente (pode repetir a flag ou usar vírgulas / espaços)'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando formatar: ${erro}`,
    falhaFormatar: (erro: string) => `Falha ao formatar: ${erro}`,
    falhaArquivo: (rel: string, erro: string) => `Falha ao formatar ${rel}: ${erro}`,
    falhaExecucaoArquivo: (rel: string, erro: string) => `Falha ao executar formatação para ${rel}: ${erro}`,
    totalErros: (n: number) => `Erros: ${n}`,
    scanOnlyAviso: 'SCAN_ONLY ativo; o comando formatar precisa ler conteúdo.'
  },
  status: {
    titulo: '[CLEAN] FORMATAR',
    precisamFormatacao: (n: number) => `Encontrados ${n} arquivo(s) que precisam de formatação. Use --write para aplicar.`,
    tudoFormatado: 'Tudo formatado.',
    concluidoWrite: (n: number) => `Formatados ${n} arquivo(s).`,
    nenhumaMudanca: 'Nenhuma mudança necessária.'
  }
}, {
  descricao: 'Applies Prometheus internal formatting (whitespace, sections, line endings)',
  opcoes: {
    check: 'Only checks if files would need formatting (default)',
    write: 'Apply changes to the filesystem',
    engine: 'Formatting engine: auto|internal|prettier (auto tries project Prettier and falls back to internal)',
    include: 'Glob pattern to INCLUDE (can repeat the flag or use commas/spaces for multiple)',
    exclude: 'Glob pattern to EXCLUDE additionally (can repeat the flag or use commas/spaces)'
  },
  erros: {
    falhaFlags: (erro: string) => `Failed to apply flags to format command: ${erro}`,
    falhaFormatar: (erro: string) => `Failed to format: ${erro}`,
    falhaArquivo: (rel: string, erro: string) => `Failed to format ${rel}: ${erro}`,
    falhaExecucaoArquivo: (rel: string, erro: string) => `Failed to execute formatting for ${rel}: ${erro}`,
    totalErros: (n: number) => `Errors: ${n}`,
    scanOnlyAviso: 'SCAN_ONLY active; format command needs to read content.'
  },
  status: {
    titulo: '[CLEAN] FORMAT',
    precisamFormatacao: (n: number) => `Found ${n} file(s) that need formatting. Use --write to apply.`,
    tudoFormatado: 'All formatted.',
    concluidoWrite: (n: number) => `Formatted ${n} file(s).`,
    nenhumaMudanca: 'No changes needed.'
  }
});
