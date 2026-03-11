// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoNamesMensagens = createI18nMessages({
  descricao: 'Varre o repositório em busca de nomes de variáveis e gera arquivos de mapeamento (estrutura fragmentada em names/).',
  opcoes: {
    legacy: 'Gera também names/name.txt único (compatibilidade com fluxo antigo).'
  },
  erros: {
    falhaFlags: (erro: string) => `Falha ao aplicar flags no comando names: ${erro}`,
    erroProcessar: (rel: string) => `[Aviso] Erro ao processar ${rel}`
  },
  status: {
    inicio: 'Iniciando varredura de nomes de variáveis...',
    concluidoLegacy: (totalNomes: number, totalArquivos: number, saidaArquivo: string) =>
      `Varredura concluída! ${totalNomes} variáveis em ${totalArquivos} arquivos. Mapeamento fragmentado em names/ e agregado em ${saidaArquivo}.`,
    concluido: (totalNomes: number, totalArquivos: number) =>
      `Varredura concluída! ${totalNomes} variáveis em ${totalArquivos} arquivos. Mapeamento em names/ (estrutura espelhada).`
  }
}, {
  descricao: 'Scans repository for variable names and generates mapping files (fragmented structure in names/).',
  opcoes: {
    legacy: 'Also generates unique names/name.txt (compatibility with old flow).'
  },
  erros: {
    falhaFlags: (erro: string) => `Failed to apply flags to names command: ${erro}`,
    erroProcessar: (rel: string) => `[Warning] Error processing ${rel}`
  },
  status: {
    inicio: 'Starting variable name scan...',
    concluidoLegacy: (totalNomes: number, totalArquivos: number, saidaArquivo: string) =>
      `Scan completed! ${totalNomes} variables in ${totalArquivos} files. Fragmented mapping in names/ and aggregated in ${saidaArquivo}.`,
    concluido: (totalNomes: number, totalArquivos: number) =>
      `Scan completed! ${totalNomes} variables in ${totalArquivos} files. Mapping in names/ (mirrored structure).`
  }
});
