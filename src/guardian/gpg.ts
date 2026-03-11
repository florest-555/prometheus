// SPDX-License-Identifier: MIT-0
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';

import { config } from '@core/config/config.js';
import { log } from '@core/messages/index.js';

import type { GpgSignature, GpgVerificationResult } from '@';

const execFileAsync = promisify(execFile);

function shellEscape(str: string): string {
  if (str === '') {
    return "''";
  }
  return `'${str.replace(/'/g, `'\\''`)}'`;
}

export async function verificarGpgInstalado(): Promise<boolean> {
  try {
    await execFileAsync('gpg --version', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export async function listarChavesPublicas(): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync('gpg --list-keys --with-colons', { timeout: 10000 });
    const keys: string[] = [];
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.startsWith('uid:')) {
        const parts = line.split(':');
        if (parts[9]) {
          keys.push(parts[9]);
        }
      }
    }
    return keys;
  } catch {
    return [];
  }
}

export async function listarChavesPrivadas(): Promise<string[]> {
  try {
    const { stdout } = await execFileAsync('gpg', ['--list-secret-keys', '--with-colons'], { timeout: 10000 });
    const keys: string[] = [];
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.startsWith('uid:')) {
        const parts = line.split(':');
        if (parts[9]) {
          keys.push(parts[9]);
        }
      }
    }
    return keys;
  } catch {
    return [];
  }
}

export async function obterKeyIdPadrao(): Promise<string | null> {
  const chaveConfig = config.GUARDIAN_GPG_KEY_ID;
  if (chaveConfig) {
    return chaveConfig;
  }
  try {
    const { stdout } = await execFileAsync('gpg', ['--list-secret-keys', '--keyid-format', 'LONG', '--with-colons'], { timeout: 10000 });
    const lines = stdout.split('\n');
    for (const line of lines) {
      if (line.startsWith('sec:')) {
        const parts = line.split(':');
        const keyId = parts[4];
        if (keyId) {
          return keyId;
        }
      }
    }
  } catch {
  }
  return null;
}

export async function assinarConteudo(conteudo: string, keyId?: string): Promise<GpgSignature | null> {
  const gpgHabilitado = config.GUARDIAN_GPG_ENABLED;
  if (!gpgHabilitado) return null;

  const instalado = await verificarGpgInstalado();
  if (!instalado) {
    log.aviso('🛡️ GPG não instalado. Assinatura desabilitada.');
    return null;
  }

  const keyIdReal = keyId || await obterKeyIdPadrao();
  if (!keyIdReal) {
    log.aviso('🛡️ Nenhuma chave GPG encontrada. Assinatura desabilitada.');
    return null;
  }

  const { writeFile, unlink } = await import('node:fs/promises');
  const tempDir = await import('node:os').then(m => m.tmpdir());
  const tempInput = `${tempDir}/prometheus_gpg_sign_${Date.now()}.txt`;
  const tempOutput = `${tempDir}/prometheus_gpg_sign_${Date.now()}.asc`;

  try {
    await writeFile(tempInput, conteudo, 'utf-8');

    const passphrase = config.GUARDIAN_GPG_PASSPHRASE || '';
    let args = ['--batch', '--yes', '--armor', '--sign', '--local-user', keyIdReal, '--output', tempOutput, tempInput];

    if (passphrase) {
      const passFile = `${tempDir}/prometheus_gpg_pass_${Date.now()}.txt`;
      await writeFile(passFile, passphrase, 'utf-8');
      args = [...args.slice(0, -2), '--passphrase-file', passFile, ...args.slice(-2)];

      try {
        await execFileAsync('gpg', args);
      } finally {
        await unlink(passFile).catch(() => {});
      }
    } else {
      await execFileAsync('gpg', args);
    }

    const assinatura = await fs.readFile(tempOutput, 'utf-8');

    const { stdout } = await execFileAsync('gpg', ['--verify', '--keyid-format', 'LONG', tempOutput], { timeout: 10000 });

    let keyIdResult: string | undefined;
    const matchKeyId = stdout.match(/key\s+ID\s+([A-F0-9]+)/i);
    if (matchKeyId) {
      keyIdResult = matchKeyId[1];
    }

    return {
      assinatura,
      assinante: keyIdReal,
      keyId: keyIdResult,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    log.aviso(`🛡️ Erro ao assinar com GPG: ${err}`);
    return null;
  } finally {
    await unlink(tempInput).catch(() => {});
    await unlink(tempOutput).catch(() => {});
  }
}

export async function verificarAssinatura(conteudo: string, assinatura: string): Promise<GpgVerificationResult> {
  const gpgHabilitado = config.GUARDIAN_GPG_ENABLED;
  if (!gpgHabilitado) {
    return { valido: true, mensagem: 'GPG desabilitado, verificação por hash apenas' };
  }
  const instalado = await verificarGpgInstalado();
  if (!instalado) {
    return { valido: true, mensagem: 'GPG não instalado, verificação por hash apenas' };
  }
  try {
    const tempFile = `/tmp/prometheus_gpg_verify_${Date.now()}.sig`;
    const { writeFile, unlink } = await import('node:fs/promises');
    await writeFile(tempFile, assinatura, 'utf-8');
    const escapedConteudo = shellEscape(conteudo);
    const { stdout, stderr } = await execFileAsync(
      `echo -n ${escapedConteudo} | gpg --batch --verify ${tempFile} 2>&1`,
      { timeout: 30000 }
    );
    await unlink(tempFile);
    const output = stdout + stderr;
    if (output.includes('Good signature') || output.includes('Valida')) {
      let assinante: string | undefined;
      let keyId: string | undefined;
      const matchAssinante = output.match(/signature\s+from\s+["']([^"']+)["']/i) || output.match(/from\s+["']([^"']+)["']/i);
      const matchKeyId = output.match(/key\s+ID\s+([A-F0-9]+)/i);
      if (matchAssinante) {
        assinante = matchAssinante[1];
      }
      if (matchKeyId) {
        keyId = matchKeyId[1];
      }
      return {
        valido: true,
        assinante,
        keyId,
        mensagem: 'Assinatura válida'
      };
    }
    return {
      valido: false,
      mensagem: output.includes('BAD signature') ? 'Assinatura inválida' : 'Não foi possível verificar assinatura'
    };
  } catch (err) {
    const erroMsg = err instanceof Error ? err.message : String(err);
    return {
      valido: false,
      mensagem: `Erro ao verificar assinatura: ${erroMsg}`
    };
  }
}

export async function obterInfoChave(keyId: string): Promise<{ nome?: string; email?: string; keyId?: string } | null> {
  try {
    const { stdout } = await execFileAsync(`gpg --list-keys --keyid-format LONG ${keyId}`, { timeout: 10000 });
    const lines = stdout.split('\n');
    const currentKey: { nome?: string; email?: string; keyId?: string } = {};
    for (const line of lines) {
      if (line.startsWith('uid:')) {
        const parts = line.split(':');
        const uid = parts[9] || '';
        const nameMatch = uid.match(/^([^<]+)/);
        const emailMatch = uid.match(/<([^>]+)>/);
        if (nameMatch) {
          currentKey.nome = nameMatch[1].trim();
        }
        if (emailMatch) {
          currentKey.email = emailMatch[1].trim();
        }
      }
      if (line.startsWith('sec:')) {
        const parts = line.split(':');
        currentKey.keyId = parts[4];
      }
    }
    return currentKey.nome || currentKey.email ? currentKey : null;
  } catch {
    return null;
  }
}
