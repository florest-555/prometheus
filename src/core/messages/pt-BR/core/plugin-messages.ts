// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

  /* -------------------------- MENSAGENS REACT -------------------------- */

export const ReactMensagens = createI18nMessages({
  linkTargetBlank: 'Link com target="_blank" sem rel="noreferrer"/"noopener".',
  dangerouslySetInnerHTML: 'Uso de dangerouslySetInnerHTML encontrado; valide a necessidade.',
  imgWithoutAlt: 'Imagem sem atributo alt (acessibilidade).',
  httpFetch: 'Chamada HTTP sem TLS detectada; prefira HTTPS.',
  hardcodedCredential: 'Possível credencial hardcoded; use variáveis de ambiente.',
  locationHrefRedirect: 'Atribuição direta a location.href; valide origem para evitar open redirect.',
  listItemNoKey: 'Item em lista (map) sem atributo key.',
  indexAsKey: 'Uso de índice como key (pode causar problemas de reordenação).',
  inlineHandlerJsx: 'Handler inline detectado em JSX; prefira funções estáveis (useCallback) ou extrair fora do render.',
  useEffectEmptyDeps: 'useEffect com dependências vazias [] executa apenas uma vez (equivalente a componentDidMount).',
  useEffectMissingDeps: 'useEffect com array de dependências ausente ou incompleto; variáveis usadas no effect devem estar nas deps.',
  useEffectAsyncNoCleanup: 'useEffect com função assíncrona sem cleanup; adicione return para cancelar em unmount.',
  reactMemoNoCompare: 'React.memo sem função de comparação pode não evitar re-renders desnecessários.',
  useStateInitializerExpensive: 'useState com inicializador custoso (função chamada em cada render).'
}, {
  linkTargetBlank: 'Link with target="_blank" without rel="noreferrer"/"noopener".',
  dangerouslySetInnerHTML: 'Use of dangerouslySetInnerHTML found; validate the need.',
  imgWithoutAlt: 'Image without alt attribute (accessibility).',
  httpFetch: 'HTTP call without TLS detected; prefer HTTPS.',
  hardcodedCredential: 'Possible hardcoded credential; use environment variables.',
  locationHrefRedirect: 'Direct assignment to location.href; validate source to avoid open redirect.',
  listItemNoKey: 'List item (map) without key attribute.',
  indexAsKey: 'Use of index as key (can cause reordering issues).',
  inlineHandlerJsx: 'Inline handler detected in JSX; prefer stable functions (useCallback) or extract outside render.',
  useEffectEmptyDeps: 'useEffect with empty dependencies [] runs only once (equivalent to componentDidMount).',
  useEffectMissingDeps: 'useEffect with missing or incomplete dependency array; variables used in effect should be in deps.',
  useEffectAsyncNoCleanup: 'useEffect with async function without cleanup; add return to cancel on unmount.',
  reactMemoNoCompare: 'React.memo without compare function may not prevent unnecessary re-renders.',
  useStateInitializerExpensive: 'useState with expensive initializer (function called on every render).'
});

  /* -------------------------- MENSAGENS REACT HOOKS -------------------------- */

