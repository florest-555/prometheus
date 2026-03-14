// SPDX-License-Identifier: MIT-0
/**
 * [PLUG] Plugins do Prometheus
 *
 * Analistas e detectores especializados que podem ser habilitados/desabilitados.
 * São opcionais e carregados dinamicamente pelo registry.
 *
 * Plugins de Linguagem/Framework:
 * - analista-react.ts       - React (JSX/TSX)
 * - analista-react-hooks.ts - React Hooks
 * - analista-tailwind.ts    - Tailwind CSS
 * - analista-css.ts         - CSS puro
 * - analista-css-in-js.ts   - CSS-in-JS (styled-components/styled-jsx)
 * - analista-html.ts        - HTML
 * - analista-formater.ts    - Formatação mínima (JSON/MD/YAML)
 * - analista-svg.ts         - Heurísticas + otimização SVG
 * - analista-python.ts      - Python
 * - analista-xml.ts         - XML (heurísticas + XXE)
 * - analista-github-actions.ts - GitHub Actions (CI/CD)
 *
 * Detectores Especializados:
 * - detector-documentacao.ts     - Qualidade de documentação
 * - detector-markdown.ts         - Análise de Markdown
 * - detector-node.ts             - Padrões Node.js
 * - detector-qualidade-testes.ts - Qualidade de testes
 * - detector-xml.ts              - Análise de XML
 */

// Analistas de linguagem/framework
export { analistaCss } from '@analistas/plugins/analista-css.js';
export { analistaCssInJs } from '@analistas/plugins/analista-css-in-js.js';
export { analistaFormatador } from '@analistas/plugins/analista-formater.js';
export { analistaGithubActions } from '@analistas/plugins/analista-github-actions.js';
export { analistaHtml } from '@analistas/plugins/analista-html.js';
export { analistaPython } from '@analistas/plugins/analista-python.js';
export { analistaReact } from '@analistas/plugins/analista-react.js';
export { analistaReactHooks } from '@analistas/plugins/analista-react-hooks.js';
export { analistaSvg } from '@analistas/plugins/analista-svg.js';
export { analistaTailwind } from '@analistas/plugins/analista-tailwind.js';
export { analistaXml } from '@analistas/plugins/analista-xml.js';

// Detectores especializados
export { analistaDocumentacao } from '@analistas/plugins/detector-documentacao.js';
export { detectorMarkdown } from '@analistas/plugins/detector-markdown.js';
export { detectarArquetipoNode } from '@analistas/plugins/detector-node.js';
export { analistaQualidadeTestes } from '@analistas/plugins/detector-qualidade-testes.js';
export { detectarArquetipoXML } from '@analistas/plugins/detector-xml.js';
