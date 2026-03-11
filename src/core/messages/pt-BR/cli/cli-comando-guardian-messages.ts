// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const CliComandoGuardianMensagens = createI18nMessages({
  descricao: 'Gerencia e verifica a integridade do ambiente do Prometheus.',
  opcoes: {
    acceptBaseline: 'Aceita o baseline atual como o novo baseline de integridade',
    diff: 'Mostra as diferenças entre o estado atual e o baseline',
    fullScan: 'Executa verificação sem aplicar GUARDIAN_IGNORE_PATTERNS (não persistir baseline)',
    json: 'Saída em JSON estruturado (para CI/integrações)'
  },
  erroFlags: (erro: string) => `Falha ao aplicar flags no Guardian: ${erro}`,
  baselineNaoPermitidoFullScan: 'Não é permitido aceitar baseline com --full-scan ativo.',
  diffMudancasDetectadas: (drift: number) => `Detecção de drift: ${drift} alterações encontradas no ambiente.`,
  diffComoAceitarMudancas: 'Dica: Para aceitar as mudanças no ambiente, use: prometheus guardian --accept-baseline',
  baselineCriadoComoAceitar: 'Dica: Use --accept-baseline ou execute com --accept para confirmar as mudanças atuais.'
}, {
  descricao: 'Manages and verifies Prometheus environment integrity.',
  opcoes: {
    acceptBaseline: 'Accepts current baseline as new integrity baseline',
    diff: 'Shows differences between current state and baseline',
    fullScan: 'Runs verification without applying GUARDIAN_IGNORE_PATTERNS (do not persist baseline)',
    json: 'Output in structured JSON (for CI/integrations)'
  },
  erroFlags: (erro: string) => `Failed to apply flags to Guardian: ${erro}`,
  baselineNaoPermitidoFullScan: 'Cannot accept baseline with --full-scan active.',
  diffMudancasDetectadas: (drift: number) => `Drift detection: ${drift} changes found in environment.`,
  diffComoAceitarMudancas: 'Tip: To accept environment changes, use: prometheus guardian --accept-baseline',
  baselineCriadoComoAceitar: 'Tip: Use --accept-baseline or run with --accept to confirm current changes.'
});
