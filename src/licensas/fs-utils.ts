// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE
// Justificativa: utilitário síncrono para compatibilidade de callers
import fs from 'node:fs';
import path from 'node:path';

/**
 * Synchronous existence check kept for caller compatibility.
 * Use `existsAsync` in performance sensitive code instead.
 * @param p - Path to check
 */
export function existsSync(p: string): boolean {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Async path existence check (non-blocking).
 */
export async function existsAsync(p: string): Promise<boolean> {
  try {
    await fs.promises.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read and parse a package.json file synchronously.
 * Returns null on error.
 * @param pkgPath - Path to package.json
 */
export function readPackageJsonSync(pkgCaminho: string): Record<string, unknown> | null {
  try {
    const data = fs.readFileSync(pkgCaminho, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Async variant of package json reader.
 */
export async function readPackageJson(
  pkgCaminho: string,
): Promise<Record<string, unknown> | null> {
  try {
    const data = await fs.promises.readFile(pkgCaminho, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Locate a probable license file in a package directory and return its text where possible.
 * @param dir - package directory
 */
export function findLicenseFile(dir: string): {
  file: string;
  path: string;
  text: string | null;
} | null {
  try {
    const candidates = fs.readdirSync(dir).filter(f => /^(license|licence|copying)/i.test(f));
    if (!candidates.length) return null;
    const sorted = candidates.sort((a, b) => a.length - b.length);
    const file = sorted[0];
    const full = path.join(dir, file);
    try {
      const stat = fs.statSync(full);
      if (stat.isFile() && stat.size < 200 * 1024) {
        return {
          file,
          path: full,
          text: fs.readFileSync(full, 'utf8')
        };
      }
    } catch { }
    return {
      file,
      path: full,
      text: null
    };
  } catch {
    return null;
  }
}
export async function findLicenseFileAsync(
  dir: string,
): Promise<{ file: string; path: string; text: string | null } | null> {
  try {
    const dirents = await fs.promises.readdir(dir).catch(() => []) as string[];
    const candidates = dirents.filter(f => /^(license|licence|copying)/i.test(f));
    if (!candidates.length) return null;
    const sorted = candidates.sort((a, b) => a.length - b.length);
    const file = sorted[0];
    const full = path.join(dir, file);
    try {
      const stat = await fs.promises.stat(full);
      if (stat.isFile() && stat.size < 200 * 1024) {
        const text = await fs.promises.readFile(full, 'utf8');
        return { file, path: full, text };
      }
    } catch {}
    return { file, path: full, text: null };
  } catch {
    return null;
  }
}
