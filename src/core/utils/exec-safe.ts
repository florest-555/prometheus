// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: esta função é intencionalmente síncrona para executar comandos shell
import { execSync, type ExecSyncOptions } from 'node:child_process';

import { config } from '@core/config/config.js';

/**
 * Executa um comando shell de forma segura.
 * Bloqueia a execução quando SAFE_MODE está ativo e ALLOW_EXEC não está habilitado.
 * @param cmd - Comando shell a executar
 * @param opts - Opções do execSync do Node.js
 * @returns Buffer ou string com a saída do comando
 * @throws Error se SAFE_MODE estiver ativo sem ALLOW_EXEC
 */
export function executarShellSeguro(
  cmd: string,
  opts: ExecSyncOptions = {},
): Buffer | string {
  // only block if SAFE_MODE is explicitly true and ALLOW_EXEC is falsy
  if (config.SAFE_MODE === true && !config.ALLOW_EXEC) {
    throw new Error(
      'Execução de comandos desabilitada em SAFE_MODE. Defina PROMETHEUS_ALLOW_EXEC=1 para permitir.',
    );
  }
  return execSync(cmd, opts);
}

/**
 * Versão assíncrona do `executarShellSeguro`.
 * Wrapper async que delega ao sync, útil em contextos que já utilizam await.
 * @param cmd - Comando shell a executar
 * @param opts - Opções do execSync do Node.js
 * @returns Promise resolvida com Buffer ou string da saída do comando
 * @throws Error se SAFE_MODE estiver ativo sem ALLOW_EXEC
 */
export async function executarShellSeguroAsync(
  cmd: string,
  opts: ExecSyncOptions = {},
): Promise<Buffer | string> {
  // wrapper assíncrono que delega ao sync (usado onde já há await)
  return executarShellSeguro(cmd, opts);
}