export const ReactHooksMensagens = createI18nMessages({
  useEffectNoDeps: 'useEffect sem array de dependências (avalie deps para evitar loops).',
  memoCallbackNoDeps: 'Hook sem array de dependências (useMemo/useCallback).',
  hookInConditional: 'Hook declarado dentro de condicional (quebra Rules of Hooks).',
  missingMemo: 'Função em render sem React.memo pode causar re-renders desnecessários.',
  missingUseCallback: 'Handler em JSX sem useCallback pode causar re-renders desnecessários.',
  staleClosure: 'Possível stale closure em useEffect/useCallback - variável capturada pode estar desatualizada.',
  missingKey: 'Elemento em map sem key única (evite usar índice).',
  useEffectEmptyDeps: 'useEffect com array de dependências vazio [] executa apenas uma vez (equivale a componentDidMount).',
  setStateInRender: 'setState dentro de render pode causar loop infinito.',
  missingReactImport: 'React import ausente em arquivo JSX (necessário para fragmentos, hooks).'
}, {
  useEffectNoDeps: 'useEffect without dependency array (evaluate deps to avoid loops).',
  memoCallbackNoDeps: 'Hook without dependency array (useMemo/useCallback).',
  hookInConditional: 'Hook declared inside conditional (breaks Rules of Hooks).',
  missingMemo: 'Function in render without React.memo may cause unnecessary re-renders.',
  missingUseCallback: 'Handler in JSX without useCallback may cause unnecessary re-renders.',
  staleClosure: 'Possible stale closure in useEffect/useCallback - captured variable may be outdated.',
  missingKey: 'Element in map without unique key (avoid using index).',
  useEffectEmptyDeps: 'useEffect with empty dependency array [] runs only once (equivalent to componentDidMount).',
  setStateInRender: 'setState in render may cause infinite loop.',
  missingReactImport: 'React import missing in JSX file (required for fragments, hooks).'
});

  /* -------------------------- MENSAGENS TAILWIND -------------------------- */

export const TailwindMensagens = createI18nMessages({
  conflictingClasses: (key: string, tokens: string[]) => `Possível conflito ${key} (${tokens.slice(0, 4).join(', ')}). Verifique duplicidades.`,
  repeatedClass: (token: string) => `Classe repetida detectada (${token}). Considere remover redundância.`,
  importantUsage: (token: string) => `Uso de ! (important) detectado em (${token}). Prefira classes utilitárias ou reforço de escopo ao invés de important.`,
  variantConflict: (prop: string, variants: string[]) => `Possível conflito de variantes para ${prop} (variantes: ${variants.slice(0, 6).join(', ')}). Verifique ordem/escopo.`,
  dangerousArbitraryValue: (token: string) => `Valor arbitrário com url potencialmente perigosa (${token}). Evite javascript:/data:text/html.`,
  arbitraryValue: (token: string) => `Classe com valor arbitrário (${token}). Confirme se está alinhada ao design.`
}, {
  conflictingClasses: (key: string, tokens: string[]) => `Possible conflict in ${key} (${tokens.slice(0, 4).join(', ')}). Check for duplicates.`,
  repeatedClass: (token: string) => `Repeated class detected (${token}). Consider removing redundancy.`,
  importantUsage: (token: string) => `Use of ! (important) detected in (${token}). Prefer utility classes or scope reinforcement instead of important.`,
  variantConflict: (prop: string, variants: string[]) => `Possible variant conflict for ${prop} (variants: ${variants.slice(0, 6).join(', ')}). Check order/scope.`,
  dangerousArbitraryValue: (token: string) => `Arbitrary value with potentially dangerous url (${token}). Avoid javascript:/data:text/html.`,
  arbitraryValue: (token: string) => `Class with arbitrary value (${token}). Confirm if it aligns with the design.`
});

  /* -------------------------- MENSAGENS CSS -------------------------- */

