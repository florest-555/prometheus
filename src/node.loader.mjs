// ARQUIVO GERADO AUTOMATICAMENTE
import { pathToFileURL } from 'node:url';
import { join, resolve as resolvePath, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';

const aliases = {
  '@types/types.js': 'types/types.ts',
  '@core/': 'core/',
  '@shared/': 'shared/',
  '@analistas/': 'analistas/',
  '@arquitetos/': 'arquitetos/',
  '@zeladores/': 'zeladores/',
  '@relatorios/': 'relatorios/',
  '@guardian/': 'guardian/',
  '@cli/': 'cli/',
  '@types/': 'types/',
  '@src/': '',
  '@/': '',
};

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith('@')) return nextResolve(specifier, context);
  let resolved = null;
  for (const [prefix, replacement] of Object.entries(aliases)) {
    if (specifier === prefix || specifier.startsWith(prefix)) {
      const remaining = specifier.slice(prefix.length);
      const newPath = replacement + remaining;
      const parentURL = context.parentURL;
      let basePath = '';
      if (parentURL) {
        const parentPath = new URL(parentURL).pathname;
        if (parentPath.includes('/dist/')) basePath = resolvePath(parentPath.split('/dist/')[0], 'dist');
        else if (parentPath.includes('/src/')) basePath = resolvePath(parentPath.split('/src/')[0], 'src');
        else basePath = resolvePath(process.cwd(), 'src');
      } else basePath = resolvePath(process.cwd(), 'src');
      const fullPath = join(basePath, newPath);
      const extensions = ['.js', '.ts', '.mjs', '.cjs'];
      let finalPath = fullPath;
      if (!existsSync(fullPath)) {
        let found = false;
        for (const ext of extensions) {
          const testPath = fullPath + ext;
          if (existsSync(testPath)) { finalPath = testPath; found = true; break; }
        }
        if (!found) {
          for (const ext of extensions) {
            const testPath = join(fullPath, 'index' + ext);
            if (existsSync(testPath)) { finalPath = testPath; found = true; break; }
          }
        }
      }
      resolved = pathToFileURL(finalPath).href;
      break;
    }
  }
  if (resolved) return { url: resolved, shortCircuit: true };
  return nextResolve(specifier, context);
}
