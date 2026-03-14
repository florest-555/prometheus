// SPDX-License-Identifier: MIT-0
/**
 * Ponto de entrada único para todos os comandos da CLI do Prometheus.
 *
 * Este arquivo centraliza as exportações de todos os comandos disponíveis,
 * facilitando a manutenção e evitando múltiplas importações espalhadas.
 */

// Comandos principais
export { comandoAgent } from '@cli/commands/comando-agent.js';
export { comandoAnalistas } from '@cli/commands/comando-analistas.js';
export { comandoAtualizar } from '@cli/commands/comando-atualizar.js';
export { comandoDiagnosticar } from '@cli/commands/comando-diagnosticar.js';
export { criarComandoFixTypes } from '@cli/commands/comando-fix-types.js';
export { comandoFormatar } from '@cli/commands/comando-formatar.js';
export { comandoGuardian } from '@cli/commands/comando-guardian.js';
export { comandoKit } from '@cli/commands/comando-kit.js';
export { comandoLicencas } from '@cli/commands/comando-licensas.js';
export { comandoMetricas } from '@cli/commands/comando-metricas.js';
export { comandoOtimizarSvg } from '@cli/commands/comando-otimizar-svg.js';
export { comandoPerf } from '@cli/commands/comando-perf.js';
export { comandoPodar } from '@cli/commands/comando-podar.js';
export { comandoReestruturar } from '@cli/commands/comando-reestruturar.js';

// Comando de reversão (diferente padrão de export)
export { registrarComandoReverter } from '@cli/commands/comando-reverter.js';

// Comandos de manutenção de nomes
export { comandoNames } from '@cli/commands/comando-names.js';
export { comandoRename } from '@cli/commands/comando-rename.js';