export const CssMensagens = createI18nMessages({
  duplicatePropertySame: (prop: string) => `Propriedade duplicada com valor idêntico (${prop}): erro detectado.`,
  duplicatePropertyDifferent: (prop: string, prev: string, curr: string) => `Propriedade duplicada (${prop}) com valores diferentes. Possível erro: "${prev}" vs "${curr}".`,
  importantUsage: 'Uso de !important detectado; prefira especificidade adequada.',
  httpImport: 'Importação via HTTP detectada; prefira HTTPS ou bundling local.',
  httpUrl: 'Recurso externo via HTTP em url(); prefira HTTPS.',
  unifySelectors: (selectors: string[], propsCount: number) => `Regras CSS idênticas (${propsCount} propriedades) em seletores (${selectors.slice(0, 6).join(', ')}). Considere unificar/centralizar em uma classe utilitária ou seletor compartilhado.`,
  idSelectorPreferClass: (selector: string) => `Seletor por id (${selector}) detectado. Para reutilização e consistência, prefira classes quando possível.`,
  invalidProperty: (prop: string) => `Propriedade CSS inválida ou desconhecida (${prop}). Verifique ortografia ou suporte do navegador.`,
  malformedSelector: (selector: string) => `Seletor CSS malformado ou inválido (${selector}). Pode causar problemas de renderização.`,
  emptyRule: 'Regra CSS vazia detectada. Remova regras sem declarações.',
  vendorPrefixDeprecated: (prop: string) => `Prefixo vendor deprecated (${prop}). Use propriedades padrão quando suportadas.`,
  cssHackDetected: (hack: string) => `Hack CSS detectado (${hack}). Considere abordagens modernas ou feature queries.`,
  deepNesting: 'Aninhamento CSS muito profundo detectado (3+ níveis). Considere usar classes utilitárias para evitar especificidade excessiva.',
  nestingWithoutParentSelector: 'CSS nesting detectado sem & (seletor pai). Alguns navegadores podem não suportar.'
}, {
  duplicatePropertySame: (prop: string) => `Duplicate property with identical value (${prop}): error detected.`,
  duplicatePropertyDifferent: (prop: string, prev: string, curr: string) => `Duplicate property (${prop}) with different values. Possible error: "${prev}" vs "${curr}".`,
  importantUsage: 'Use of !important detected; prefer appropriate specificity.',
  httpImport: 'Import via HTTP detected; prefer HTTPS or local bundling.',
  httpUrl: 'External resource via HTTP in url(); prefer HTTPS.',
  unifySelectors: (selectors: string[], propsCount: number) => `Identical CSS rules (${propsCount} properties) in selectors (${selectors.slice(0, 6).join(', ')}). Consider unifying/centralizing in a utility class or shared selector.`,
  idSelectorPreferClass: (selector: string) => `Selector by id (${selector}) detected. For reuse and consistency, prefer classes when possible.`,
  invalidProperty: (prop: string) => `Invalid or unknown CSS property (${prop}). Check spelling or browser support.`,
  malformedSelector: (selector: string) => `Malformed or invalid CSS selector (${selector}). May cause rendering issues.`,
  emptyRule: 'Empty CSS rule detected. Remove rules without declarations.',
  vendorPrefixDeprecated: (prop: string) => `Deprecated vendor prefix (${prop}). Use standard properties when supported.`,
  cssHackDetected: (hack: string) => `CSS hack detected (${hack}). Consider modern approaches or feature queries.`,
  deepNesting: 'Very deep CSS nesting detected (3+ levels). Consider using utility classes to avoid excessive specificity.',
  nestingWithoutParentSelector: 'CSS nesting detected without & (parent selector). Some browsers may not support.'
});

  /* -------------------------- MENSAGENS HTML -------------------------- */

