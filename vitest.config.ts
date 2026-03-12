import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import type { VitestAlias } from './src/types/shared/system.types.js';

// Timeouts configuration (in milliseconds)
const TEST_TIMEOUT_MS = 120_000;
const HOOK_TIMEOUT_MS = 60_000;
const TEARDOWN_TIMEOUT_MS = 60_000;

// Helpers extraídos para reduzir complexidade cognitiva da função principal
async function mapTsConfigAliases(rootAbs: string): Promise<VitestAlias[]> {
  try {
    const tsconfigPath = path.join(rootAbs, 'tsconfig.json');
    const raw = await fs.promises.readFile(tsconfigPath, 'utf8');
    // Simplesmente tenta remover comentários de linha que iniciam com // para permitir JSON.parse
    const withoutComments = raw
      .split('\n')
      .filter((l) => !l.trim().startsWith('//'))
      .join('\n');
    let json: Record<string, unknown>;
    try {
      json = JSON.parse(withoutComments);
    } catch {
      return [];
    }
    const paths: Record<string, string[]> = ((json as any)?.compilerOptions?.paths as Record<string, string[]> | undefined) ?? {};
    const entries: VitestAlias[] = [];
    const mapPrefix = (aliasPrefix: string, rel: string) => ({
      find: aliasPrefix,
      replacement: path.resolve(rootAbs, 'src', rel).replace(/\\/g, '/'),
    });
    if (paths['@core/*']) entries.push(mapPrefix('@core', 'core'));
    if (paths['@nucleo/*']) entries.push(mapPrefix('@nucleo', 'nucleo'));
    if (paths['@shared/*']) entries.push(mapPrefix('@shared', 'shared'));
    if (paths['@analistas/*'])
      entries.push(mapPrefix('@analistas', 'analistas'));
    if (paths['@auto/*']) entries.push(mapPrefix('@auto', 'auto'));
    if (paths['@arquitetos/*'])
      entries.push(mapPrefix('@arquitetos', 'arquitetos'));
    if (paths['@zeladores/*'])
      entries.push(mapPrefix('@zeladores', 'zeladores'));
    if (paths['@relatorios/*'])
      entries.push(mapPrefix('@relatorios', 'relatorios'));
    if (paths['@messages/*']) entries.push(mapPrefix('@messages', 'messages'));
    if (paths['@guardian/*']) entries.push(mapPrefix('@guardian', 'guardian'));
    if (paths['@cli/*']) entries.push(mapPrefix('@cli', 'cli'));
    if (paths['@tipos/*']) entries.push(mapPrefix('@tipos', 'tipos'));
    if (paths['@/*']) entries.push(mapPrefix('@', ''));
    if (paths['@/resolver.js'] || paths['@/resolver']) {
      // O arquivo "src/resolver.ts" foi abandonado/excluído em algumas
      // branches. Só adiciona o mapping se o arquivo realmente existir para
      // evitar que o Vitest/ESLint reclamem sobre um alias apontando para
      // caminho inexistente.
      const resolverCandidate = path.resolve(rootAbs, 'src', 'resolver.ts');
      if (await fs.promises.access(resolverCandidate).then(() => true).catch(() => false)) {
        entries.push({
          find: '@/resolver.js',
          replacement: resolverCandidate.replace(/\\/g, '/'),
        });
        entries.push({
          find: '@/resolver',
          replacement: resolverCandidate.replace(/\\/g, '/'),
        });
      }
    }

    // Alias bare '@' (mapeado em tsconfig para types/index.ts) — necessário
    // porque alguns módulos fazem import runtime de `from '@'`.
    if (paths['@']) {
      entries.push({
        find: '@',
        replacement: path
          .resolve(rootAbs, paths['@'][0] as string)
          .replace(/\\/g, '/'),
      });
    }

    return entries;
  } catch {
    return [];
  }
}

