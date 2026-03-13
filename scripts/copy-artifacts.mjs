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

  // Copia o Kit de Sobrevivência para distribuição
  const kitSrc = path.join(root, 'src', 'kit');
  const kitDest = path.join(root, 'dist', 'kit');
  try {
    await copyDir(kitSrc, kitDest);
    console.log('[copy] Kit de Sobrevivência copiado para dist/kit');
  } catch (e) {
    console.warn('[copy] Aviso: não foi possível copiar o kit:', e.message);
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