export const HtmlMensagens = createI18nMessages({
  doctype: 'Documento sem <!DOCTYPE html> declarado.',
  htmlLang: 'Elemento <html> sem atributo lang (acessibilidade).',
  metaCharset: 'Falta <meta charset="utf-8"> no documento.',
  viewport: 'Falta meta viewport para responsividade.',
  title: 'Documento sem <title> definido.',
  linkTargetBlank: 'Link com target="_blank" sem rel="noreferrer"/"noopener".',
  linkNoHref: 'Link sem href válido ou sem handler (UX). Use <button> ou role="button".',
  imgWithoutAlt: 'Imagem sem atributo alt ou acessibilidade (WCAG 2.1).',
  imgWithoutLoading: 'Imagem sem atributo loading (performance). Considere loading="lazy".',
  imgWithoutDimensions: 'Imagem sem width/height (layout shift). Defina dimensões para evitar CLS.',
  formWithoutMethod: 'Formulário sem method especificado (GET/POST).',
  formWithoutAction: 'Formulário sem action ou data-attribute para processamento.',
  inputWithoutLabel: 'Input sem name, id or aria-label (acessibilidade/usabilidade).',
  passwordWithoutAutocomplete: 'Campo password sem autocomplete especificado (segurança).',
  inputWithoutType: 'Input sem type especificado (assume text, mas seja explícito).',
  inlineHandler: 'Handler inline detectado (on*). Prefira listeners externos ou data-attributes com JS.',
  inlineScript: 'Script inline detectado. Prefira arquivos externos para melhor cache e CSP.',
  inlineStyle: 'Style inline detectado. Prefira arquivos CSS externos para melhor cache.',
  scriptWithoutDefer: 'Script sem defer/async. Pode bloquear renderização; considere defer.',
  headingSkipped: (current: number, expected: number) => `Cabeçalho pulado: h${current} sem h${expected} precedente (estrutura semântica).`,
  buttonWithoutText: 'Botão sem texto ou aria-label (acessibilidade).',
  tableWithoutCaption: 'Tabela sem <caption> ou aria-label (acessibilidade).',
  iframeWithoutTitle: 'Iframe sem title (acessibilidade).',
  largeInlineScript: 'Script inline muito grande. Mova para arquivo externo.',
  multipleH1: 'Múltiplos <h1> detectados. Use apenas um por página para SEO/acessibilidade.',
  missingAriaMain: 'Página sem elemento <main> ou role="main" (navegação por landmarks).',
  missingAriaNav: 'Página sem elemento <nav> ou role="navigation" (navegação por landmarks).',
  missingAriaBanner: 'Página sem header com role="banner" (landmark de cabeçalho).',
  missingAriaContentinfo: 'Página sem footer com role="contentinfo" (landmark de rodapé).',
  missingAriaComplementary: 'Página sem aside ou role="complementary" (conteúdo relacionado).',
  formLabelMissing: 'Input sem <label> associado (acessibilidade). Use for/id ou wrap.',
  inputAutocompleteMissing: 'Input sem atributo autocomplete (usabilidade/UX).'
}, {
  doctype: 'Document without declared <!DOCTYPE html>.',
  htmlLang: '<html> element without lang attribute (accessibility).',
  metaCharset: 'Missing <meta charset="utf-8"> in document.',
  viewport: 'Missing viewport meta for responsiveness.',
  title: 'Document without defined <title>.',
  linkTargetBlank: 'Link with target="_blank" without rel="noreferrer"/"noopener".',
  linkNoHref: 'Link without valid href or without handler (UX). Use <button> or role="button".',
  imgWithoutAlt: 'Image without alt attribute or accessibility (WCAG 2.1).',
  imgWithoutLoading: 'Image without loading attribute (performance). Consider loading="lazy".',
  imgWithoutDimensions: 'Image without width/height (layout shift). Define dimensions to avoid CLS.',
  formWithoutMethod: 'Form without specified method (GET/POST).',
  formWithoutAction: 'Form without action or data-attribute for processing.',
  inputWithoutLabel: 'Input without name, id or aria-label (accessibility/usability).',
  passwordWithoutAutocomplete: 'Password field without specified autocomplete (security).',
  inputWithoutType: 'Input without specified type (assumes text, but be explicit).',
  inlineHandler: 'Inline handler detected (on*). Prefer external listeners or data-attributes with JS.',
  inlineScript: 'Inline script detected. Prefer external files for better cache and CSP.',
  inlineStyle: 'Inline style detected. Prefer external CSS files for better cache.',
  scriptWithoutDefer: 'Script without defer/async. May block rendering; consider defer.',
  headingSkipped: (current: number, expected: number) => `Skipped heading: h${current} without preceding h${expected} (semantic structure).`,
  buttonWithoutText: 'Button without text or aria-label (accessibility).',
  tableWithoutCaption: 'Table without <caption> or aria-label (accessibility).',
  iframeWithoutTitle: 'Iframe without title (accessibility).',
  largeInlineScript: 'Very large inline script. Move to external file.',
  multipleH1: 'Multiple <h1> detected. Use only one per page for SEO/accessibility.',
  missingAriaMain: 'Page without <main> element or role="main" (landmark navigation).',
  missingAriaNav: 'Page without <nav> or role="navigation" (landmark navigation).',
  missingAriaBanner: 'Page without header with role="banner" (header landmark).',
  missingAriaContentinfo: 'Page without footer with role="contentinfo" (footer landmark).',
  missingAriaComplementary: 'Page without aside or role="complementary" (related content).',
  formLabelMissing: 'Input without associated <label> (accessibility). Use for/id or wrap.',
  inputAutocompleteMissing: 'Input without autocomplete attribute (usability/UX).'
});

  /* -------------------------- MENSAGENS XML -------------------------- */

