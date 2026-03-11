// SPDX-License-Identifier: MIT-0
import { mapaReversao } from '@analistas/corrections/mapa-reversao.js';
import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import { CliComandoReverterMensagens } from '@core/messages/cli/cli-comando-reverter-messages.js';
import { ICONES_DIAGNOSTICO, log, logAuto, logSistema } from '@core/messages/index.js';
import { Command } from 'commander';

export function registrarComandoReverter(program: Command): void {
  program.command('reverter')
    .description(CliComandoReverterMensagens.descricao)
    .hook('preAction', async () => {
    if (process.env.PROMETHEUS_TEST_FAST === '1') {
      try {
        await mapaReversao.carregar();
      } catch (err) {
        // Em modo de teste rápido, falhas ao carregar o mapa são ignoradas para evitar timeout.
        // Porém, em outros ambientes, registramos um aviso para reduzir casos de promises 'swallowed'.
        if (process.env.VITEST === '1') return;
        log.aviso(CliComandoReverterMensagens.falhaCarregarMapaFast(err instanceof Error ? err.message : String(err)));
      }
    }
  }).addCommand(new Command('listar').description('Lista todos os moves registrados no mapa de reversão').action(async () => {
    try {
      await mapaReversao.carregar();
      const _lista = mapaReversao.listarMoves();
    } catch (err) {
      log.erro(CliComandoReverterMensagens.subcomandos.listar.erro(err instanceof Error ? err.message : String(err)));
      sair(ExitCode.Failure);
    }
  }))
  .addCommand(new Command('arquivo')
    .description(CliComandoReverterMensagens.subcomandos.arquivo.descricao)
    .argument('<arquivo>', CliComandoReverterMensagens.subcomandos.arquivo.argumento)
    .action(async (arquivo: string) => {
    try {
      await mapaReversao.carregar();
      if (!mapaReversao.podeReverterArquivo(arquivo)) {
        logSistema.reversaoNenhumMove(arquivo);
        sair(ExitCode.Failure);
        return;
      }
      logSistema.reversaoRevertendo(arquivo);
      const sucesso = await mapaReversao.reverterArquivo(arquivo);
      if (sucesso) {
        logSistema.reversaoSucesso(arquivo);
      } else {
        logSistema.reversaoFalha(arquivo);
        sair(ExitCode.Failure);
        return;
      }
    } catch (err) {
      log.erro(CliComandoReverterMensagens.subcomandos.arquivo.erro(err instanceof Error ? err.message : String(err)));
      sair(ExitCode.Failure);
    }
  }))
  .addCommand(new Command('move')
    .description(CliComandoReverterMensagens.subcomandos.move.descricao)
    .argument('<id>', CliComandoReverterMensagens.subcomandos.move.argumento)
    .action(async (id: string) => {
    try {
      await mapaReversao.carregar();
      logAuto.mapaReversaoRevertendoMove(id);
      const sucesso = await mapaReversao.reverterMove(id);
      if (sucesso) {
        logAuto.mapaReversaoMoveRevertido(id);
      } else {
        logAuto.mapaReversaoFalhaReverterMove(id);
        sair(ExitCode.Failure);
        return;
      }
    } catch (err) {
      log.erro(CliComandoReverterMensagens.subcomandos.move.erro(err instanceof Error ? err.message : String(err)));
      sair(ExitCode.Failure);
    }
  }))
  .addCommand(new Command('limpar')
    .description(CliComandoReverterMensagens.subcomandos.limpar.descricao)
    .option('-f, --force', CliComandoReverterMensagens.opcoes.force)
    .action(async (options: {
    force?: boolean;
  }) => {
    try {
      await mapaReversao.carregar();
      if (!options.force) {
        sair(ExitCode.Failure);
        return;
      }
      await mapaReversao.limpar();
      log.sucesso(CliComandoReverterMensagens.mapaLimpoComSucesso(ICONES_DIAGNOSTICO.sucesso));
    } catch (err) {
      log.erro(CliComandoReverterMensagens.subcomandos.limpar.erro(err instanceof Error ? err.message : String(err)));
      sair(ExitCode.Failure);
    }
  }))
  .addCommand(new Command('status')
    .description(CliComandoReverterMensagens.subcomandos.status.descricao)
    .action(async () => {
    try {
      await mapaReversao.carregar();
      const moves = mapaReversao.obterMoves();
      if (moves.length > 0) {
        const ultimoMove = moves.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        const dataPtBr = new Date(ultimoMove.timestamp).toLocaleString('pt-BR');
        log.info(CliComandoReverterMensagens.ultimoMove(dataPtBr));
      }
    } catch (err) {
      log.erro(CliComandoReverterMensagens.subcomandos.status.erro(err instanceof Error ? err.message : String(err)));
      sair(ExitCode.Failure);
    }
  }));
}