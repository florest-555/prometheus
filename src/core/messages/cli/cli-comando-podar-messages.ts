// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoPodarMensagens = createI18nMessages({
  descricao: 'Remove arquivos órfãos e lixo do repositório.',
  opcoes: {
    force: 'Remove arquivos sem confirmação (CUIDADO!)',
    include: 'Glob pattern a INCLUIR (pode repetir a flag ou usar vírgulas / espaços para múltiplos)',
    exclude: 'Glob pattern a EXCLUIR adicionalmente (pode repetir a flag ou usar vírgulas / espaços)'
  },
  inicio: '\n✂️ Starting pruning process...\n',
  nenhumaSujeira: (iconeSucesso: string) => `${iconeSucesso} Nenhuma sujeira detectada. Repositório limpo!`,
  orfaosDetectados: (qtd: number) => `\n${qtd} arquivos órfãos detectados:`,
  linhaArquivoOrfao: (arquivo: string) => `- ${arquivo}`,
  confirmarRemocao: 'Tem certeza que deseja remover esses arquivos? (s/N) ',
  erroDurantePoda: (erroMensagem: string) => `[ERRO] Erro durante a poda: ${erroMensagem}`
}, {
  descricao: 'Removes orphan files and garbage from the repository.',
  opcoes: {
    force: 'Remove files without confirmation (CAUTION!)',
    include: 'Glob pattern to INCLUDE (can repeat the flag or use commas/spaces for multiple)',
    exclude: 'Glob pattern to EXCLUDE additionally (can repeat the flag or use commas/spaces)'
  },
  inicio: '\n✂️ Iniciando processo de poda...\n',
  nenhumaSujeira: (iconeSucesso: string) => `${iconeSucesso} No dirt detected. Repository clean!`,
  orfaosDetectados: (qtd: number) => `\n${qtd} orphan files detected:`,
  linhaArquivoOrfao: (arquivo: string) => `- ${arquivo}`,
  confirmarRemocao: 'Are you sure you want to remove these files? (y/N) ',
  erroDurantePoda: (erroMensagem: string) => `[ERROR] Error during pruning: ${erroMensagem}`
});