function createResolvePlugin(rootAbs: string) {
  return {
    name: 'prometheus-resolve-src-ts-from-js',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string | undefined) {
      try {
        if (!importer) return null;
        if (!source.endsWith('.js')) return null;
        if (!(source.startsWith('.') || source.startsWith('/'))) return null;

        const cleanId = (id: string) =>
          id
            .split('?')[0]
            .split('#')[0]
            .replace(/^\/@fs\//, '');
        let importerPath = cleanId(importer as string);
        if (importerPath.startsWith('file://'))
          importerPath = fileURLToPath(importerPath);

        const importerPosix = importerPath.replace(/\\/g, '/');
        const scope = deriveScopeFromImporter(importerPosix);

        // absolute source first
        if (source.startsWith('/'))
          return resolveCandidateToTs(path.join(rootAbs, source));

        // special cases and candidate building
        const special = source.match(
          /^\.\.\/(analistas|arquitetos|cli|guardian|nucleo|relatorios|tipos|zeladores)\/(.*)$/,
        );
        const candidate = special
          ? path.join(rootAbs, 'src', special[1], special[2])
          : source.startsWith('./') && scope
            ? path.join(rootAbs, 'src', scope, source.slice(2))
            : path.resolve(path.dirname(importerPath), source);

        const mapped = resolveCandidateToTs(candidate);
        if (mapped) return mapped;

        return resolveSrcPattern(rootAbs, source);
      } catch {
        return null;
      }
    },
  };
}

// Pequenas funções utilitárias para reduzir complexidade dentro dos plugins
function deriveScopeFromImporter(importerPosix: string): string {
  const testsIdx = importerPosix.lastIndexOf('/tests/');
  return testsIdx >= 0
    ? importerPosix.slice(testsIdx + '/tests/'.length).split('/')[0]
    : '';
}

function resolveCandidateToTs(candidate: string | null) {
  if (!candidate) return null;
  if (fs.existsSync(candidate)) return null;
  const asTs = candidate.replace(/\.js$/i, '.ts');
  if (fs.existsSync(asTs)) {
    // Return absolute path without @fs prefix
    return asTs.replace(/\\/g, '/');
  }
  return null;
}

function resolveSrcPattern(rootAbs: string, source: string) {
  const idxSrc = source.indexOf('/src/');
  if (idxSrc >= 0) {
    const sub = source.slice(idxSrc);
    const absFromRoot = path.join(rootAbs, sub);
    const asTsRoot = absFromRoot.replace(/\.js$/i, '.ts');
    if (fs.existsSync(asTsRoot)) return `/@fs/${asTsRoot.replace(/\\/g, '/')}`;
  }
  return null;
}

function _createTransformPlugin(_rootAbs: string) {
  // Deprecated: kept for backward compat but split into two focused plugins below
  return {
    name: 'prometheus-transform-tests-js-to-ts',
    enforce: 'pre' as const,
    transform: () => null,
  };
}

