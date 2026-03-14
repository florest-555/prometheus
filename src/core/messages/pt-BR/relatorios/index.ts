// SPDX-License-Identifier: MIT-0
/**
 * Mensagens de Relatórios MD/JSON
 */

export { getDescricaoCampo, JsonMensagens, wrapComMetadados } from '@core/messages/pt-BR/relatorios/json-messages.js';
export { formatMessage, pluralize, RelatorioMensagens, separator } from '@core/messages/pt-BR/relatorios/relatorio-messages.js';
export { escreverRelatorioMarkdown, gerarFooterRelatorio, gerarHeaderRelatorio, gerarSecaoEstatisticas, gerarSecaoGuardian, gerarSecaoProblemasAgrupados, gerarTabelaDuasColunas, gerarTabelaOcorrencias, gerarTabelaResumoTipos, type MetadadosRelatorioEstendido } from '@core/messages/pt-BR/relatorios/relatorio-templates.js';