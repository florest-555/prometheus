// SPDX-License-Identifier: MIT-0
// @prometheus-disable tipo-literal-inline-complexo
// Justificativa: tipos inline para opções de comando CLI são locais e não precisam de extração
// Importar handler modular do Guardian (Sprint 2)
// Registro de analistas será carregado dinamicamente para permitir injeção de dependências
import { executarGuardian as executarGuardianModular, type GuardianOptions } from '@cli/diagnostico/handlers/guardian-handler.js';
import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import { config } from '@core/config/config.js';
import { iniciarInquisicao } from '@core/execution/inquisidor.js';
import { CliComandoGuardianMensagens } from '@core/messages/cli/cli-comando-guardian-messages.js';
import { log, logGuardian } from '@core/messages/index.js';
import { acceptNewBaseline } from '@guardian/sentinela.js';
import { Command } from 'commander';

import type { FileEntry, FileEntryWithAst, Tecnica } from '@';
import { asTecnicas, extrairMensagemErro, IntegridadeStatus } from '@';

export function comandoGuardian(aplicarFlagsGlobais: (opts: Record<string, unknown>) => void): Command {
  return new Command('guardian')
    .description(CliComandoGuardianMensagens.descricao)
    // Alinhar com comportamento tolerante usado em outros comandos/testes
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .option('-a, --accept-baseline', CliComandoGuardianMensagens.opcoes.acceptBaseline)
    .option('-d, --diff', CliComandoGuardianMensagens.opcoes.diff)
    .option('--full-scan', CliComandoGuardianMensagens.opcoes.fullScan)
    .option('--json', CliComandoGuardianMensagens.opcoes.json)
    .action(async function (this: Command, opts: {
    acceptBaseline?: boolean;
    diff?: boolean;
    fullScan?: boolean;
    json?: boolean;
  }) {
    try {
      await aplicarFlagsGlobais(this.parent && typeof this.parent.opts === 'function' ? this.parent.opts() : {});
    } catch (err) {
      log.erro(CliComandoGuardianMensagens.erroFlags(err instanceof Error ? err.message : String(err)));
      sair(ExitCode.Failure);
      return;
    }
    const baseDir = process.cwd();
    let fileEntries: FileEntryWithAst[] = [];
    try {
      // Carrega registro de analistas no momento da execução
      const { registroAnalistas } = await import('@analistas/registry/registry.js');
      const tecnicas = asTecnicas(registroAnalistas as Tecnica[]);
      const resultadoInquisicao = await iniciarInquisicao(baseDir, {
        incluirMetadados: false
      }, tecnicas);
      fileEntries = resultadoInquisicao.fileEntries;
      const ignoradosOriginaisRaw = (config as {
        GUARDIAN_IGNORE_PATTERNS?: string[];
      }).GUARDIAN_IGNORE_PATTERNS;
      const ignoradosOriginais = Array.isArray(ignoradosOriginaisRaw) ? [...ignoradosOriginaisRaw] : [];
      if (opts.fullScan) {
        // Temporariamente desabilita padrões ignorados
        (config as unknown as {
          GUARDIAN_IGNORE_PATTERNS: string[];
        }).GUARDIAN_IGNORE_PATTERNS = [];
        if (!opts.acceptBaseline) {
          logGuardian.fullScanAviso();
        }
      }
      if (opts.acceptBaseline) {
        if (opts.fullScan) {
          log.aviso(CliComandoGuardianMensagens.baselineNaoPermitidoFullScan);
          (config as unknown as {
            GUARDIAN_IGNORE_PATTERNS: string[];
          }).GUARDIAN_IGNORE_PATTERNS = ignoradosOriginais;
          sair(ExitCode.Failure);
          return;
        }
        logGuardian.aceitandoBaseline();
        await acceptNewBaseline(fileEntries);
        if (opts.json) {
          console.log(JSON.stringify({
            status: IntegridadeStatus.Aceito,
            baseline: true
          }));
        } else {
          logGuardian.baselineAceitoSucesso();
        }
      } else {
        // REFATORADO: Usar handler modular do Guardian
        const guardianOpts: GuardianOptions = {
          enabled: true,
          fullScan: Boolean(opts.fullScan),
          saveBaseline: false,
          silent: Boolean(opts.json)
        };
        const guardianResultado = await executarGuardianModular(fileEntries.map(e => ({
          relPath: e.relPath,
          fullCaminho: e.fullCaminho,
          content: e.content
        })) as FileEntry[], guardianOpts);

        // Processar resultado baseado no modo
        if (opts.diff) {
          // Modo diff: mostrar diferenças
          if (guardianResultado.drift && guardianResultado.drift > 0) {
            if (opts.json) {
              console.log(JSON.stringify({
                status: 'alteracoes-detectadas',
                drift: guardianResultado.drift
              }));
            } else {
              logGuardian.diferencasDetectadas();
              log.aviso(CliComandoGuardianMensagens.diffMudancasDetectadas(guardianResultado.drift));
              log.aviso(CliComandoGuardianMensagens.diffComoAceitarMudancas);
            }
            sair(ExitCode.Failure);
            return;
          } else {
            if (opts.json) {
              console.log(JSON.stringify({
                status: 'ok',
                drift: 0
              }));
            } else {
              logGuardian.integridadePreservada();
            }
          }
        } else {
          // Modo normal: verificar integridade
          const statusNorm = guardianResultado.status || IntegridadeStatus.Ok;
          switch (statusNorm) {
            case IntegridadeStatus.Ok:
              if (opts.json) console.log(JSON.stringify({
                status: 'ok',
                cacheDiffHits: (globalThis as unknown as {
                  __PROMETHEUS_DIFF_CACHE_HITS__?: number;
                }).__PROMETHEUS_DIFF_CACHE_HITS__ || 0
              }));else logGuardian.integridadeOk();
              break;
            case IntegridadeStatus.Criado:
              if (opts.json) console.log(JSON.stringify({
                status: 'baseline-criado',
                cacheDiffHits: (globalThis as unknown as {
                  __PROMETHEUS_DIFF_CACHE_HITS__?: number;
                }).__PROMETHEUS_DIFF_CACHE_HITS__ || 0
              }));else logGuardian.baselineCriadoConsole();
              log.aviso(CliComandoGuardianMensagens.baselineCriadoComoAceitar);
              break;
            case IntegridadeStatus.Aceito:
              if (opts.json) console.log(JSON.stringify({
                status: 'baseline-aceito',
                cacheDiffHits: (globalThis as unknown as {
                  __PROMETHEUS_DIFF_CACHE_HITS__?: number;
                }).__PROMETHEUS_DIFF_CACHE_HITS__ || 0
              }));else logGuardian.baselineAtualizado();
              break;
            case IntegridadeStatus.AlteracoesDetectadas:
              {
                if (opts.json) {
                  console.log(JSON.stringify({
                    status: 'alteracoes-detectadas',
                    temProblemas: guardianResultado.temProblemas,
                    drift: guardianResultado.drift
                  }));
                } else {
                  logGuardian.alteracoesSuspeitas();
                }
                sair(ExitCode.Failure);
                return;
              }
          }
        }
      }
      if (opts.fullScan) {
        // Restaura padrões originais após execução
        (config as unknown as {
          GUARDIAN_IGNORE_PATTERNS: string[];
        }).GUARDIAN_IGNORE_PATTERNS = ignoradosOriginais;
      }
    } catch (err) {
      logGuardian.erroGuardian((err as Error).message ?? String(err));
      if (config.DEV_MODE) {
        // prometheus-ignore: console-in-production - apenas em modo DEV
        console.error(extrairMensagemErro(err));
        if (err && typeof err === 'object' && 'stack' in err) {
          // prometheus-ignore: console-in-production - apenas em modo DEV
          console.error((err as {
            stack?: string;
          }).stack);
        }
      }
      if (opts.json) console.log(JSON.stringify({
        status: 'erro',
        mensagem: extrairMensagemErro(err)
      }));
      sair(ExitCode.Failure);
      return;
    }
  });
}