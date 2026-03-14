#!/usr/bin/env node
// SPDX-License-Identifier: MIT

import { promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const AVISO_PROVENIENCIA = '---\nProveniência e Autoria: Este documento integra o projeto Prometheus (licença MIT-0).\nNada aqui implica cessão de direitos morais/autorais.\nConteúdos de terceiros não licenciados de forma compatível não devem ser incluídos.\nReferências a materiais externos devem ser linkadas e reescritas com palavras próprias.\n---';

function stripJsonComments(str) {
  return str
    .replace(/^\s*\/\/.*$/gm, '') // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/,(\s*[\]}])/g, '$1'); // Remove trailing commas
}

async function getAliasPaths(tool) {
  const cfgPath = tool === 'eslint'
    ? join(projectRoot, 'tsconfig.eslint.json')
    : join(projectRoot, 'tsconfig.json');
  try {
    const content = await fs.readFile(cfgPath, 'utf-8');
    const json = JSON.parse(stripJsonComments(content));
    return json.compilerOptions?.paths ?? {};
  } catch (error) {
    return {};
  }
}

async function updateTsConfig(path) {
  try {
    const content = await fs.readFile(path, 'utf-8');
    const stripped = stripJsonComments(content);
    const config = JSON.parse(stripped);
    if (!config.compilerOptions) config.compilerOptions = {};
    config.compilerOptions.paths = await getAliasPaths('typescript');
    const inc = Array.isArray(config.include) ? config.include : [];
    if (!inc.includes('**/*.d.ts')) inc.push('**/*.d.ts');
    config.include = inc;
    const updatedContent = JSON.stringify(config, null, 2);
    await fs.writeFile(path, '// ARQUIVO GERADO AUTOMATICAMENTE\n' + updatedContent, 'utf-8');
  } catch (error) {
    console.error(`[ERR] Erro ao atualizar ${path}:`, error);
  }
}

async function updateSrcLoader() {
  const loaderPath = join(projectRoot, 'src', 'node.loader.mjs');
  const loaderContent = `// ARQUIVO GERADO AUTOMATICAMENTE
import { pathToFileURL } from 'node:url';
import { join, resolve as resolvePath, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';

const aliases = {
  '@types/types.js': 'types/types.ts',
  '@nucleo/': 'nucleo/',
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
`;
  await fs.writeFile(loaderPath, loaderContent, 'utf-8');
}

async function updateTestsLoader() {
  const loaderPath = join(projectRoot, 'tests', 'node.loader.mjs');
  const loaderContent = `// ARQUIVO GERADO AUTOMATICAMENTE
import { pathToFileURL } from 'node:url';
import { join, resolve as resolvePath, isAbsolute } from 'node:path';
import { existsSync } from 'node:fs';

const aliases = {
  '@types/types.js': '../src/types/types.ts',
  '@nucleo/': '../src/nucleo/',
  '@shared/': '../src/shared/',
  '@analistas/': '../src/analistas/',
  '@arquitetos/': '../src/arquitetos/',
  '@zeladores/': '../src/zeladores/',
  '@relatorios/': '../src/relatorios/',
  '@guardian/': '../src/guardian/',
  '@cli/': '../src/cli/',
  '@types/': '../src/types/',
  '@src/': '../src/',
  '@/': '../src/',
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
        if (parentPath.includes('/tests/')) basePath = resolvePath(parentPath.split('/tests/')[0], 'tests');
        else basePath = resolvePath(process.cwd(), 'tests');
      } else basePath = resolvePath(process.cwd(), 'tests');
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
`;
  await fs.writeFile(loaderPath, loaderContent, 'utf-8');
}

async function generateAliasDocumentation() {
  const docPath = join(projectRoot, 'docs', 'ALIASES.md');
  const tsPaths = await getAliasPaths('typescript');
  const aliasList = Object.keys(tsPaths).map(k => k.replace(/\/\*$/, ''));

  let aliasesMarkdown = '';
  for (const alias of aliasList) {
    const paths = tsPaths[alias + '*'] || tsPaths[alias] || [];
    aliasesMarkdown += `### \`${alias}\`\n`;
    aliasesMarkdown += `- **Caminho (tsconfig)**: ${paths.join(', ')}\n`;
    aliasesMarkdown += `- **Exemplo**: \`import { func } from '${alias}exemplo';\`\n\n`;
  }

  const docContent = AVISO_PROVENIENCIA + '\n\n' +
    '# Sistema de Aliases do i-c-l-org\n\n' +
    '> **ARQUIVO GERADO AUTOMATICAMENTE**\n' +
    '> Use `npm run sync-aliases` para atualizar\n\n' +
    '## Visão Geral\n\n' +
    'O i-c-l-org utiliza um sistema centralizado de aliases TypeScript para simplificar imports e manter consistência em todo o projeto.\n\n' +
    '## Aliases Disponíveis\n\n' +
    aliasesMarkdown +
    '## Como Usar\n\n' +
    '### Em Arquivos TypeScript\n' +
    '```typescript\n' +
    '// [OK] Correto - usar aliases\n' +
    'import { executar } from \'@nucleo/executor\';\n' +
    'import { analisarPadroes } from \'@analistas/javascript-typescript/analista-padroes-uso\';\n' +
    'import { salvarEstado } from \'@shared/persistence/persistencia\';\n\n' +
    '// [ERR] Incorreto - imports relativos longos\n' +
    'import { executar } from \'../../../nucleo/executor\';\n' +
    '```\n\n' +
    '### Em Testes\n' +
    '```typescript\n' +
    '// [OK] Correto - mesmos aliases funcionam nos testes\n' +
    'import { describe, it, expect } from \'vitest\';\n' +
    'import { JavaPlugin } from \'@shared/plugins/java/java-plugin\';\n' +
    '```\n\n' +
    '## Configuração Automática\n\n' +
    'O sistema sincroniza automaticamente:\n\n' +
    '- [OK] `tsconfig.json` - Paths para desenvolvimento\n' +
    '- [OK] `tsconfig.eslint.json` - Paths para ESLint\n' +
    '- [OK] `src/node.loader.mjs` - Loader ESM para src/\n' +
    '- [OK] `tests/node.loader.mjs` - Loader ESM para testes\n';

  await fs.writeFile(docPath, docContent, 'utf-8');
}

async function main() {
  await Promise.all([
    updateTsConfig(join(projectRoot, 'tsconfig.json')),
    updateTsConfig(join(projectRoot, 'tsconfig.eslint.json')),
    updateSrcLoader(),
    updateTestsLoader(),
    generateAliasDocumentation()
  ]);
  console.log('[OK] Sincronização concluída!');
}

main().catch(console.error);