export const XmlMensagens = createI18nMessages({
  xmlPrologAusente: 'XML sem declaração <?xml ...?> (opcional, mas melhora compatibilidade).',
  doctypeDetectado: 'XML contém <!DOCTYPE>. Atenção a vetores de XXE (entidades externas).',
  doctypeExternoDetectado: 'XML contém DOCTYPE com identificador externo (SYSTEM/PUBLIC). Risco elevado de XXE se parser não for seguro.',
  entidadeDetectada: 'XML contém <!ENTITY>. Revise se há risco de expansão/XXE.',
  entidadeExternaDetectada: 'XML contém entidade externa (SYSTEM/PUBLIC). Risco alto de XXE se parser não for seguro.',
  entidadeParametroDetectada: 'XML contém entidade de parâmetro (<!ENTITY % ...>). Pode ser usada para XXE/DTD injection; revise com cuidado.',
  xincludeDetectado: 'XML contém XInclude (<xi:include>). Pode carregar recursos externos; valide origem e parser.',
  namespaceUndeclared: (prefix: string) => `Namespace prefix "${prefix}" usado sem declaração xmlns:${prefix}.`,
  invalidXmlStructure: 'Estrutura XML inválida detectada (tags não fechadas ou mal aninhadas).',
  encodingMismatch: (declared: string, detected: string) => `Encoding declarado (${declared}) não corresponde ao detectado (${detected}).`,
  largeEntityExpansion: 'Possível entidade com expansão muito grande. Risco de Billion Laughs attack.',
  cdataInAttribute: 'CDATA detectado em valor de atributo (inválido em XML).'
}, {
  xmlPrologAusente: 'XML without <?xml ...?> declaration (optional, but improves compatibility).',
  doctypeDetectado: 'XML contains <!DOCTYPE>. Watch out for XXE (External Entity) vectors.',
  doctypeExternoDetectado: 'XML contains DOCTYPE with external identifier (SYSTEM/PUBLIC). High risk of XXE if parser is not secure.',
  entidadeDetectada: 'XML contains <!ENTITY>. Check for expansion/XXE risks.',
  entidadeExternaDetectada: 'XML contains external entity (SYSTEM/PUBLIC). High risk of XXE if parser is not secure.',
  entidadeParametroDetectada: 'XML contains parameter entity (<!ENTITY % ...>). Can be used for XXE/DTD injection; review carefully.',
  xincludeDetectado: 'XML contains XInclude (<xi:include>). Can load external resources; validate source and parser.',
  namespaceUndeclared: (prefix: string) => `Namespace prefix "${prefix}" used without xmlns:${prefix} declaration.`,
  invalidXmlStructure: 'Invalid XML structure detected (unclosed or malnested tags).',
  encodingMismatch: (declared: string, detected: string) => `Declared encoding (${declared}) does not match detected (${detected}).`,
  largeEntityExpansion: 'Possible entity with very large expansion. Risk of Billion Laughs attack.',
  cdataInAttribute: 'CDATA detected in attribute value (invalid in XML).'
});

  /* -------------------------- MENSAGENS FORMATADOR (MIN) -------------------------- */

