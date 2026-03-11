// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoLicensasMensagens = createI18nMessages({
  descricao: 'Ferramentas relacionadas a licença',
  subcomandos: {
    scan: {
      descricao: 'Escaneia dependências em busca de licenças desconhecidas',
      opcoes: {
        root: 'Define o diretório raiz do projeto (padrão: CWD)'
      },
      falha: (erro: string) => `Falha ao escanear licenças: ${erro}`
    },
    notices: {
      descricao: 'Gerenciar avisos/terceiros',
      generate: {
        descricao: 'Gerar arquivo THIRD-PARTY/AVISOS',
        opcoes: {
          ptBr: 'usar cabeçalho em português',
          output: 'Define o arquivo ou diretório de saída',
          root: 'Define o diretório raiz do projeto (padrão: CWD)'
        },
        falha: (erro: string) => `Falha ao gerar notices: ${erro}`,
        concluido: (res: unknown) => `Generated notices: ${res}`
      }
    },
    disclaimer: {
      descricao: 'Adicionar/verificar disclaimer em markdown',
      add: {
        descricao: 'Inserir aviso de proveniência nos arquivos markdown',
        opcoes: {
          disclaimerPath: 'caminho do arquivo de disclaimer',
          root: 'Define o diretório raiz do projeto (padrão: CWD)',
          dryRun: 'Executa em modo simulação (não grava mudanças no disco)'
        },
        falha: (erro: string) => `Falha ao adicionar disclaimer: ${erro}`,
        concluido: (total: number) => `Disclaimer inserted into files: ${total}`
      },
      verify: {
        descricao: 'Verificar se todos os markdown possuem o disclaimer',
        falha: (erro: string) => `Falha ao verificar disclaimer: ${erro}`,
        ausente: 'Missing disclaimer in files:',
        todosOk: 'All markdown files include the disclaimer.'
      }
    }
  }
}, {
  descricao: 'License related tools',
  subcomandos: {
    scan: {
      descricao: 'Scans dependencies for unknown licenses',
      opcoes: {
        root: 'Define the project root directory (default: CWD)'
      },
      falha: (erro: string) => `Failed to scan licenses: ${erro}`
    },
    notices: {
      descricao: 'Manage third-party notices',
      generate: {
        descricao: 'Generate THIRD-PARTY/NOTICES file',
        opcoes: {
          ptBr: 'use Portuguese header',
          output: 'Define the output file or directory',
          root: 'Define the project root directory (default: CWD)'
        },
        falha: (erro: string) => `Failed to generate notices: ${erro}`,
        concluido: (res: unknown) => `Generated notices: ${res}`
      }
    },
    disclaimer: {
      descricao: 'Add/verify disclaimer in markdown',
      add: {
        descricao: 'Insert provenance notice into markdown files',
        opcoes: {
          disclaimerPath: 'path to disclaimer file',
          root: 'Define the project root directory (default: CWD)',
          dryRun: 'Execute in simulation mode (does not write changes to disk)'
        },
        falha: (erro: string) => `Failed to add disclaimer: ${erro}`,
        concluido: (total: number) => `Disclaimer inserted into ${total} files`
      },
      verify: {
        descricao: 'Verify all markdown files have the disclaimer',
        falha: (erro: string) => `Failed to verify disclaimer: ${erro}`,
        ausente: 'Missing disclaimer in files:',
        todosOk: 'All markdown files include the disclaimer.'
      }
    }
  }
});
