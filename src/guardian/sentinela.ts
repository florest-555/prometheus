// SPDX-License-Identifier: MIT-0
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { config } from '@core/config/config.js';
import { log } from '@core/messages/index.js';
import { carregarAssinaturaBaseline, carregarBaseline, salvarBaseline } from '@guardian/baseline.js';
import { LINHA_BASE_CAMINHO } from '@guardian/constantes.js';
import { diffSnapshots, verificarErros } from '@guardian/diff.js';
import { assinarConteudo, verificarAssinatura, verificarGpgInstalado } from '@guardian/gpg.js';
import { gerarSnapshotDoConteudo } from '@guardian/hash.js';
import micromatch from 'micromatch';

import type { FileEntry, Snapshot } from '@';
import { GuardianError, IntegridadeStatus } from '@';

function construirSnapshot(fileEntries: FileEntry[]): Snapshot {
  const snapshot: Snapshot = {};
  for (const {
    relPath,
    content
  } of fileEntries) {
    if (typeof content !== 'string' || !content.trim()) continue;
    try {
      snapshot[relPath] = gerarSnapshotDoConteudo(content);
    } catch (err) {
      log.aviso(`x Falha ao gerar hash de ${relPath}: ${typeof err === 'object' && err && 'message' in err ? (err as {
        message: string;
      }).message : String(err)}`);
    }
  }
  return snapshot;
}
export async function scanSystemIntegrity(fileEntries: FileEntry[], options?: {
  justDiff?: boolean;
  suppressLogs?: boolean;
}): Promise<{
  status: IntegridadeStatus;
  timestamp: string;
  detalhes?: string[];
  baselineModificado?: boolean;
}> {
  const agora = new Date().toISOString();
  await fs.mkdir(path.dirname(LINHA_BASE_CAMINHO), {
    recursive: true
  });
  let baselineAnterior: Snapshot | null = null;
  try {
    baselineAnterior = await carregarBaseline();
  } catch (err) {
    log.aviso(`[!]️ Baseline inválido ou corrompido: ${typeof err === 'object' && err && 'message' in err ? (err as {
      message: string;
    }).message : String(err)}`);
  }

  // Filtra entradas conforme padrões ignorados específicos do Guardian
  const ignorados = config.INCLUDE_EXCLUDE_RULES && config.INCLUDE_EXCLUDE_RULES.globalExcludeGlob || [];
  const filtrados = fileEntries.filter(f => {
    const rel = f.relPath.replace(/\\/g, '/');
    return !micromatch.isMatch(rel, ignorados);
  });
  if (config.DEV_MODE) {
    const removidos = fileEntries.length - filtrados.length;
    log.info(`[CONF]️ Guardian filtro aplicado: ${filtrados.length} arquivos considerados (removidos ${removidos}).`);
  }
  const snapshotAtual = construirSnapshot(filtrados);
  if (!baselineAnterior) {
    if (options?.justDiff) {
      return {
        status: IntegridadeStatus.Ok,
        timestamp: agora,
        detalhes: []
      };
    }
    const gpgHabilitado = config.GUARDIAN_GPG_ENABLED;
    if (gpgHabilitado && config.GUARDIAN_GPG_KEY_ID) {
      const gpgInstalado = await verificarGpgInstalado();
      if (gpgInstalado && !options?.suppressLogs) {
        log.info(`[GUARD]️ Guardian: GPG habilitado, assinatura será aplicada.`);
      }
    }
    if (!options?.suppressLogs) {
      log.info(`🆕 Guardian: baseline inicial criado.`);
    }
    const jsonString = JSON.stringify(snapshotAtual);
    const assinatura = await assinarConteudo(jsonString);
    await salvarBaseline(snapshotAtual, assinatura ?? undefined);
    return {
      status: IntegridadeStatus.Criado,
      timestamp: agora
    };
  }
  if (process.argv.includes('--aceitar')) {
    if (!options?.suppressLogs) {
      log.info(`[OK] Guardian: baseline aceito manualmente (--aceitar).`);
    }
    const jsonString = JSON.stringify(snapshotAtual);
    const assinatura = await assinarConteudo(jsonString);
    await salvarBaseline(snapshotAtual, assinatura ?? undefined);
    return {
      status: IntegridadeStatus.Aceito,
      timestamp: agora
    };
  }
  const gpgHabilitado = config.GUARDIAN_GPG_ENABLED;
  if (gpgHabilitado && !options?.suppressLogs) {
    const assinaturaSalva = await carregarAssinaturaBaseline();
    if (assinaturaSalva) {
      const baselineJson = JSON.stringify(baselineAnterior);
      const verificacao = await verificarAssinatura(baselineJson, assinaturaSalva.assinatura);
      if (verificacao.valido) {
        log.info(`[GUARD]️ Guardian: assinatura GPG verificada - ${verificacao.assinante || 'OK'}`);
      } else {
        log.aviso(`[GUARD]️ Guardian: [!]️ assinatura GPG INVÁLIDA - ${verificacao.mensagem}`);
        if (!options?.justDiff) {
          const errorDetails: import('@').GuardianErrorDetails[] = [{
            tipo: 'assinatura-invalida',
            mensagem: `Assinatura GPG inválida: ${verificacao.mensagem}`
          }];
          throw new GuardianError(errorDetails);
        }
      }
    } else if (!config.GUARDIAN_GPG_KEY_ID) {
      log.aviso(`[GUARD]️ Guardian: GPG habilitado mas sem chave configurada, usando apenas hash`);
    }
  }
  const diffs = diffSnapshots(baselineAnterior, snapshotAtual);
  const erros = verificarErros(diffs);
  if (options?.justDiff) {
    return {
      status: erros.length ? IntegridadeStatus.AlteracoesDetectadas : IntegridadeStatus.Ok,
      timestamp: agora,
      detalhes: erros
    };
  }
  if (erros.length) {
    // Converter strings para GuardianErrorDetails
    const errorDetails: import('@').GuardianErrorDetails[] = erros.map(erro => ({
      tipo: 'integridade',
      mensagem: erro
    }));
    throw new GuardianError(errorDetails);
  }
  return {
    status: IntegridadeStatus.Ok,
    timestamp: agora
  };
}
export async function acceptNewBaseline(fileEntries: FileEntry[]): Promise<void> {
  const ignorados = config.INCLUDE_EXCLUDE_RULES?.globalExcludeGlob || [];
  const filtrados = fileEntries.filter(f => {
    const rel = f.relPath.replace(/\\/g, '/');
    return !micromatch.isMatch(rel, ignorados);
  });
  const snapshotAtual = construirSnapshot(filtrados);
  await salvarBaseline(snapshotAtual);
}