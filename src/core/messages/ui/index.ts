// SPDX-License-Identifier: MIT-0
/**
 * UI: Ícones, Sugestões, Filtros
 */

export {
  type AgrupamentoConfig,
  AGRUPAMENTOS_MENSAGEM,
  type ConfigPrioridade,
  contarPorPrioridade,
  findAgrupamento,
  getPrioridade,
  ordenarPorPrioridade,
  type PrioridadeNivel,
  PRIORIDADES,
} from '@core/messages/ui/filtro-config.js';
export {
  getIcone,
  type IconeAcao,
  type IconeArquivo,
  type IconeComando,
  type IconeDiagnostico,
  type IconeFeedback,
  type IconeNivel,
  type IconeRelatorio,
  ICONES,
  ICONES_ACAO,
  ICONES_ARQUIVO,
  ICONES_COMANDO,
  ICONES_DIAGNOSTICO,
  ICONES_FEEDBACK,
  ICONES_NIVEL,
  ICONES_RELATORIO,
  ICONES_STATUS,
  ICONES_TIPOS,
  ICONES_ZELADOR,
  type IconeStatus,
  type IconeTipo,
  type IconeZelador,
  suportaCores,
} from '@core/messages/ui/icons.js';
export {
  formatarSugestoes,
  gerarSugestoesContextuais,
  SUGESTOES,
  SUGESTOES_ARQUETIPOS,
  SUGESTOES_AUTOFIX,
  SUGESTOES_COMANDOS,
  SUGESTOES_DIAGNOSTICO,
  SUGESTOES_GUARDIAN,
  SUGESTOES_METRICAS,
  SUGESTOES_PODAR,
  SUGESTOES_REESTRUTURAR,
  SUGESTOES_TIPOS,
  SUGESTOES_ZELADOR,
} from '@core/messages/ui/sugestoes.js';
export * from '@core/messages/ui/sugestoes-contextuais-messages.js';
