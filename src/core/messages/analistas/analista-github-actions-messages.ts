// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const AnalistaGithubActionsMensagens = createI18nMessages({
  timeoutAusente: 'Workflow sem "timeout-minutes" definido. Jobs travados podem consumir créditos excessivos.',
  permissaoExcessiva: 'Uso de "permissions: write-all" detectado. Isso viola o princípio do privilégio mínimo.',
  prTargetPerigoso: 'Uso potencial de "pull_request_target" com checkout de código não confiável.',
  concurrencyAusente: 'Workflow sem grupo de "concurrency". Execuções simultâneas podem causar conflitos de deploy.',
  cacheAusente: 'setup-node detectado sem configuração de cache.',
  tokenExposto: 'GITHUB_TOKEN pode ser exposto em outputs. Use $GITHUB_OUTPUT com cuidado.',
  setOutputDeprecado: 'Uso de "::set-output" detectado. Este comando está deprecated.',
  runnerCaro: (runner: string) => `Uso de runner "${runner}" detectado. Considere usar ubuntu-latest para reduzir custos.`
}, {
  timeoutAusente: 'Workflow without "timeout-minutes" defined. Stuck jobs can consume excessive credits.',
  permissaoExcessiva: 'Usage of "permissions: write-all" detected. This violates the principle of least privilege.',
  prTargetPerigoso: 'Potential use of "pull_request_target" with untrusted code checkout.',
  concurrencyAusente: 'Workflow without "concurrency" group. Simultaneous runs can cause deploy conflicts.',
  cacheAusente: 'setup-node detected without cache configuration.',
  tokenExposto: 'GITHUB_TOKEN may be exposed in outputs. Use $GITHUB_OUTPUT carefully.',
  setOutputDeprecado: 'Usage of "::set-output" detected. This command is deprecated.',
  runnerCaro: (runner: string) => `Usage of runner "${runner}" detected. Consider using ubuntu-latest to reduce costs.`
});
