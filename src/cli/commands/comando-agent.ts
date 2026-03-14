// SPDX-License-Identifier: MIT-0
import { processarAgent } from '@cli/handlers/agent-handler.js';
import { CliComandoAgentMensagens } from '@core/messages/cli/cli-comando-agent-messages.js';
import { Command } from 'commander';

export function comandoAgent(aplicarFlagsGlobais: (opts: Record<string, unknown>) => void): Command {
  const cmd = new Command('agent')
    .alias('ag')
    .description(CliComandoAgentMensagens.descricao);

  cmd
    .option('-i, --interactive', CliComandoAgentMensagens.opcoes.interactive, false)
    .option('-a, --agent <name>', CliComandoAgentMensagens.opcoes.agent)
    .option('-m, --model <name>', CliComandoAgentMensagens.opcoes.model)
    .option('-p, --provider <name>', CliComandoAgentMensagens.opcoes.provider);

  cmd.action(async (opts: {
    interactive?: boolean;
    agent?: string;
    model?: string;
    provider?: string;
  }, command: Command) => {
    // Aplicar flags globais
    try {
      const parentObj = command.parent as unknown as {
        opts?: () => Record<string, unknown>;
      } | undefined;
      const parentFlags = parentObj && typeof parentObj.opts === 'function' ? parentObj.opts() : {};
      const localFlags = typeof command.opts === 'function' ? command.opts() : {};
      const merged = {
        ...(parentFlags || {}),
        ...(localFlags || {}),
        ...(opts || {})
      };
      await aplicarFlagsGlobais(merged);
    } catch {
      try {
        await aplicarFlagsGlobais(opts as unknown as Record<string, unknown>);
      } catch {
        /* swallow */
      }
    }

    try {
      await processarAgent(opts);
    } catch (err) {
      throw err;
    }
  });

  return cmd;
}
