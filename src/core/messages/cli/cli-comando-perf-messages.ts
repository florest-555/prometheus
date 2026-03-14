// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoDesempMensagens = createI18nMessages({
  descricao: 'Operações de baseline e comparação de performance sintética',
  opcoes: {
    dir: 'Diretório de snapshots',
    json: 'Saída em JSON estruturado (para CI/integrações)',
    limite: 'Limite para regressão (%)'
  },
  subcomandos: {
    baseline: {
      descricao: 'Gera uma nova baseline. Usa métricas globais da última execução se disponíveis.',
      erro: (msg: string) => `Falha na geração de baseline: ${msg}`
    },
    compare: {
      descricao: 'Compara os dois últimos snapshots e sinaliza regressão',
      erroSnapshots: (msg: string) => `Falha ao carregar snapshots: ${msg}`,
      erroMenosDeDois: 'Menos de dois snapshots para comparar'
    }
  },
  tituloComparacaoSnapshots: '\n[PERF] Comparação de snapshots de performance:\n',
  tituloComparacaoSnapshotsComIcone: (icone: string) => `${icone} Comparação entre snapshots:`
}, {
  descricao: 'Baseline operations and synthetic performance comparison',
  opcoes: {
    dir: 'Snapshots directory',
    json: 'Output in structured JSON (for CI/integrations)',
    limite: 'Regression limit (%)'
  },
  subcomandos: {
    baseline: {
      descricao: 'Generates a new baseline. Uses global metrics from last execution if available.',
      erro: (msg: string) => `Failed to generate baseline: ${msg}`
    },
    compare: {
      descricao: 'Compares the last two snapshots and signals regression',
      erroSnapshots: (msg: string) => `Failed to load snapshots: ${msg}`,
      erroMenosDeDois: 'Less than two snapshots to compare'
    }
  },
  tituloComparacaoSnapshots: '\n[PERF] Performance snapshot comparison:\n',
  tituloComparacaoSnapshotsComIcone: (icone: string) => `${icone} Snapshot comparison:`
});
