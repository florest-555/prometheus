#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copia artefatos não-transpilados para dist (ex.: ESM loader)
import { promises as fs } from 'node:fs';
import path from 'node:path';

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

/**

 * TODO: Adicionar descrição da função

 * @param {*} src - TODO: Descrever parâmetro

 * @param {*} dest - TODO: Descrever parâmetro

 * @returns {*} TODO: Descrever retorno

 */

/**

 * TODO: Adicionar descrição da função

 * @param {*} src - TODO: Descrever parâmetro

 * @param {*} dest - TODO: Descrever parâmetro

 * @returns {*} TODO: Descrever retorno

 */

/**

 * TODO: Adicionar descrição da função

 * @param {*} src - TODO: Descrever parâmetro

 * @param {*} dest - TODO: Descrever parâmetro

 * @returns {*} TODO: Descrever retorno

 */

/**

 * TODO: Adicionar descrição da função

 * @param {*} src - TODO: Descrever parâmetro

 * @param {*} dest - TODO: Descrever parâmetro

 * @returns {*} TODO: Descrever retorno

 */

/**

 * TODO: Adicionar descrição da função

 * @param {*} src - TODO: Descrever parâmetro

 * @param {*} dest - TODO: Descrever parâmetro

 * @returns {*} TODO: Descrever retorno

 */

async function copy(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
  // console.log(`[copy] ${src} -> ${dest}`); // TODO: Remover antes da produção
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await copy(srcPath, destPath);
    }
  }
}

async function main() {
  const root = process.cwd();
  const loaderSrc = path.join(root, 'src', 'node.loader.mjs');
  const loaderDest = path.join(root, 'dist', 'node.loader.mjs');
  try {
    await copy(loaderSrc, loaderDest);
  } catch (e) {
    console.warn('[copy] Aviso: não foi possível copiar node.loader.mjs:', e.message);
  }

  // Copia os scripts do Kit de Sobrevivência para distribuição
  const kitShellSrc = path.join(root, 'src', 'kit', 'shell');
  const kitShellDest = path.join(root, 'dist', 'kit', 'shell');
  try {
    await copyDir(kitShellSrc, kitShellDest);
    console.log('[copy] Scripts do Kit copiados para dist/kit/shell');
  } catch (e) {
    console.warn('[copy] Aviso: não foi possível copiar scripts do kit:', e.message);
  }

  // Copia os guias do Kit para distribuição
  const kitDocsSrc = path.join(root, 'docs', 'kit');
  const kitDocsDest = path.join(root, 'dist', 'kit');
  try {
    await copyDir(kitDocsSrc, kitDocsDest);
    console.log('[copy] Guias do Kit copiados para dist/kit');
  } catch (e) {
    console.warn('[copy] Aviso: não foi possível copiar guias do kit:', e.message);
  }

  // Garantir que o executável CLI tenha permissões de execução
  const cliExecutable = path.join(root, 'dist', 'bin', 'index.js');
  try {
    await fs.chmod(cliExecutable, 0o755);
    console.log('[copy] Permissões de execução adicionadas ao CLI');
  } catch (e) {
    console.warn('[copy] Aviso: não foi possível definir permissões de execução:', e.message);
  }
}

main().catch((e) => {
  console.error('[copy] Falha ao copiar artefatos:', e);
  process.exit(1);
});
