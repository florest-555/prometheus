// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function collectTsFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTsFiles(fullPath)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.ts')) continue;
    if (entry.name.endsWith('.d.ts')) continue;
    files.push(fullPath);
  }
  return files;
}

describe('core messages imports', () => {
  it('should load every core messages module', async () => {
    const root = path.resolve(process.cwd(), 'src', 'core', 'messages');
    const files = await collectTsFiles(root);
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const mod = await import(pathToFileURL(file).href);
      expect(mod).toBeDefined();
    }
  });
});
