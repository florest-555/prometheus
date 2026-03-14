#!/usr/bin/env node
// SPDX-License-Identifier: MIT-0
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { registrarComandos } from '@cli/comandos.js';
import { comandoPerf } from '@cli/commands/index.js';
import { ExitCode, sair } from '@cli/helpers/exit-codes.js';
import chalk from '@core/config/chalk-safe.js';
import { aplicarConfigParcial, config, inicializarConfigDinamica } from '@core/config/config.js';
import { ICONES_NIVEL } from '@core/messages/index.js';
import type { ConversationMemory } from '@shared/memory.js';
import { getDefaultMemory } from '@shared/memory.js';
import { lerArquivoTexto } from '@shared/persistence/persistencia.js';
import type { CommanderError } from 'commander';
import { Command } from 'commander';

// [ALL] Flags globais aplicáveis em todos os comandos
import type { ErrorLike,PrometheusGlobalFlags } from '@';
import { extrairMensagemErro } from '@';

// caminho do módulo (usado para localizar arquivos de configuração)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// [PKG] Ler versão dinamicamente do package.json

async function getVersion(): Promise<string> {
  try {
    // Ao compilar, este arquivo vai para dist/bin; o package.json fica na raiz (subir dois níveis)
    const packageCaminho = join(__dirname, '..', '..', 'package.json');
    const raw = await lerArquivoTexto(packageCaminho);
    const pkg = raw ? JSON.parse(raw) : {};
    return pkg && (pkg as {
      version?: string;
    }).version || '0.0.0';
  } catch {
    return '0.0.0'; // fallback
  }
}

// [FIX]️ Configuração principal do CLI
const program = new Command();

// �️ Função para aplicar flags globais
async function aplicarFlagsGlobais(opts: unknown) {
  const flags = opts as PrometheusGlobalFlags;
  // Sanitização e normalização (pode lançar)
  try {
    // lazy import para não criar ciclo
    const {
      sanitizarFlags
    } = await import('@shared/validation/validacao.js');
    sanitizarFlags(flags as Record<string, unknown>);
  } catch (e) {
    // prometheus-ignore: console-in-production - CLI point de entrada precisa mostrar erros
    console.error(chalk.red(`${ICONES_NIVEL.erro} Flags inválidas: ${(e as Error).message}`));
    sair(ExitCode.InvalidUsage);
  }
  config.REPORT_SILENCE_LOGS = Boolean(flags.silence);
  config.REPORT_EXPORT_ENABLED = Boolean(flags.export);
  config.REPORT_EXPORT_FULL = Boolean((flags as Record<string, unknown>)['exportFull']);
  const debugAtivo = Boolean(flags.debug) || process.env.PROMETHEUS_DEBUG === 'true';
  config.DEV_MODE = debugAtivo;
  config.SCAN_ONLY = Boolean(flags.scanOnly);
  // Se silence está ativo, verbose é sempre falso
  config.VERBOSE = flags.silence ? false : Boolean(flags.verbose);
  const overrides: Record<string, unknown> = {};
  const optObj = opts as Record<string, unknown>;
  if (typeof optObj.logEstruturado === 'boolean') overrides.LOG_ESTRUTURADO = optObj.logEstruturado;
  if (typeof optObj.incremental === 'boolean') overrides.ANALISE_INCREMENTAL_ENABLED = optObj.incremental;
  if (typeof optObj.metricas === 'boolean') overrides.ANALISE_METRICAS_ENABLED = optObj.metricas;
  if (Object.keys(overrides).length) aplicarConfigParcial(overrides);
}

// [LINK] Registro de todos os comandos
registrarComandos(program, o => aplicarFlagsGlobais(o));
program.addCommand(comandoPerf());