function createTransformImportsPlugin(_rootAbs: string) {
  return {
    name: 'prometheus-transform-imports-js-to-ts',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      try {
        const cleanId = (s: string) => s.split('?')[0].split('#')[0];
        let file = cleanId(id);
        if (file.startsWith('file://')) file = fileURLToPath(file);
        const isTest = file.replace(/\\/g, '/').includes('/tests/');
        if (!isTest) return null;

        let changed = false;
        const tryReplaceImport = (
          m: string,
          pre: string,
          rel: string,
          rest: string,
        ) => {
          try {
            const spec = `${rel}/src/${rest}.js`;
            const absJs = path.resolve(path.dirname(file), spec);
            const absTs = absJs.replace(/\.js$/i, '.ts');
            if (!fs.existsSync(absJs) && fs.existsSync(absTs)) {
              changed = true;
              return `${pre}${rel}/src/${rest}.ts`;
            }
          } catch { }
          return m;
        };

        const out = code.replace(
          /(\W)(\.\.?(?:\/[^/'"`]+)*)\/src\/([^'"`]+?)\.js/g,
          tryReplaceImport,
        );
        return changed || out !== code ? { code: out, map: null } : null;
      } catch {
        return null;
      }
    },
  };
}

function createTransformMocksPlugin(_rootAbs: string) {
  return {
    name: 'prometheus-transform-mocks-js-to-ts',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      try {
        const cleanId = (s: string) => s.split('?')[0].split('#')[0];
        let file = cleanId(id);
        if (file.startsWith('file://')) file = fileURLToPath(file);
        const isTest = file.replace(/\\/g, '/').includes('/tests/');
        if (!isTest) return null;

        let changed = false;
        const tryReplaceMock = (
          _full: string,
          prefix: string,
          spec: string,
          suffix: string,
        ) => {
          try {
            const isRel = spec.startsWith('./') || spec.startsWith('../');
            if (isRel) {
              let absTarget = path.resolve(path.dirname(file), spec);
              const absTs = absTarget.replace(/\.js$/i, '.ts');
              if (!fs.existsSync(absTarget) && fs.existsSync(absTs))
                absTarget = absTs;
              if (fs.existsSync(absTarget)) {
                changed = true;
                return `${prefix}/@fs/${absTarget.replace(/\\/g, '/')} ${suffix}`.replace(
                  ' ',
                  '',
                );
              }
            }
          } catch { }
          return `${prefix}${spec}${suffix}`;
        };

        const out = code.replace(
          /(vi\.(?:do)?mock\(\s*['"])([^'"`]+)(['"`])/g,
          tryReplaceMock,
        );
        return changed || out !== code ? { code: out, map: null } : null;
      } catch {
        return null;
      }
    },
  };
}

export default defineConfig(async () => {
  const isCI = process.env.CI === 'true';
  const coverageEnabled = isCI || process.env.COVERAGE === 'true';
  const enforceThresholds = isCI || process.env.COVERAGE_ENFORCE === 'true';
  const coverageProvider = process.env.COVERAGE_PROVIDER || 'c8';
  const providerMapped =
    coverageProvider === 'c8'
      ? 'istanbul'
      : coverageProvider === 'v8'
        ? 'v8'
        : 'v8';
  const rootAbs = path.resolve(process.cwd());
  const onWindows = process.platform === 'win32';
  const requestedPool = String(process.env.VITEST_POOL || '').toLowerCase();
  const pool =
    requestedPool === 'forks' || requestedPool === 'threads'
      ? (requestedPool as 'forks' | 'threads')
      : onWindows
        ? 'forks'
        : 'threads';
  const maxWorkersEnv = Number(
    process.env.VITEST_MAX_WORKERS || (onWindows ? '1' : ''),
  );

  const alias = await mapTsConfigAliases(rootAbs);

  async function loadCoverageExclude(): Promise<string[]> {
    try {
      const exPath = path.join(
        rootAbs,
        'scripts',
        'coverage-exclude.json',
      );
      const exists = await fs.promises
        .access(exPath)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        const raw = await fs.promises.readFile(exPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as string[];
      }
    } catch { }
    return [];
  }

  return {
    resolve: { alias },
    plugins: [
      createResolvePlugin(rootAbs),
      createTransformImportsPlugin(rootAbs),
      createTransformMocksPlugin(rootAbs),
    ],
    test: {
      globals: true,
      environment: 'node',
      setupFiles: ['./tests/cli/setup-fast-mode.ts'],
      testTimeout: Number(process.env.VITEST_TEST_TIMEOUT_MS || TEST_TIMEOUT_MS),
      hookTimeout: Number(process.env.VITEST_HOOK_TIMEOUT_MS || HOOK_TIMEOUT_MS),
      teardownTimeout: Number(process.env.VITEST_TEARDOWN_TIMEOUT_MS || TEARDOWN_TIMEOUT_MS),
      reporters: ((process.env.VITEST_REPORTER || 'dot')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => Boolean(s)) as string[]).filter(
          (r): r is
            | 'default'
            | 'basic'
            | 'dot'
            | 'verbose'
            | 'tap'
            | 'junit' =>
            ['default', 'basic', 'dot', 'verbose', 'tap', 'junit'].includes(
              r,
            ),
        ),
      pool,
      ...(Number.isFinite(maxWorkersEnv) && maxWorkersEnv > 0
        ? { maxWorkers: maxWorkersEnv }
        : {}),
      poolOptions: {
        threads: {
          singleThread: process.platform === 'win32',
        },
      },
      fileParallelism: !onWindows,
      sequence: { concurrent: process.platform !== 'win32' },
      onConsoleLog(log: unknown, type: string) {
        try {
          const noisyTypes = ['stdout'];
          if (noisyTypes.includes(type as string)) return false;
          const s = String(log);
          if (
            s.includes('FINAL_EMIT_') ||
            s.includes('DEBUG:') ||
            s.includes('SUCESSO') ||
            s.includes('LOG.') ||
            /\[\d{2}:\d{2}:\d{2}\]\s/.test(s)
          ) {
            return false;
          }
        } catch { }
        return undefined;
      },
      include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
      exclude: await loadCoverageExclude(),
      coverage: {
        provider: providerMapped as 'v8' | 'istanbul',
        reportsDirectory: './coverage',
        enabled: coverageEnabled,
        include: ['src/**/*.ts'],
          exclude: await loadCoverageExclude(),
          all: false,
        ...(enforceThresholds
          ? {
            thresholds: {
              lines: 50,
              functions: 50,
              branches: 50,
              statements: 50,
            },
          }
          : {}),
      },
    },
  };
});
