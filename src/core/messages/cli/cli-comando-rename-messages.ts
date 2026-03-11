// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoRenameMensagens = createI18nMessages({
  descricao: 'Aplica as renomeações de variáveis baseadas no arquivo(s) de mapeamento em names/.',
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando rename: ${erro}`,
    nenhumMapeamento: 'Nenhum arquivo de mapeamento em names/. Execute o comando names primeiro.',
    pastaNaoEncontrada: 'Pasta de mapeamento não encontrada: names/. Execute o comando names primeiro.',
    mapeamentoVazio: 'Nenhum mapeamento de tradução encontrado (formato: nomeAntigo = nomeNovo por linha).'
  },
  status: {
    inicio: (total: number) => `Iniciando renomeação de variáveis (${total} mapeamentos)...`,
    atualizado: (rel: string) => `Atualizado: ${rel}`,
    concluido: (total: number) => `Renomeação concluída! ${total} arquivos atualizados.`,
    conflito: (old: string, rel: string, nova: string, anterior: string) =>
      `Conflito de mapeamento para "${old}": ${rel} usa "${nova}", anterior era "${anterior}" (last wins).`
  }
}, {
  descricao: 'Applies variable renamings based on mapping file(s) in names/.',
  erros: {
    falhaFlags: (erro: string) => `Failed to apply flags to rename command: ${erro}`,
    nenhumMapeamento: 'No mapping file in names/. Run the names command first.',
    pastaNaoEncontrada: 'Mapping folder not found: names/. Run the names command first.',
    mapeamentoVazio: 'No translation mapping found (format: oldName = newName per line).'
  },
  status: {
    inicio: (total: number) => `Starting variable renaming (${total} mappings)...`,
    atualizado: (rel: string) => `Updated: ${rel}`,
    concluido: (total: number) => `Renaming completed! ${total} files updated.`,
    conflito: (old: string, rel: string, nova: string, anterior: string) =>
      `Mapping conflict for "${old}": ${rel} uses "${nova}", previous was "${anterior}" (last wins).`
  }
});
