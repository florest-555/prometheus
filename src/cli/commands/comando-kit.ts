// SPDX-License-Identifier: MIT-0
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import { CliComandoKitMensagens } from '@core/messages/cli/cli-comando-kit-messages.js';
import { log } from '@core/messages/index.js';
import { executarShellSeguro } from '@core/utils/exec-safe.js';
import { lerArquivoTexto } from '@shared/persistence/persistencia.js';
import { Command } from 'commander';

type ParentOpts = {
  opts?: () => Record<string, unknown>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolverRaizKit(): string {
  const packageRoot = join(__dirname, '..', '..', '..');
  const distKit = join(packageRoot, 'dist', 'kit');
  if (existsSync(distKit)) return distKit;
  return join(packageRoot, 'src', 'kit');
}

function resolverDocsKit(): string {
  const packageRoot = join(__dirname, '..', '..', '..');
  const distDocs = join(packageRoot, 'dist', 'kit');
  if (existsSync(distDocs)) return distDocs;
  const srcDocs = join(packageRoot, 'docs', 'kit');
  if (existsSync(srcDocs)) return srcDocs;
  return join(packageRoot, 'src', 'kit');
}

const SCRIPTS: Record<string, { file: string; descricao: string }> = {
  kit: { file: 'shell/kit.sh', descricao: CliComandoKitMensagens.scripts.kit },
  'update-system': { file: 'shell/update-system.sh', descricao: CliComandoKitMensagens.scripts.updateSystem },
  'disk-usage': { file: 'shell/disk-usage.sh', descricao: CliComandoKitMensagens.scripts.diskUsage },
  'network-tools': { file: 'shell/network-tools.sh', descricao: CliComandoKitMensagens.scripts.networkTools },
  'backup-dotfiles': { file: 'shell/backup-dotfiles.sh', descricao: CliComandoKitMensagens.scripts.backupDotfiles },
  'git-helper': { file: 'shell/git-helper.sh', descricao: CliComandoKitMensagens.scripts.gitHelper },
  'init-git-repo': { file: 'shell/init-git-repo.sh', descricao: CliComandoKitMensagens.scripts.initGitRepo },
  'setup-github-ssh': { file: 'shell/setup-github-ssh.sh', descricao: CliComandoKitMensagens.scripts.setupGithubSsh },
  'system-info': { file: 'shell/system-info.sh', descricao: CliComandoKitMensagens.scripts.systemInfo },
};

const DOCS: Record<string, { file: string; descricao: string }> = {
  'kit-versao': { file: 'kit-versao.md', descricao: CliComandoKitMensagens.docs.kitVersao },
  'kit-intro': { file: 'kit-intro.md', descricao: CliComandoKitMensagens.docs.kitIntro },
  'git-cheatsheet': { file: 'git-cheatsheet.md', descricao: CliComandoKitMensagens.docs.gitCheatsheet },
  'linux-commands': { file: 'linux-commands.md', descricao: CliComandoKitMensagens.docs.linuxCommands },
  'git-init-guide': { file: 'git-init-guide.md', descricao: CliComandoKitMensagens.docs.gitInitGuide },
  'system-info-guide': { file: 'system-info-guide.md', descricao: CliComandoKitMensagens.docs.systemInfoGuide },
};

function quoteArg(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function listarEntradas(map: Record<string, { descricao: string }>): string {
  return Object.entries(map)
    .map(([k, v]) => `- ${k}: ${v.descricao}`)
    .join('\n');
}

export function comandoKit(
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Command {
  const comando = new Command('kit')
    .description(CliComandoKitMensagens.descricao)
    .action(async function (this: Command) {
      if (!(await aplicarFlags(this, aplicarFlagsGlobais))) return;
      await executarScript('kit', []);
    });

  comando
    .command('list')
    .description(CliComandoKitMensagens.opcoes.list)
    .action(async function (this: Command) {
      if (!(await aplicarFlags(this, aplicarFlagsGlobais))) return;
      log.info(CliComandoKitMensagens.status.listaScripts);
      log.info(listarEntradas(SCRIPTS));
      log.info('');
      log.info(CliComandoKitMensagens.status.listaDocs);
      log.info(listarEntradas(DOCS));
    });

  comando
    .command('run')
    .description(CliComandoKitMensagens.opcoes.run)
    .argument('<script>', CliComandoKitMensagens.opcoes.script)
    .argument('[args...]', CliComandoKitMensagens.opcoes.args)
    .allowUnknownOption(true)
    .action(async function (this: Command, script: string, args: string[]) {
      if (!(await aplicarFlags(this, aplicarFlagsGlobais))) return;
      await executarScript(script, args || []);
    });

  comando
    .command('docs')
    .description(CliComandoKitMensagens.opcoes.docs)
    .argument('<doc>', CliComandoKitMensagens.opcoes.doc)
    .action(async function (this: Command, doc: string) {
      if (!(await aplicarFlags(this, aplicarFlagsGlobais))) return;
      const docsRoot = resolverDocsKit();
      const entry = DOCS[doc];
      if (!entry) {
        log.erro(CliComandoKitMensagens.erros.docInvalido(doc));
        log.info(CliComandoKitMensagens.status.dicaDocs);
        log.info(listarEntradas(DOCS));
        sair(ExitCode.InvalidUsage);
        return;
      }
      const docPath = join(docsRoot, entry.file);
      if (!existsSync(docPath)) {
        log.erro(CliComandoKitMensagens.erros.docNaoEncontrado(docPath));
        sair(ExitCode.Failure);
        return;
      }
      const conteudo = await lerArquivoTexto(docPath);
      if (!conteudo) {
        log.erro(CliComandoKitMensagens.erros.docVazio(docPath));
        sair(ExitCode.Failure);
        return;
      }
      // Renderiza markdown cru no terminal
      // prometheus-ignore: console-in-production - saída de documentação é comportamento esperado
      console.log(conteudo);
    });

  return comando;
}

async function aplicarFlags(
  comando: Command,
  aplicarFlagsGlobais: (opts: Record<string, unknown>) => void,
): Promise<boolean> {
  try {
    await aplicarFlagsGlobais(
      (comando.parent as ParentOpts | undefined)?.opts?.() || {},
    );
    return true;
  } catch (err) {
    log.erro(CliComandoKitMensagens.erros.falhaFlags(err instanceof Error ? err.message : String(err)));
    sair(ExitCode.Failure);
    return false;
  }
}

async function executarScript(script: string, args: string[]): Promise<void> {
  const kitRoot = resolverRaizKit();
  const entry = SCRIPTS[script];
  if (!entry) {
    log.erro(CliComandoKitMensagens.erros.scriptInvalido(script));
    log.info(CliComandoKitMensagens.status.dicaScripts);
    log.info(listarEntradas(SCRIPTS));
    sair(ExitCode.InvalidUsage);
    return;
  }
  const scriptPath = join(kitRoot, entry.file);
  if (!existsSync(scriptPath)) {
    log.erro(CliComandoKitMensagens.erros.scriptNaoEncontrado(scriptPath));
    sair(ExitCode.Failure);
    return;
  }
  const cmd = ['bash', scriptPath, ...args].map(quoteArg).join(' ');
  try {
    executarShellSeguro(cmd, { stdio: 'inherit' });
  } catch (err) {
    log.erro(CliComandoKitMensagens.erros.falhaExecucao(err instanceof Error ? err.message : String(err)));
    sair(ExitCode.Failure);
  }
}