export const FormatadorMensagens = createI18nMessages({
  naoFormatado: (parser: string, detalhes?: string) => {
    const base = `Arquivo parece não estar formatado (parser: ${parser}). Considere normalizar com o formatador do Prometheus.`;
    if (!detalhes) return base;
    return `${base} (${detalhes})`;
  },
  parseErro: (parser: string, err: string) => `Falha ao validar formatação interna (parser: ${parser}): ${err}`
}, {
  naoFormatado: (parser: string, detalhes?: string) => {
    const base = `File seems not to be formatted (parser: ${parser}). Consider normalizing with Prometheus formatter.`;
    if (!detalhes) return base;
    return `${base} (${detalhes})`;
  },
  parseErro: (parser: string, err: string) => `Failed to validate internal formatting (parser: ${parser}): ${err}`
});

  /* -------------------------- MENSAGENS SVG (OTIMIZAÇÃO) -------------------------- */

export const SvgMensagens = createI18nMessages({
  naoPareceSvg: 'Arquivo .svg não contém uma tag <svg> válida.',
  semViewBox: 'SVG sem viewBox detectado (pode prejudicar responsividade).',
  scriptInline: 'SVG contém <script>. Risco de segurança: evite SVGs com script embutido.',
  eventoInline: 'SVG contém handlers inline (on*). Evite eventos inline em assets.',
  javascriptUrl: 'SVG contém javascript: em URL/href. Risco de segurança.',
  podeOtimizar: (originalBytes: number, optimizedBytes: number, mudancas: string[]) => `SVG pode ser otimizado (${originalBytes}B → ${optimizedBytes}B). Mudanças: ${mudancas.join(', ')}.`
}, {
  naoPareceSvg: '.svg file does not contain a valid <svg> tag.',
  semViewBox: 'SVG without viewBox detected (may hinder responsiveness).',
  scriptInline: 'SVG contains <script>. Security risk: avoid SVGs with embedded script.',
  eventoInline: 'SVG contains inline handlers (on*). Avoid inline events in assets.',
  javascriptUrl: 'SVG contains javascript: in URL/href. Security risk.',
  podeOtimizar: (originalBytes: number, optimizedBytes: number, mudancas: string[]) => `SVG can be optimized (${originalBytes}B → ${optimizedBytes}B). Changes: ${mudancas.join(', ')}.`
});

  /* -------------------------- MENSAGENS CSS-IN-JS -------------------------- */

export const CssInJsMensagens = createI18nMessages({
  detectedStyledComponents: 'Padrões de styled-components detectados (CSS-in-JS).',
  detectedStyledJsx: 'Padrões de styled-jsx detectados (CSS-in-JS em React).',
  globalStyles: (fonte: 'styled-components' | 'styled-jsx') => `Estilos globais detectados (${fonte}). Prefira escopo local quando possível.`,
  importantUsage: 'Uso de !important em CSS-in-JS detectado; prefira especificidade adequada.',
  httpUrl: 'Recurso externo via HTTP em url(); prefira HTTPS.'
}, {
  detectedStyledComponents: 'styled-components patterns detected (CSS-in-JS).',
  detectedStyledJsx: 'styled-jsx patterns detected (CSS-in-JS in React).',
  globalStyles: (fonte: 'styled-components' | 'styled-jsx') => `Global styles detected (${fonte}). Prefer local scope when possible.`,
  importantUsage: 'Use of !important in CSS-in-JS detected; prefer appropriate specificity.',
  httpUrl: 'External resource via HTTP in url(); prefer HTTPS.'
});

  /* -------------------------- MENSAGENS PYTHON -------------------------- */

