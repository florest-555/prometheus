// SPDX-License-Identifier: MIT-0
import path from 'node:path';

import { lerEstado, salvarEstado } from '@shared/persistence/persistencia.js';

import type { BaselineComAssinatura, GpgSignature,SnapshotBaseline  } from '@';

import { LINHA_BASE_CAMINHO } from '@guardian/constantes.js';

export const CURRENT_BASELINE_VERSION = 2;

async function lerBaselineCompleto(): Promise<BaselineComAssinatura | null> {
  try {
    const json = await lerEstado<BaselineComAssinatura>(LINHA_BASE_CAMINHO);
    if (json && typeof json === 'object' && !Array.isArray(json)) {
      const base = json as unknown as BaselineComAssinatura;
      if (base.snapshot && typeof base.snapshot === 'object') {
        return base;
      }
      const keys = Object.keys(json);
      if (keys.length > 0 && keys[0]?.startsWith('.')) {
        const entries = Object.entries(json as unknown as Record<string, string>).filter(([k, v]) => typeof k === 'string' && typeof v === 'string');
        return {
          snapshot: Object.fromEntries(entries) as Record<string, string>,
          version: 1
        };
      }
      return null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Le o baseline atual do sistema de integridade.
 * Retorna null se o arquivo não existir ou estiver malformado.
 */

export async function carregarBaseline(): Promise<SnapshotBaseline | null> {
  const completo = await lerBaselineCompleto();
  return completo?.snapshot ?? null;
}

export async function carregarAssinaturaBaseline(): Promise<GpgSignature | null | undefined> {
  const completo = await lerBaselineCompleto();
  return completo?.assinatura;
}

/**
 * Salva um novo baseline de integridade em disco, sobrescrevendo qualquer estado anterior.
 */

export async function salvarBaseline(snapshot: SnapshotBaseline, assinatura?: GpgSignature): Promise<void> {
  const fs = await import('node:fs');
  await fs.promises.mkdir(path.dirname(LINHA_BASE_CAMINHO), {
    recursive: true
  });
  const baselineCompleto: BaselineComAssinatura = {
    snapshot,
    assinatura,
    version: CURRENT_BASELINE_VERSION
  };
  await salvarEstado(LINHA_BASE_CAMINHO, baselineCompleto);
}