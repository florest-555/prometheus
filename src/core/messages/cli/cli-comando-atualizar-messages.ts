// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoAtualizarMensagens = createI18nMessages({
  descricao: 'Atualiza o Prometheus se a integridade estiver preservada',
  opcoes: {
    global: 'atualiza globalmente via npm i -g'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando atualizar: ${erro}`
  },
  status: {
    inicio: '\n[ATUALIZANDO] Iniciando processo de atualizacao...\n',
    guardianOk: (iconeSucesso: string) => `${iconeSucesso} Guardian: integridade validada. Prosseguindo atualizacao.`,
    guardianAviso: '[AVISO] Guardian gerou novo baseline ou detectou alteracoes. Prosseguindo com cautela.',
    guardianDica: 'Recomendado: `prometheus guardian --diff` e `prometheus guardian --accept-baseline` antes de atualizar.'
  }
}, {
  descricao: 'Updates Prometheus if integrity is preserved',
  opcoes: {
    global: 'updates globally via npm i -g'
  },
  erros: {
    falhaFlags: (erro: string) => `Failed to apply flags to update command: ${erro}`
  },
  status: {
    inicio: '\n[UPDATING] Starting update process...\n',
    guardianOk: (iconeSucesso: string) => `${iconeSucesso} Guardian: integrity validated. Proceeding with update.`,
    guardianAviso: '[WARNING] Guardian generated new baseline or detected changes. Proceeding with caution.',
    guardianDica: 'Recommended: `prometheus guardian --diff` and `prometheus guardian --accept-baseline` before updating.'
  }
});