// [SYS] Execução do CLI
// Carrega config de arquivo/env explicitamente no processo do CLI, mesmo sob VITEST (e2e spawn)
// NOTE: a execução principal foi extraída para `mainCli` para permitir testes que importam este
// módulo sem disparar automaticamente a execução (reduz falsos-positivos do analisador).
export async function mainCli(): Promise<void> {
  // Inicializa memória de conversas

  // Handler de rejeições não tratadas com mensagem identificável (usado por testes e ops)
  function __prometheus_unhandledRejectionHandler(err: ErrorLike) {
    const MARCADOR = 'Prometheus: unhandled rejection';
    const mensagem = extrairMensagemErro(err);
    // prometheus-ignore: console-in-production - handler de ultimo recurso para rejeicoes nao tratadas
    console.error(MARCADOR, mensagem);
    if (!process.env.VITEST) {
      if (err && typeof err === 'object' && 'stack' in err) {
        // prometheus-ignore: console-in-production - handler de ultimo recurso
        console.error((err as {
          stack?: string;
        }).stack);
      }
      process.exit(1);
    }
  }
  process.on('unhandledRejection', __prometheus_unhandledRejectionHandler);

  // Mantemos handler para exceções não capturadas — garante comportamento crítico em produção
  process.on('uncaughtException', (err: ErrorLike) => {
    const mensagem = extrairMensagemErro(err);
    // prometheus-ignore: console-in-production - handler de ultimo recurso para excecoes nao capturadas
    console.error(chalk.red(`${ICONES_NIVEL.erro} Exceção não capturada: ${mensagem}`));
    if (err && typeof err === 'object' && 'stack' in err) {
      // prometheus-ignore: console-in-production - handler de ultimo recurso
      console.error((err as {
        stack?: string;
      }).stack);
    }
    // só encerra fora do ambiente de teste
    if (!process.env.VITEST) sair(ExitCode.Critical);
  });
  let memoria: ConversationMemory | undefined;
  try {
    memoria = await getDefaultMemory();
  } catch (e) {
    console.debug(`[DEBUG] getDefaultMemory falhou: ${e instanceof Error ? e.message : String(e)}`);
  }
  // Aplica defaults de produção (se presentes) antes de inicializar a config dinâmica.
  try {
    if (process.env.NODE_ENV === 'production') {
      try {
        // Em dist/bin, o safe config está na raiz do pacote: subir dois níveis
        const safeCfgCaminho = join(__dirname, '..', '..', 'prometheus.config.safe.json');
        const raw = await lerArquivoTexto(safeCfgCaminho);
        const safeCfg = raw ? JSON.parse(raw) : {};
        const prod = safeCfg?.productionDefaults;
        if (prod && typeof prod === 'object') {
          for (const [k, v] of Object.entries(prod)) {
            if (process.env[k] === undefined) process.env[k] = String(v);
          }
        }
      } catch {
        // ignore - arquivo safe pode não existir em todos os ambientes
      }
    }
    // Atualiza a versão do programa de forma assíncrona antes do parse
    try {
      const versionNumber = await getVersion();
      // commander expõe private API ._version; usar método público quando disponível
      if (typeof (program as unknown as {
        version: (v: string) => void;
      }).version === 'function') {
        (program as unknown as {
          version: (v: string) => void;
        }).version(versionNumber);
      } else {
        // fallback defensivo
        (program as unknown as {
          _version?: string;
        })._version = versionNumber;
      }
    } catch (e) {
      console.debug(`[DEBUG] getVersion falhou: ${e instanceof Error ? e.message : String(e)}`);
    }
    await inicializarConfigDinamica();
  } catch (e) {
    console.debug(`[DEBUG] Inicialização falhou: ${e instanceof Error ? e.message : String(e)}`);
  }
  // Antes de parsear, trata flags de histórico simples
  const argv = process.argv.slice(2);
  if (argv.includes('--historico')) {
    if (memoria) {
      const resumo = memoria.getSummary();
      console.log(chalk.cyan('\n[STATS] RESUMO DA CONVERSA'));
      console.log(`Total: ${resumo.totalMessages}`);
      console.log(`Usuário: ${resumo.userMessages}`);
      console.log(`Prometheus: ${resumo.assistantMessages}`);
      if (resumo.firstMessage) console.log(`Primeira: ${resumo.firstMessage}`);
      if (resumo.lastMessage) console.log(`Última: ${resumo.lastMessage}`);
      console.log('');
    } else {
      console.log(chalk.yellow('Histórico indisponível.'));
    }
    return; // encerra após exibir
  }
  if (argv.includes('--limpar-historico')) {
    if (memoria) await memoria.clear();
    console.log(chalk.green('Histórico limpo.'));
    return;
  }

  // Registra a execução atual no histórico
  try {
    await memoria?.addMessage({
      role: 'user',
      content: `Execução CLI: ${argv.join(' ') || '(sem argumentos)'}`,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.debug(`[DEBUG] addMessage falhou: ${e instanceof Error ? e.message : String(e)}`);
  }

  // Intercepta erros de uso do Commander e mapeia para exit code 3
  program.exitOverride((err: CommanderError) => {
    const code = err?.code || '';
    const isUsoInvalido = code === 'commander.unknownCommand' || code === 'commander.unknownOption' || code === 'commander.missingArgument' || code === 'commander.optionMissingArgument' || code === 'commander.missingMandatoryOptionValue' || code === 'commander.invalidArgument';
    if (isUsoInvalido) {
      // prometheus-ignore: console-in-production - CLI precisa mostrar erros de uso
      console.error(chalk.red(`${ICONES_NIVEL.erro} ${err.message}`));
      sair(ExitCode.InvalidUsage);
      return;
    }
    throw err;
  });
  await program.parseAsync(process.argv);
}

// Global handler para reduzir falsos-positivos e capturar rejeições não tratadas.
// A mensagem contém um marcador único para que testes possam verificar o registro.
function __prometheus_unhandledRejectionHandler(err: ErrorLike) {
  const MARCADOR = 'Prometheus: unhandled rejection';
  const mensagem = extrairMensagemErro(err);
  // Mensagem identificável: usada pelos testes unitários para detectar o handler
  // e por operadores para diagnóstico rápido.

  // prometheus-ignore: console-in-production - handler de ultimo recurso
  console.error(MARCADOR, mensagem);
  // Em ambiente de testes preferimos não encerrar o processo — mantém compatibilidade com Vitest.
    if (!process.env.VITEST) {
    if (err && typeof err === 'object' && 'stack' in err) {
      // imprime stack em produção para diagnóstico
      // prometheus-ignore: console-in-production - stack trace para debug
      console.error((err as {
        stack?: string;
      }).stack);
    }
    process.exit(1);
  }
}
process.on('unhandledRejection', __prometheus_unhandledRejectionHandler);

// Invoca a função principal apenas quando o arquivo for executado como entrypoint.
// Isso evita efeitos colaterais ao importar o módulo em testes ou ferramentas de análise.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && process.argv[1].endsWith('/bin/cli.js')) {
  mainCli().catch(err => {
    // mantém comportamento compatível em produção — mas evita exit em VITEST
    const mensagem = extrairMensagemErro(err);
    // prometheus-ignore: console-in-production - CLI point de entrada precisa mostrar erros
    console.error(chalk.red(`${ICONES_NIVEL.erro} ${mensagem}`));
    if (err && typeof err === 'object' && 'stack' in err) {
      // prometheus-ignore: console-in-production - stack trace soh em DEV
      console.error((err as {
        stack?: string;
      }).stack);
    }
    if (!process.env.VITEST) process.exit(1);
  });
} else {
  // Ao importar (ex.: Vitest), não executamos a CLI automaticamente — ainda registramos o handler acima.
}