export const PythonMensagens = createI18nMessages({
  // Imports & Dependencies
  missingTypeHints: 'Função sem type hints detectada; adicione type hints para melhor legibilidade.',
  hardcodedString: (string: string) => `String hardcoded detectada (${string.slice(0, 30)}...); considere usar constantes.`,
  httpWithoutVerify: 'Requisição HTTP sem verify=True detectada; valide certificados SSL.',
  sqlInjection: 'Possível SQL injection detectada; use prepared statements.',
  // Code Quality
  broadExcept: 'Exceção genérica (except:) detectada; seja específico.',
  bareRaise: 'raise sem contexto detectada; sempre passe a exceção para manter stack trace.',
  passInExcept: 'pass em except block; implemente tratamento de erro apropriado.',
  // Best Practices
  printInsteadOfLog: 'print() detectado; prefira logging module para produção.',
  evalUsage: 'eval() detectado; evite usar eval - vulnerabilidade de segurança.',
  execUsage: 'exec() detectado; evite usar exec - vulnerabilidade de segurança.',
  subprocessShellTrue: 'subprocess com shell=True detectado; risco de command injection. Prefira lista de args e shell=False.',
  pickleUsage: 'pickle load(s) detectado; nunca desserialize dados não confiáveis (RCE). Prefira formatos seguros (JSON).',
  yamlUnsafeLoad: 'yaml.load sem Loader seguro detectado; prefira yaml.safe_load (evita execução).',
  globalKeyword: 'Uso de global keyword detectado; prefira passar como parâmetro.',
  mutableDefault: 'Argumento com valor padrão mutável (list/dict) detectado; use None como padrão.',
  // Performance
  listComprehensionOpportunity: 'Loop que poderia ser list comprehension detectado.',
  loopingOverDict: 'Iteração sobre dict sem .items(); considere usar .items().'
}, {
  missingTypeHints: 'Function without type hints detected; add type hints for better readability.',
  hardcodedString: (string: string) => `Hardcoded string detected (${string.slice(0, 30)}...); consider using constants.`,
  httpWithoutVerify: 'HTTP request without verify=True detected; validate SSL certificates.',
  sqlInjection: 'Possible SQL injection detected; use prepared statements.',
  broadExcept: 'Generic exception (except:) detected; be specific.',
  bareRaise: 'raise without context detected; always pass the exception to maintain stack trace.',
  passInExcept: 'pass in except block; implement appropriate error handling.',
  printInsteadOfLog: 'print() detected; prefer logging module for production.',
  evalUsage: 'eval() detected; avoid using eval - security vulnerability.',
  execUsage: 'exec() detected; avoid using exec - security vulnerability.',
  subprocessShellTrue: 'subprocess with shell=True detected; risk of command injection. Prefer list of args and shell=False.',
  pickleUsage: 'pickle load(s) detected; never deserialize untrusted data (RCE). Prefer secure formats (JSON).',
  yamlUnsafeLoad: 'yaml.load without secure Loader detected; prefer yaml.safe_load (prevents execution).',
  globalKeyword: 'Use of global keyword detected; prefer passing as parameter.',
  mutableDefault: 'Argument with mutable default value (list/dict) detected; use None as default.',
  listComprehensionOpportunity: 'Loop that could be a list comprehension detected.',
  loopingOverDict: 'Iteration over dict without .items(); consider using .items().'
});

  /* -------------------------- Nivéis de Severidade -------------------------- */

export const SeverityNiveis = createI18nMessages({
  error: 'erro',
  warning: 'aviso',
  info: 'info',
  suggestion: 'sugestao'
}, {
  error: 'error',
  warning: 'warning',
  info: 'info',
  suggestion: 'suggestion'
});

  /* -------------------------- Categorias/Tipos de Analistas -------------------------- */

export const AnalystTipos = {
  react: 'react/regra',
  reactHooks: 'react-hooks/regra',
  tailwind: 'tailwindcss/regra',
  css: 'css/regra',
  html: 'html/regra',
  python: 'python/regra',
  xml: 'xml/regra',
  formatador: 'formatador/regra',
  svg: 'svg/regra',
  cssInJs: 'css-in-js/regra'
} as const;
export const AnalystOrigens = {
  react: 'analista-react',
  reactHooks: 'analista-react-hooks',
  tailwind: 'analista-tailwind',
  css: 'analista-css',
  html: 'analista-html',
  python: 'analista-python',
  xml: 'analista-xml',
  formatador: 'analista-formatador',
  svg: 'analista-svg',
  cssInJs: 'analista-css-in-js'
} as const;
