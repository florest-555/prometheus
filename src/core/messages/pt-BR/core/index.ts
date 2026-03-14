// SPDX-License-Identifier: MIT-0
/**
 * Mensagens Core: Correções, Diagnóstico, Exceções, Fix-Types, Inquisidor, Plugins
 */

// Correções (auto-fix, zeladores)
export { MENSAGENS_ARQUETIPOS_HANDLER, MENSAGENS_AUTOFIX, MENSAGENS_CORRECAO_TIPOS, MENSAGENS_CORRECOES, MENSAGENS_EXECUTOR, MENSAGENS_PLUGINS, MENSAGENS_RELATORIOS_ANALISE } from '@core/messages/pt-BR/core/correcoes-messages.js';

// Diagnóstico
export { CABECALHOS, formatarBlocoSugestoes, formatarModoJson, formatarResumoStats, ICONES_DIAGNOSTICO, MENSAGENS_ARQUETIPOS, MENSAGENS_AVISO, MENSAGENS_CONCLUSAO, MENSAGENS_ERRO, MENSAGENS_ESTATISTICAS, MENSAGENS_FILTROS, MENSAGENS_GUARDIAN, MENSAGENS_INICIO, MENSAGENS_PROGRESSO, MODELOS_BLOCO } from '@core/messages/pt-BR/core/diagnostico-messages.js';

// Exceções
export { ExcecoesMensagens } from '@core/messages/pt-BR/core/excecoes-messages.js';

// Fix-types (com aliases para evitar conflitos)
export { ACOES_SUGERIDAS, CATEGORIAS_TIPOS, DEPURACAO, DICAS, formatarComContexto, formatarOcorrencia, formatarSugestao, formatarTipoInseguro, gerarResumoCategoria, ICONES as ICONES_FIX_TYPES, MENSAGENS_CLI_CORRECAO_TIPOS, MENSAGENS_ERRO as MENSAGENS_ERRO_FIX_TYPES, MENSAGENS_INICIO as MENSAGENS_INICIO_FIX_TYPES, MENSAGENS_PROGRESSO as MENSAGENS_PROGRESSO_FIX_TYPES, MENSAGENS_RESUMO, MENSAGENS_SUCESSO as MENSAGENS_SUCESSO_FIX_TYPES, TEMPLATE_RESUMO_FINAL, TEXTOS_CATEGORIZACAO_CORRECAO_TIPOS } from '@core/messages/pt-BR/core/fix-types-messages.js';

// Inquisidor
export { InquisidorMensagens } from '@core/messages/pt-BR/core/inquisidor-messages.js';

// Plugin (mensagens de analistas de plugins)
export { AnalystOrigens, AnalystTipos, CssMensagens, HtmlMensagens, PythonMensagens, ReactHooksMensagens, ReactMensagens, SeverityNiveis, TailwindMensagens } from '@core/messages/pt-BR/core/plugin-messages.js';