// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoAnalistasMensagens = createI18nMessages({
  descricao: 'Lista analistas registrados e seus metadados atuais',
  opcoes: {
    json: 'Saída em JSON estruturado (para CI/integrações)',
    output: 'Arquivo para exportar JSON de analistas',
    doc: 'Gera documentação Markdown dos analistas'
  },
  erroListar: (erro: string) => `Falha ao listar analistas: ${erro}`,
  fastModeTitulo: '\n[LIST] Analistas registrados (FAST MODE):\n',
  fastModeTotalZero: '\nTotal: 0',
  docMdTitulo: 'Analysts Documentation',
  docGeradoEm: (iso: string) => `Gerado em: ${iso}`,
  docTabelaHeader: '| Nome | Categoria | Descrição | Limites |',
  docTabelaSeparador: '| ---- | --------- | --------- | ------- |',
  docLinhaAnalista: (nome: string, categoria: string, descricao: string, limitesStr: string) => `| ${nome} | ${categoria} | ${descricao} | ${limitesStr} |`,
  docGerada: (destinoDoc: string) => `[DOC] Documentação de analistas gerada em ${destinoDoc}`,
  jsonExportado: (destino: string) => `[DOC] Exportado JSON de analistas para ${destino}`,
  titulo: '\n[LIST] Analistas registrados:\n',
  linhaAnalista: (nome: string, categoria: string, descricao?: string) => `- ${nome} (${categoria}) ${descricao ? `: ${descricao}` : ''}`,
  tituloComIcone: (iconeInfo: string) => `${iconeInfo} Analistas registrados:`,
  total: (n: number) => `\nTotal: ${n}`
}, {
  descricao: 'Lists registered analysts and their current metadata',
  opcoes: {
    json: 'Output in structured JSON (for CI/integrations)',
    output: 'File to export analysts JSON',
    doc: 'Generates Markdown documentation of analysts'
  },
  erroListar: (erro: string) => `Failed to list analysts: ${erro}`,
  fastModeTitulo: '\n[LIST] Registered analysts (FAST MODE):\n',
  fastModeTotalZero: '\nTotal: 0',
  docMdTitulo: 'Analysts Documentation',
  docGeradoEm: (iso: string) => `Generated at: ${iso}`,
  docTabelaHeader: '| Name | Category | Description | Limits |',
  docTabelaSeparador: '| ---- | --------- | --------- | ------- |',
  docLinhaAnalista: (nome: string, categoria: string, descricao: string, limitesStr: string) => `| ${nome} | ${categoria} | ${descricao} | ${limitesStr} |`,
  docGerada: (destinoDoc: string) => `[DOC] Analyst documentation generated at ${destinoDoc}`,
  jsonExportado: (destino: string) => `[DOC] Exported analysts JSON to ${destino}`,
  titulo: '\n[LIST] Registered analysts:\n',
  linhaAnalista: (nome: string, categoria: string, descricao?: string) => `- ${nome} (${categoria}) ${descricao ? `: ${descricao}` : ''}`,
  tituloComIcone: (iconeInfo: string) => `${iconeInfo} Registered analysts:`,
  total: (n: number) => `\nTotal: ${n}`
});
