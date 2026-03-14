// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoReverterMensagens = createI18nMessages({
  descricao: 'Gerencia mapa de reversão para moves aplicados',
  opcoes: {
    force: 'Executa a operação sem confirmação (CUIDADO!)'
  },
  subcomandos: {
    listar: {
      descricao: 'Lista todos os moves registrados no mapa de reversão',
      erro: (msg: string) => `Falha ao listar moves: ${msg}`
    },
    arquivo: {
      descricao: 'Reverte todos os moves de um arquivo específico',
      argumento: 'Caminho do arquivo para reverter',
      erro: (msg: string) => `Falha ao reverter arquivo: ${msg}`
    },
    move: {
      descricao: 'Reverte um move específico pelo ID',
      argumento: 'ID do move para reverter',
      erro: (msg: string) => `Falha ao reverter move: ${msg}`
    },
    limpar: {
      descricao: 'Limpa todo o mapa de reversão (perde histórico)',
      erro: (msg: string) => `Falha ao limpar mapa: ${msg}`
    },
    status: {
      descricao: 'Mostra status do mapa de reversão',
      erro: (msg: string) => `Falha ao obter status: ${msg}`
    }
  },
  falhaCarregarMapaFast: (erro: string) => `Falha ao carregar mapa de reversão (fast-mode): ${erro}`,
  mapaLimpoComSucesso: (iconeSucesso: string) => `${iconeSucesso} Mapa de reversão limpo com sucesso!`,
  ultimoMove: (data: string) => `[LIST] Último move registrado em: ${data}`
}, {
  descricao: 'Manages reversal map for applied moves',
  opcoes: {
    force: 'Execute the operation without confirmation (CAUTION!)'
  },
  subcomandos: {
    listar: {
      descricao: 'Lists all moves registered in the reversal map',
      erro: (msg: string) => `Failed to list moves: ${msg}`
    },
    arquivo: {
      descricao: 'Reverts all moves from a specific file',
      argumento: 'Path of file to revert',
      erro: (msg: string) => `Failed to revert file: ${msg}`
    },
    move: {
      descricao: 'Reverts a specific move by ID',
      argumento: 'ID of move to revert',
      erro: (msg: string) => `Failed to revert move: ${msg}`
    },
    limpar: {
      descricao: 'Clears entire reversal map (loses history)',
      erro: (msg: string) => `Failed to clear map: ${msg}`
    },
    status: {
      descricao: 'Shows reversal map status',
      erro: (msg: string) => `Failed to get status: ${msg}`
    }
  },
  falhaCarregarMapaFast: (erro: string) => `Failed to load reversal map (fast-mode): ${erro}`,
  mapaLimpoComSucesso: (iconeSucesso: string) => `${iconeSucesso} Reversal map cleared successfully!`,
  ultimoMove: (data: string) => `[LIST] Last move registered at: ${data}`
});
