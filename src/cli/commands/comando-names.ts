// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: CLI command que pré-carrega conteúdos antes do processamento

import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import { getSourceFiles } from '@cli/helpers/get-files-src.js';
import chalk from '@core/config/chalk-safe.js';
import { CliComandoNamesMensagens } from '@core/messages/cli/cli-comando-names-messages.js';
import { log } from '@core/messages/index.js';
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const traverse = traverseModule.default || traverseModule;

export function comandoNames(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  return new Command('names')
    .description(CliComandoNamesMensagens.descricao)
    .option('--legacy', CliComandoNamesMensagens.opcoes.legacy, false)
    .action(async function (this: Command, opts: {
    legacy?: boolean;
  }) {
      try {
        await aplicarFlagsGlobais(
          this.parent && typeof this.parent.opts === 'function'
            ? this.parent.opts()
            : {},
        );
      } catch (err) {
        log.erro(CliComandoNamesMensagens.erros.falhaFlags(err instanceof Error ? err.message : String(err)));
        sair(ExitCode.Failure);
        return;
      }

      const RAIZ_DIR = process.cwd();
      const SRC_DIR = path.resolve(RAIZ_DIR, 'src');
      const SAIDA_DIR = path.resolve(RAIZ_DIR, 'names');

      if (!fs.existsSync(SAIDA_DIR)) {
        fs.mkdirSync(SAIDA_DIR, { recursive: true });
      }

      log.info(chalk.cyan(CliComandoNamesMensagens.status.inicio));

      const files = getSourceFiles(SRC_DIR);
      const allNomes = new Set<string>();
      let arquivosComNomes = 0;

      // Pre-load all file contents to avoid blocking operations in loop
      const fileContents: Map<string, string> = new Map();
      for (const file of files) {
        try {
          fileContents.set(file, fs.readFileSync(file, 'utf-8'));
        } catch {
          // Skip files that can't be read
        }
      }

      // Now process the pre-loaded contents
      for (const [file, code] of fileContents) {
        try {
          const ast = parse(code, {
            sourceType: 'module',
            plugins: ['typescript', 'decorators-legacy'],
          });

          const variableNomes = new Set<string>();
          traverse(ast, {
            VariableDeclarator(path) {
              if (path.node.id.type === 'Identifier') {
                const name = path.node.id.name;
                variableNomes.add(name);
                allNomes.add(name);
              }
            },
          });

          if (variableNomes.size > 0) {
            const relPath = path.relative(SRC_DIR, file);
            const outRelPath = relPath.replace(/\.(ts|js)$/i, '.txt');
            const outFile = path.join(SAIDA_DIR, outRelPath);
            const outDir = path.dirname(outFile);
            if (!fs.existsSync(outDir)) {
              fs.mkdirSync(outDir, { recursive: true });
            }
            const sorted = Array.from(variableNomes).sort();
            const content = sorted.map((name) => `${name} = `).join('\n');
            fs.writeFileSync(outFile, content);
            arquivosComNomes++;
          }
        } catch {
          // prometheus-ignore: console-in-production - erro precisa ser mostrado
          console.warn(CliComandoNamesMensagens.erros.erroProcessar(path.relative(RAIZ_DIR, file)));
        }
      }

      if (opts.legacy) {
        const SAIDA_ARQUIVO = path.resolve(SAIDA_DIR, 'name.txt');
        const sortedNomes = Array.from(allNomes).sort();
        const content = sortedNomes.map(name => `${name} = `).join('\n');
        fs.writeFileSync(SAIDA_ARQUIVO, content);
        const relSaida = path.relative(RAIZ_DIR, SAIDA_ARQUIVO);
        log.sucesso(CliComandoNamesMensagens.status.concluidoLegacy(sortedNomes.length, arquivosComNomes, chalk.bold(relSaida)));
      } else {
        log.sucesso(CliComandoNamesMensagens.status.concluido(allNomes.size, arquivosComNomes));
      }
    });
}
