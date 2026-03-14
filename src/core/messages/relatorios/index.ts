// SPDX-License-Identifier: MIT-0
/**
 * Mensagens de Relatórios MD/JSON
 */

export { getDescricaoCampo, JsonMensagens, wrapComMetadados } from '@core/messages/relatorios/json-messages.js';
export { formatMessage, pluralize, RelatorioMensagens, separator } from '@core/messages/relatorios/relatorio-messages.js';
export { escreverRelatorioMarkdown, gerarFooterRelatorio, gerarHeaderRelatorio, gerarSecaoEstatisticas, gerarSecaoGuardian, gerarSecaoProblemasAgrupados, gerarTabelaDuasColunas, gerarTabelaOcorrencias, gerarTabelaResumoTipos, type MetadadosRelatorioEstendido } from '@core/messages/relatorios/relatorio-templates.js';