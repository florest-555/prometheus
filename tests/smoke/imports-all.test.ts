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

describe('imports smoke', () => {
  it('should import all src ts modules', async () => {
    const root = path.resolve(process.cwd(), 'src');
    const files = (await collectTsFiles(root)).filter((file) => !file.includes(`${path.sep}bin${path.sep}`));
    expect(files.length).toBeGreaterThan(0);

    const failures: { file: string; message: string }[] = [];
    for (const file of files) {
      try {
        const mod = await import(pathToFileURL(file).href);
        expect(mod).toBeDefined();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ file, message });
      }
    }

    if (failures.length) {
      const preview = failures.slice(0, 5).map((f) => `${f.file}: ${f.message}`).join('\n');
      throw new Error(`Failed to import ${failures.length} modules:\n${preview}`);
    }
  });
});
