// SPDX-License-Identifier: MIT-0
import { execFile as _execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { DisclaimerOptions } from '../types/licensas.js';

function execFileAsync(cmd: string, args: string[], opts: Record<string, unknown> = {}): Promise<{
  stdout: string;
  stderr: string;
}> {
  return new Promise((resolve, reject) => {
    _execFile(cmd, args, {
      shell: false,
      ...opts
    }, (err: Error | null, stdout: string | Buffer, stderr: string | Buffer) => {
      if (err) return reject(Object.assign(err, {
        stdout,
        stderr
      }));
      resolve({
        stdout: String(stdout || ''),
        stderr: String(stderr || '')
      });
    });
  });
}
const defaultDisclaimerCaminho = 'docs/partials/AVISO-PROVENIENCIA.md';
const marker = /Proveni[^\s]{1,5}ncia|Autoria/i;
async function listMarkdown(root: string): Promise<string[]> {
  try {
    const {
      stdout
    } = await execFileAsync('git', ['ls-files', '*.md'], {
      cwd: root
    });
    return stdout.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  } catch {
    async function walk(dir: string): Promise<string[]> {
      const out: string[] = [];
      const entries = await fs.readdir(dir).catch(() => []);
      for (const e of (entries as any)) {
        const name = typeof e === 'string' ? e : e.name;
        const p = path.join(dir, name);
        const stat = await fs.stat(p).catch(() => null);
        if (!stat) continue;
        if (stat.isDirectory()) {
          if (/^(node_modules|dist|\.git|pre-public|preview-prometheus|preview-i-c-l-org|coverage|relatorios|\.prometheus)$/i.test(name)) continue;
          out.push(...(await walk(p)));
        } else if (/\.md$/i.test(name)) {
          out.push(path.relative(root, p));
        }
      }
      return out;
    }
    return walk(root);
  }
}
async function hasDisclaimer(absPath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(absPath, 'utf8');
    const head = content.split('\n').slice(0, 30).join('\n');
    return marker.test(head);
  } catch {
    return false;
  }
}
function shouldSkip(rel: string, disclaimerPath: string): boolean {
  const norm = rel.replace(/\\/g, '/');
  const dNorm = disclaimerPath.replace(/\\/g, '/');
  return norm === dNorm ||
         norm.startsWith('pre-public/') ||
         norm.startsWith('.abandonados/') ||
         norm.startsWith('.deprecados/') ||
         norm.startsWith('coverage/') ||
         norm.startsWith('relatorios/') ||
         norm.includes('preview-prometheus') ||
         norm.includes('preview-i-c-l-org');
}
export async function addDisclaimer({
  root = process.cwd(),
  disclaimerPath = defaultDisclaimerCaminho,
  dryRun = false
}: DisclaimerOptions = {}): Promise<{
  updatedArquivos: string[];
}> {
  const absDisclaimer = path.join(root, disclaimerPath);
  await fs.access(absDisclaimer).catch(() => {
    throw new Error(`Disclaimer not found: ${disclaimerPath}`);
  });
  const disclaimerText = await fs.readFile(absDisclaimer, 'utf8');
  const files = (await listMarkdown(root)).filter(f => !shouldSkip(f, disclaimerPath));
  const updatedArquivos: string[] = [];
  for (const rel of files) {
    const abs = path.join(root, rel);
    if (await hasDisclaimer(abs)) continue;
    const content = await fs.readFile(abs, 'utf8');
    const updated = `${disclaimerText}\n\n${content.trimStart()}\n`;
    if (!dryRun) await fs.writeFile(abs, updated, 'utf8');
    updatedArquivos.push(rel);
  }
  return {
    updatedArquivos
  };
}
export async function verifyDisclaimer({
  root = process.cwd(),
  disclaimerPath = defaultDisclaimerCaminho
}: Pick<DisclaimerOptions, 'root' | 'disclaimerPath'> = {}): Promise<{
  missing: string[];
}> {
  const files = (await listMarkdown(root)).filter(f => !shouldSkip(f, disclaimerPath));
  const missing: string[] = [];
  for (const rel of files) {
    const abs = path.join(root, rel);
    if (!(await hasDisclaimer(abs))) {
      missing.push(rel);
    }
  }
  return {
    missing
  };
}
const disclaimerModule = {
  addDisclaimer,
  verifyDisclaimer
};
export default disclaimerModule;
