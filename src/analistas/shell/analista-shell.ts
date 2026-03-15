// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: Shell scripts são analisados via texto, não AST - padrões simples são suficientes

import { ShellMensagens } from '@core/messages/analistas/analista-shell-messages.js';
import { detectarContextoProjeto } from '@shared/contexto-projeto.js';

import type { ContextoExecucao, Ocorrencia, TecnicaAplicarResultado } from '@';
import { criarOcorrencia } from '@';
import type { ProblemaShell } from '@pt-types/shell.js';

const LIMITE_SHELL = {
  MAX_GLOBAL_VARS: 0,
  MAX_BACKTICKS: 0,
  MAX_UMASK: 0,
  MAX_SUDO_WITHOUT_CHECK: 0,
  MAX_CHMOD_777: 0,
  MAX_CAT_PIPING: 0,
  MAX_GREP_V: 0,
  MAX_TRAILING_NEWLINE: 0
};

function detectarProblemasShell(src: string, relPath: string): ProblemaShell[] {
  const problemas: ProblemaShell[] = [];
  const linhas = src.split('\n');

  linhas.forEach((linha, idx) => {
    const numeroLinha = idx + 1;
    const trimmed = linha.trim();

    if (trimmed.startsWith('#')) return;

    if (/^(?!if|for|while|case|then|else|elif|do|function\s)\s*[^#]*=\s*[^{}/\\]+$/i.test(trimmed) && !trimmed.includes('declare') && !trimmed.includes('local') && !trimmed.includes('export') && !trimmed.includes('==') && !trimmed.includes('!=') && !trimmed.includes('=~') && !trimmed.includes('=>')) {
      if (!trimmed.includes('readonly') && !trimmed.includes('const')) {
        problemas.push({
          tipo: 'global-var-sem-declaracao',
          nivel: 'aviso',
          mensagem: ShellMensagens.globalVarSemDeclaracao(trimmed.split('=')[0].trim()),
          linha: numeroLinha,
          contexto: trimmed.substring(0, 80)
        });
      }
    }

    if (/\beval\s+/.test(trimmed) || /\bxargs\s+.*\beval\b/.test(trimmed)) {
      problemas.push({
        tipo: 'eval-usado',
        nivel: 'erro',
        mensagem: ShellMensagens.evalUsado,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/(?:^|[&|;])\s*rm\s+(-[rfv]+\s+)*[${}\*?]+\s*(?:[&|;]|$)/.test(trimmed) && !trimmed.includes('-i') && !trimmed.includes('--interactive')) {
      problemas.push({
        tipo: 'rm-wildcard-sem-confirmacao',
        nivel: 'erro',
        mensagem: ShellMensagens.rmWildcardSemConfirmacao,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/chmod\s+[0-7]{3,4}\s/.test(trimmed)) {
      const perms = trimmed.match(/chmod\s+([0-7]{3,4})/);
      if (perms && perms[1].includes('7')) {
        problemas.push({
          tipo: 'chmod-777',
          nivel: 'erro',
          mensagem: ShellMensagens.chmod777(perms[1]),
          linha: numeroLinha,
          contexto: trimmed.substring(0, 80)
        });
      }
    }

    if (/\bsudo\s+[^(&|;]+$/.test(trimmed) && !trimmed.includes('-n') && !trimmed.includes('--non-interactive')) {
      problemas.push({
        tipo: 'sudo-sem-check',
        nivel: 'aviso',
        mensagem: ShellMensagens.sudoSemCheck,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/umask\s+[0-7]{3,4}/.test(trimmed)) {
      problemas.push({
        tipo: 'umask-trocado',
        nivel: 'info',
        mensagem: ShellMensagens.umaskTrocado,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/(cat|head|tail|grep)\s+[^|]*\|\s*(cat|head|tail|grep|wc)/.test(trimmed)) {
      problemas.push({
        tipo: 'pipe-desnecessario',
        nivel: 'info',
        mensagem: ShellMensagens.pipeDesnecessario,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/\$\([^)]+\)\s*\|/.test(trimmed) || /`[^`]+`\s*\|/.test(trimmed)) {
      problemas.push({
        tipo: 'subshell-pipe',
        nivel: 'info',
        mensagem: ShellMensagens.subshellPipe,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/grep\s+-v\s+/.test(trimmed)) {
      problemas.push({
        tipo: 'grep-v-desnecessario',
        nivel: 'info',
        mensagem: ShellMensagens.grepVDesnecessario,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/set\s+-[a-z]*e\b/.test(trimmed) && !trimmed.includes('-o errexit')) {
      problemas.push({
        tipo: 'set-e-sem-trap',
        nivel: 'aviso',
        mensagem: ShellMensagens.setESemTrap,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/echo\s+["']?\$[A-Z_][A-Z0-9_]*["']?/.test(trimmed) || /printf\s+["']?%s["']?\s+\$?[A-Z_]/.test(trimmed)) {
      if (!trimmed.includes('-e') && !trimmed.includes('%%')) {
        problemas.push({
          tipo: 'var-env-sem-aspas',
          nivel: 'aviso',
          mensagem: ShellMensagens.varEnvSemAspas,
          linha: numeroLinha,
          contexto: trimmed.substring(0, 80)
        });
      }
    }

    if (/find\s+[^-]*\s+-exec\s+[^;]+;\s*$/.test(trimmed) && !trimmed.includes('{} +')) {
      problemas.push({
        tipo: 'find-exec-sem-plus',
        nivel: 'info',
        mensagem: ShellMensagens.findExecSemPlus,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/curl\s+[^|]*\s*\|\s*sh\b/.test(trimmed) || /wget\s+[^|]*\s*\|\s*sh\b/.test(trimmed)) {
      problemas.push({
        tipo: 'pipe-para-sh-risco',
        nivel: 'erro',
        mensagem: ShellMensagens.pipeParaShRisco,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/\.\s*[a-zA-Z0-9_-]+\s*$/.test(trimmed) && !trimmed.includes('source ') && !trimmed.includes('. ')) {
      problemas.push({
        tipo: 'source-sem-explicit',
        nivel: 'info',
        mensagem: ShellMensagens.sourceSemExplicit,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/exit\s+[0-9]+\s*$/.test(trimmed) && !trimmed.includes('EXIT')) {
      const exitCode = trimmed.match(/exit\s+(\d+)/);
      if (exitCode && parseInt(exitCode[1]) > 0 && !trimmed.includes('set -o pipefail')) {
        problemas.push({
          tipo: 'exit-codigo-sem-pipefail',
          nivel: 'info',
          mensagem: ShellMensagens.exitCodigoSemPipefail,
          linha: numeroLinha,
          contexto: trimmed.substring(0, 80)
        });
      }
    }

    if (/command\s+[^-]/.test(trimmed) && !trimmed.includes('command -v') && !trimmed.includes('command -')) {
      problemas.push({
        tipo: 'command-usado-incorrect',
        nivel: 'info',
        mensagem: ShellMensagens.commandUsadoIncorrect,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/if\s*\[\[?.+\]\]/i.test(trimmed) && /==/.test(trimmed)) {
      if (!trimmed.includes('=~') && !trimmed.includes('==')) {
        problemas.push({
          tipo: 'comparacao-string-incorreta',
          nivel: 'aviso',
          mensagem: ShellMensagens.comparacaoStringIncorreta,
          linha: numeroLinha,
          contexto: trimmed.substring(0, 80)
        });
      }
    }

    if (/\[\s+[^\]]+\s+-eq\s+[^\]]+\s*\]/.test(trimmed) || /\[\s+[^\]]+\s+-ne\s+[^\]]+\s*\]/.test(trimmed)) {
      problemas.push({
        tipo: 'teste-aritmetico-com-brackets',
        nivel: 'aviso',
        mensagem: ShellMensagens.testeAritmeticoComBrackets,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (linhas.length > 0 && idx === linhas.length - 1 && trimmed.length > 0 && !trimmed.endsWith('\n')) {
    }

    if (/tee\s+[^\|]*\.log/.test(trimmed) && !trimmed.includes('>>')) {
      problemas.push({
        tipo: 'tee-sem-append',
        nivel: 'info',
        mensagem: ShellMensagens.teeSemAppend,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }

    if (/sed\s+-[^i]*i[^e]/.test(trimmed)) {
      problemas.push({
        tipo: 'sed-inplace-sem-backup',
        nivel: 'aviso',
        mensagem: ShellMensagens.sedInplaceSemBackup,
        linha: numeroLinha,
        contexto: trimmed.substring(0, 80)
      });
    }
  });

  return problemas;
}

export const analistaShell = {
  nome: 'shell-bash-boas-praticas',
  categoria: 'shell',
  descricao: 'Detecta anti-patterns e boas práticas em scripts Shell/Bash',
  limites: LIMITE_SHELL,
  test: (relPath: string): boolean => {
    return /\.(sh|bash|zsh|fish)$/i.test(relPath) && !relPath.includes('/src/');
  },
  aplicar: async (src: string, relPath: string, _ast: unknown, _fullPath?: string, _contexto?: ContextoExecucao): Promise<TecnicaAplicarResultado> => {
    if (!src || !src.trim()) return [];

    const contextoProjeto = detectarContextoProjeto({
      arquivo: relPath,
      conteudo: src,
      relPath
    });

    const problemas = detectarProblemasShell(src, relPath);

    const ocorrencias: Ocorrencia[] = [];

    for (const problema of problemas) {
      ocorrencias.push(criarOcorrencia({
        tipo: problema.tipo,
        nivel: problema.nivel,
        mensagem: problema.mensagem,
        relPath,
        linha: problema.linha,
        coluna: problema.coluna
      }));
    }

    return ocorrencias;
  }
};

export default analistaShell;
