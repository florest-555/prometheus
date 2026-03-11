// SPDX-License-Identifier: MIT-0
import path from 'node:path';

/**
 * Sanitiza um caminho relativo, eliminando tentativas de escape (..),
 * barras duplicadas e separadores inconsistentes.
 * @param rel - Caminho relativo a sanitizar
 * @returns Caminho normalizado e seguro
 */
export function sanitizarRelPath(rel: string): string {
  if (!rel) return '';
  rel = rel.replace(/^[A-Za-z]:\\?/u, '').replace(/^\/+/, '');
  const norm = rel.replace(/\\+/g, '/');
  const collapsed = path.posix.normalize(norm);
  if (collapsed.startsWith('..')) {
    // remove todos os prefixos de ../ e barras iniciais resultantes
    const semDots = collapsed.replace(/^(\.\/?)+/, '');
    return semDots.replace(/^\/+/, '');
  }
  return collapsed.replace(/^\/+/, '');
}

/**
 * Verifica se um caminho alvo está contido dentro do diretório base.
 * Impede acesso a caminhos fora da raiz do projeto.
 * @param baseDir - Diretório base de referência
 * @param alvo - Caminho absoluto do alvo a verificar
 * @returns `true` se o alvo está dentro do baseDir
 */
export function estaDentro(baseDir: string, alvo: string): boolean {
  const rel = path.relative(baseDir, alvo);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Resolve o caminho de um plugin de forma segura, verificando se está
 * dentro da raiz do projeto e se possui extensão permitida.
 * @param baseDir - Diretório raiz do projeto
 * @param pluginRel - Caminho relativo do plugin
 * @returns Objeto com `caminho` resolvido ou `erro` descritivo
 */
export function resolverPluginSeguro(
  baseDir: string,
  pluginRel: string,
): { caminho?: string; erro?: string } {
  try {
    if (typeof pluginRel !== 'string' || !pluginRel.trim()) {
      return { erro: 'entrada de plugin inválida (string vazia)' };
    }
    const resolvido = path.resolve(baseDir, pluginRel);
    if (!estaDentro(baseDir, resolvido)) {
      return { erro: 'plugin fora da raiz do projeto (bloqueado)' };
    }
    // Restringe extensões para reduzir risco de execução arbitrária
    const permitido = [/\.(c|m)?js$/i, /\.ts$/i];
    if (!permitido.some((r) => r.test(resolvido))) {
      return { erro: 'extensão de plugin não permitida' };
    }
    return { caminho: resolvido };
  } catch (e) {
    return { erro: (e as Error).message || String(e) };
  }
}

/**
 * Valida se um padrão glob é seguro para uso, bloqueando
 * padrões excessivamente longos ou com muitos wildcards recursivos.
 * @param padrao - Padrão glob a validar
 * @returns `true` se o padrão é considerado seguro
 */
export function validarGlobBasico(padrao: string): boolean {
  if (padrao.length > 300) return false;
  // Bloqueia mais de 4 ocorrências de '**' mesmo não consecutivas
  const ocorrencias = (padrao.match(/\*\*/g) || []).length;
  if (ocorrencias >= 5) return false;
  return true;
}
/**
 * Filtra uma lista de padrões glob, retornando apenas os que são seguros.
 * @param padroes - Lista de padrões glob a filtrar
 * @returns Lista contendo apenas os padrões que passaram na validação
 */
export function filtrarGlobSeguros(padroes: string[]): string[] {
  return padroes.filter((p) => validarGlobBasico(p));
}
