// SPDX-License-Identifier: MIT-0

import path from 'node:path';

import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import { processPatternList } from '@cli/helpers/pattern-helpers.js';
import { configurarFiltros } from '@cli/processing/filters.js';
import chalk from '@core/config/chalk-safe.js';
import { config } from '@core/config/config.js';
import { scanRepository } from '@core/execution/scanner.js';
import { CliComandoFormatarMensagens } from '@core/messages/cli/cli-comando-formatar-messages.js';
import { log } from '@core/messages/index.js';
import { formatarComPrettierProjeto, formatarPrettierMinimo } from '@shared/impar/formater.js';
import { salvarEstado } from '@shared/persistence/persistencia.js';
import { Command } from 'commander';
import micromatch from 'micromatch';

import type { FormatarCommandOpts, FormatResult } from '@';

function isFormatavel(relPath: string): boolean {
  return /\.(json|md|markdown|ya?ml|ts|tsx|js|jsx|mjs|cjs|html?|css|py|xml|php)$/i.test(
    relPath,
  );
}

function detectaNodeModulesExplicito(
  includeGroups: string[][],
  includeFlat: string[],
): boolean {
  const all = [...includeFlat, ...includeGroups.flat()];
  return all.some((p) => /(^|\/)node_modules(\/|$)/.test(String(p || '')));
}

export function comandoFormatar(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('formatar')
    .description(CliComandoFormatarMensagens.descricao)
    .option('--check', CliComandoFormatarMensagens.opcoes.check, true)
    .option('--write', CliComandoFormatarMensagens.opcoes.write, false)
    .option('--engine <engine>', CliComandoFormatarMensagens.opcoes.engine, 'auto')
    .option('--include <padrao>', CliComandoFormatarMensagens.opcoes.include, (val: string, prev: string[]) => {
      prev.push(val);
      return prev;
    }, [] as string[])
    .option('--exclude <padrao>', CliComandoFormatarMensagens.opcoes.exclude, (val: string, prev: string[]) => {
      prev.push(val);
      return prev;
    }, [] as string[])
    .action(async function (this: Command, opts: FormatarCommandOpts) {
      try {
        try {
          const parentOpts = this.parent && typeof this.parent.opts === 'function' ? await Promise.resolve(this.parent.opts()) : {};
          await aplicarFlagsGlobais(parentOpts);
        } catch (err) {
          log.erro(CliComandoFormatarMensagens.erros.falhaFlags(err instanceof Error ? err.message : String(err)));
          sair(ExitCode.Failure);
          return;
        }

        const write = Boolean(opts.write);
        const check = write ? false : Boolean(opts.check ?? true);

        const engineRaw = String(
          opts.engine || process.env.PROMETHEUS_FORMAT_ENGINE || 'auto',
        ).trim();
        const engine =
          engineRaw === 'interno' ||
            engineRaw === 'prettier' ||
            engineRaw === 'auto'
            ? engineRaw
            : 'auto';

        const includeList = processPatternList(opts.include);
        const excludeList = processPatternList(opts.exclude);

        // Mantém consistência com o pipeline de filtros: aplica defaults de excludes
        const includeGroupsRaw: string[][] = [];
        const incluiNodeModules = detectaNodeModulesExplicito(
          includeGroupsRaw,
          includeList,
        );
        configurarFiltros(
          includeGroupsRaw,
          includeList,
          excludeList,
          incluiNodeModules,
        );

        const baseDir = process.cwd();
        const result: FormatResult = {
          total: 0,
          formataveis: 0,
          mudaram: 0,
          erros: 0,
          arquivosMudaram: [],
        };

        log.info(chalk.bold(CliComandoFormatarMensagens.status.titulo));
        if (config.SCAN_ONLY) {
          log.aviso(CliComandoFormatarMensagens.erros.scanOnlyAviso);
        }

        const fileMap = await scanRepository(baseDir, {
          includeContent: true,
          filter: (relPath) => {
            // Se include foi informado, o scanner cuida do grosso; aqui garantimos
            // que o comando não tente formatar tipos fora do escopo suportado.
            return isFormatavel(relPath);
          },
        });

        const entries = Object.values(fileMap);
        result.total = entries.length;

        for (const e of entries) {
          const relPath = e.relPath;

          // Exclude deve funcionar mesmo quando include está ativo (scanner não aplica)
          if (excludeList.length && micromatch.isMatch(relPath, excludeList)) {
            continue;
          }

          // Include adicional (por segurança/consistência) — aceita match por glob ou caminho exato
          if (includeList.length) {
            const matchGlob = micromatch.isMatch(relPath, includeList);
            const matchExact = includeList.some(
              (p) => String(p).trim() === relPath,
            );
            if (!matchGlob && !matchExact) continue;
          }

          const src = typeof e.content === 'string' ? e.content : '';
          let resolved: { ok: boolean; error?: string; parser?: string; changed?: boolean; formatted?: string } | undefined;
          try {
            const res =
              engine === 'interno'
                ? formatarPrettierMinimo({ code: src, relPath })
                : engine === 'prettier'
                  ? await formatarComPrettierProjeto({
                    code: src,
                    relPath,
                    baseDir,
                  })
                  : (() => {
                    // auto: tenta prettier; se não disponível/sem parser, cai no interno.
                    return formatarComPrettierProjeto({
                      code: src,
                      relPath,
                      baseDir,
                    });
                  })();

            resolved =
              engine === 'auto'
                ? await (async () => {
                  const resultado = await res;
                  if (!resultado.ok) return resultado;
                  if (resultado.parser !== 'unknown') return resultado;
                  return formatarPrettierMinimo({ code: src, relPath });
                })()
                : (await Promise.resolve(res)) as unknown as import('@').FormatadorMinimoResult;
          } catch (error) {
            result.erros++;
            log.erro(CliComandoFormatarMensagens.erros.falhaExecucaoArquivo(relPath, error instanceof Error ? error.message : String(error)));
            continue;
          }

          if (!resolved || !resolved.ok) {
            result.erros++;
            log.erro(CliComandoFormatarMensagens.erros.falhaArquivo(relPath, resolved?.error || 'Unknown error'));
            continue;
          }

          if (resolved.parser === 'unknown') {
            continue;
          }

          result.formataveis++;

          if (!resolved.changed) {
            continue;
          }

          result.mudaram++;
          result.arquivosMudaram.push(relPath);

          if (write) {
            const abs = path.resolve(baseDir, relPath);
            await salvarEstado(abs, resolved.formatted);
          }
        }

        if (result.erros > 0) {
          log.erro(CliComandoFormatarMensagens.erros.totalErros(result.erros));
          sair(ExitCode.Failure);
          return;
        }

        if (check) {
          if (result.mudaram > 0) {
            log.aviso(CliComandoFormatarMensagens.status.precisamFormatacao(result.mudaram));
            sair(ExitCode.Failure);
            return;
          }
          log.sucesso(CliComandoFormatarMensagens.status.tudoFormatado);
          sair(ExitCode.Ok);
          return;
        }

        // write
        if (result.mudaram > 0) {
          log.sucesso(CliComandoFormatarMensagens.status.concluidoWrite(result.mudaram));
        } else {
          log.info(CliComandoFormatarMensagens.status.nenhumaMudanca);
        }
        sair(ExitCode.Ok);
      } catch (err) {
        log.erro(CliComandoFormatarMensagens.erros.falhaFormatar(err instanceof Error ? err.message : String(err)));
        sair(ExitCode.Failure);
      }
    });
}
