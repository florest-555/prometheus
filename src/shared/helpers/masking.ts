// SPDX-License-Identifier: MIT-0
// Utilitários de mascaramento que preservam quebras de linha para manter o cálculo de linhas estável.

/**
 * Mascara uma região de texto substituindo caracteres por espaços,
 * preservando quebras de linha para manter a contagem de linhas estável.
 * @param src - Texto fonte
 * @param start - Índice de início da região a mascarar
 * @param end - Índice de fim da região a mascarar
 * @returns Texto com a região mascarada
 */
export function maskKeepingNewlines(
  src: string,
  start: number,
  end: number,
): string {
  const before = src.slice(0, start);
  const mid = src.slice(start, end).replace(/[^\n]/g, ' ');
  const after = src.slice(end);
  return before + mid + after;
}

/**
 * Mascara comentários JavaScript/TypeScript (bloco e linha),
 * preservando quebras de linha.
 * @param src - Código fonte JS/TS
 * @returns Código com comentários mascarados
 */
export function maskJsComments(src: string): string {
  let out = src;

  for (const m of out.matchAll(/\/\*[\s\S]*?\*\//g)) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }

  for (const m of out.matchAll(/(^|[^:])\/\/.*$/gm)) {
    const start = (m.index ?? -1) + (m[1] ? m[1].length : 0);
    if (start < 0) continue;
    out = maskKeepingNewlines(
      out,
      start,
      start + (m[0]?.length ?? 0) - (m[1] ? m[1].length : 0),
    );
  }

  return out;
}

/**
 * Mascara comentários HTML (`<!-- -->`), preservando quebras de linha.
 * @param src - Código fonte HTML
 * @returns Código com comentários HTML mascarados
 */
export function maskHtmlComments(src: string): string {
  let out = src;
  for (const m of out.matchAll(/<!--([\s\S]*?)-->/g)) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }
  return out;
}

/**
 * Mascara blocos de tags HTML (script ou style) inteiros,
 * preservando quebras de linha.
 * @param src - Código fonte HTML
 * @param tag - Tag a mascarar ('script' ou 'style')
 * @returns Código com os blocos da tag mascarados
 */
export function maskTagBlocks(src: string, tag: 'script' | 'style'): string {
  let out = src;
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  for (const m of out.matchAll(re)) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }
  return out;
}

/**
 * Mascara conteúdo não-código em XML (comentários e seções CDATA),
 * preservando quebras de linha.
 * @param src - Código fonte XML
 * @returns Código com conteúdo não-código mascarado
 */
export function maskXmlNonCode(src: string): string {
  let out = src;

  for (const m of out.matchAll(/<!--[\s\S]*?-->/g)) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }

  for (const m of out.matchAll(/<!\[CDATA\[[\s\S]*?\]\]>/g)) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }

  return out;
}

/**
 * Mascara strings e comentários Python, preservando quebras de linha.
 * Trata strings triplas, strings simples e comentários com `#`.
 * @param src - Código fonte Python
 * @returns Código com strings e comentários mascarados
 */
export function maskPythonStringsAndComments(src: string): string {
  let out = maskPythonComments(src);

  for (const m of out.matchAll(/([ruRUfFbB]{0,3})("""|''')[\s\S]*?\2/g)) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }

  for (const m of out.matchAll(
    /([ruRUfFbB]{0,3})("([^"\\\n]|\\.)*"|'([^'\\\n]|\\.)*')/g,
  )) {
    const start = m.index ?? -1;
    if (start < 0) continue;
    out = maskKeepingNewlines(out, start, start + m[0].length);
  }

  return out;
}

/**
 * Mascara comentários Python (linhas com `#`), preservando quebras de linha.
 * @param src - Código fonte Python
 * @returns Código com comentários mascarados
 */
export function maskPythonComments(src: string): string {
  let out = src;

  for (const m of out.matchAll(/(^|[^\\])#.*$/gm)) {
    const start = (m.index ?? -1) + (m[1] ? m[1].length : 0);
    if (start < 0) continue;
    out = maskKeepingNewlines(
      out,
      start,
      start + (m[0]?.length ?? 0) - (m[1] ? m[1].length : 0),
    );
  }

  return out;
}
