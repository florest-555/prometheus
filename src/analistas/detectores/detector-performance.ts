// SPDX-License-Identifier: MIT-0
// @prometheus-disable PROBLEMA_PERFORMANCE seguranca vulnerabilidade-seguranca
// Justificativa: detector de performance que analisa código-fonte - loops e padrões de segurança são esperados
import type { NodePath } from '@babel/traverse';
import type { CallExpression, ForStatement, Node } from '@babel/types';
import { config } from '@core/config/config.js';
import { traverse } from '@core/config/traverse.js';
import { DetectorAgregadosMensagens } from '@core/messages/analistas/detector-agregados-messages.js';
import { detectarContextoProjeto } from '@shared/contexto-projeto.js';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers/suppressao.js';

import type { ContextoExecucao, ContextoProjeto, Ocorrencia, ProblemaPerformance } from '@';
import { criarAnalista, criarOcorrencia } from '@';

const LIMITE_PERFORMANCE = config.ANALISE_LIMITES?.PERFORMANCE ?? {
  MAX_LOOPS_ANNIDED: 2,
  MAX_BLOCKING_OPS: 0,
  MAX_MEMORY_LEAKS: 0,
  MAX_N_PLUS_ONE: 0,
  MAX_INEFFICIENT_SPREAD: 0,
  MAX_LARGE_BUNDLE: 0,
  MAX_CONSOLE_LOG: 10,
  MAX_IGNORAR_TESTES: true
};

export const analistaDesempenho = criarAnalista({
  nome: 'performance',
  categoria: 'performance',
  descricao: 'Detecta problemas de performance e otimizações possíveis',
  limites: LIMITE_PERFORMANCE,
  test: (relPath: string): boolean => {
    return /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(relPath);
  },
  aplicar: async (src: string, relPath: string, ast: NodePath<Node> | null, _fullPath?: string, _contexto?: ContextoExecucao): Promise<Ocorrencia[] | null> => {
    if (!src) return null;
    const contextoArquivo = detectarContextoProjeto({
      arquivo: relPath,
      conteudo: src,
      relPath
    });
    const problemas: ProblemaPerformance[] = [];
    try {
      // Detectar problemas por padrões de texto
      detectarPadroesPerformance(src, problemas, relPath, contextoArquivo);

      // Detectar problemas via AST quando disponível
      if (ast) {
        detectarProblemasPerformanceAST(ast, problemas, relPath);
      }

      // Converter para ocorrências
      const ocorrencias: Ocorrencia[] = [];

      // Agrupar por impacto
      const porImpacto = agruparPorImpacto(problemas);
      for (const [impacto, items] of Object.entries(porImpacto)) {
        if (items.length > 0) {
          const nivel = mapearImpactoParaNivel(impacto as ProblemaPerformance['impacto']);

          // Ser menos rigoroso com testes
          const nivelAjustado = contextoArquivo.isTest && nivel === 'aviso' ? 'info' : nivel;
          const resumo = items.slice(0, 3).map(p => p.tipo).join(', ');
          ocorrencias.push(criarOcorrencia({
            tipo: 'PROBLEMA_PERFORMANCE',
            nivel: nivelAjustado,
            mensagem: DetectorAgregadosMensagens.problemasPerformanceResumo(impacto, resumo, items.length),
            relPath,
            linha: items[0].linha
          }));
        }
      }

      // Aplicar supressões inline antes de retornar
      return filtrarOcorrenciasSuprimidas(ocorrencias, 'performance', src);
    } catch (erro) {
      return [criarOcorrencia({
        tipo: 'ERRO_ANALISE',
        nivel: 'aviso',
        mensagem: DetectorAgregadosMensagens.erroAnalisarPerformance(erro),
        relPath,
        linha: 1
      })];
    }
  }
});
function detectarConsoleEmProducao(linha: string, numeroLinha: number, problemas: ProblemaPerformance[], todasLinhas?: string[]): void {
  const ignorePatterns = [
    /\/\/\s*prometheus-ignore|\/\*\s*prometheus-ignore/i,
    /\/\/\s*debug\s*/i,
    /\/\/\s* eslint-disable/i,
  ];

  const isJSDocComment = /^\s*\*\s/.test(linha) || /^\s*\/\*\*/.test(linha);
  if (isJSDocComment) return;

  const isInlineComment = /^\s*\/\//.test(linha);
  if (isInlineComment) return;

  // Verificar se linha anterior ou anterior-a-anterior tem comment de suppressão
  if (todasLinhas && numeroLinha > 1) {
    const linhaAnterior = todasLinhas[numeroLinha - 2];
    const linhaAnterior2 = numeroLinha > 2 ? todasLinhas[numeroLinha - 3] : '';
    if ((linhaAnterior && ignorePatterns.some(p => p.test(linhaAnterior))) ||
        (linhaAnterior2 && ignorePatterns.some(p => p.test(linhaAnterior2)))) {
      return;
    }
  }

  const consolePatterns = [
    /console\.(error|warn)\s*\(/,
  ];

  for (const pattern of consolePatterns) {
    if (pattern.test(linha)) {
      // Verificar se está em um contexto ignorado
      const shouldIgnore = ignorePatterns.some(ignorePattern => ignorePattern.test(linha));
      if (shouldIgnore) continue;

      problemas.push({
        tipo: 'console-in-production',
        descricao: 'Console.error/warn em código pode vazar informações em produção',
        impacto: 'baixo',
        linha: numeroLinha,
        coluna: linha.indexOf('console') + 1,
        // prometheus-ignore: console-in-production - mensagem de sugestao do proprio detector
        sugestao: 'Remova console.error/warn em produção ou use biblioteca de logging condicional'
      });
      return;
    }
  }
}

// Memory leak detection now handled by addEventListener check in detectarPadroesPerformance

function detectarDOMManipulation(linha: string, numeroLinha: number, problemas: ProblemaPerformance[]): void {
  // Apenas detectar patterns que são genuinamente problemáticos
  // Removido: createElement().appendChild (pode ser válido)
  const domPatterns = [
    /\.innerHTML\s*=/,  // XSS risk
    /\.outerHTML\s*=/,  // Pode ser problemático
  ];

  for (const pattern of domPatterns) {
    if (pattern.test(linha)) {
      const match = linha.match(pattern);
      const matchStr = match ? match[0] : '';
      problemas.push({
        tipo: 'inefficient-dom',
        descricao: 'Manipulação direta de DOM pode causar reflows/repaints desnecessários',
        impacto: 'baixo', // Reduzido de 'medio' - innerHTML é comum e útil
        linha: numeroLinha,
        coluna: linha.indexOf(matchStr) + 1,
        sugestao: 'Use fragment ou batch operações DOM para minimizar reflows'
      });
      return;
    }
  }
}

function detectarInefficientArray(linha: string, numeroLinha: number, problemas: ProblemaPerformance[]): void {
  // Apenas detectar patterns que são genuinamente problemáticos
  // Removido: forEach detectado como ineficiente (muitos casos de uso válidos)
  // Removido: filter().map() detectado (pode ser mais legível que reduce)
  const patterns = [
    // Apenas detectar sort sem优化 (sort em render pode ser lento)
    { regex: /\.sort\s*\(\s*\([^)]*\)\s*=>\s*\w+\.\w+\s*-\s*\w+\.\w+\s*\)/, tipo: 'inefficient-sort', descricao: 'Função de sort sem memoization pode ser lenta em grandes listas', sugestao: 'Considere usar sort fora do render ou com useMemo' },
  ];

  for (const p of patterns) {
    if (p.regex.test(linha)) {
      problemas.push({
        tipo: p.tipo,
        descricao: p.descricao,
        impacto: 'baixo', // Reduzido de 'baixo' para info
        linha: numeroLinha,
        coluna: linha.indexOf(p.regex.source.replace(/\\/g, '').split('(')[0]) + 1,
        sugestao: p.sugestao
      });
      return;
    }
  }
}

function detectarPadroesPerformance(src: string, problemas: ProblemaPerformance[], relPath: string, contexto?: ContextoProjeto): void {
  const linhas = src.split('\n');
  let dentroLoop = 0;

  linhas.forEach((linha, index) => {
    const numeroLinha = index + 1;

    // Novas detecções de performance (memory leak now handled in addEventListener check below)
    detectarConsoleEmProducao(linha, numeroLinha, problemas, linhas);
    detectarDOMManipulation(linha, numeroLinha, problemas);
    detectarInefficientArray(linha, numeroLinha, problemas);

    // Detectar entrada de loops
    if (/\b(for|while)\s*\(/.test(linha)) {
      dentroLoop++;

      // Se já estamos em um loop e encontramos outro, é loop aninhado
      if (dentroLoop > 1) {
        problemas.push({
          tipo: 'inefficient-loop',
          descricao: 'Loops aninhados podem causar problemas de performance O(n²)',
          impacto: 'alto',
          linha: numeroLinha,
          coluna: linha.indexOf('for') !== -1 ? linha.indexOf('for') + 1 : linha.indexOf('while') + 1,
          sugestao: 'Considere usar Map, Set ou otimizar algoritmo para complexidade linear'
        });
      }
    }

    // Detectar saída de loops (simplificado)
    if (/^\s*}/.test(linha) && dentroLoop > 0) {
      dentroLoop = Math.max(0, dentroLoop - 1);
    }

    // Operações síncronas bloqueantes - apenas em arquivos de servidor (não em testes)
    if (/\b(readFileSync|writeFileSync|execSync)\s*\(/.test(linha) && !relPath.includes('.test.') && !relPath.includes('.spec.')) {
      problemas.push({
        tipo: 'blocking-operation',
        descricao: 'Operação síncrona pode bloquear event loop',
        impacto: 'baixo', // Reduzido de 'alto' - pode ser válido em scripts/CLI
        linha: numeroLinha,
        coluna: linha.indexOf(/readFileSync|writeFileSync|execSync/.exec(linha)?.[0] || '') + 1,
        sugestao: 'Use versões assíncronas: readFile, writeFile, exec'
      });
    }

  // Event listeners sem cleanup - apenas reportar se realmente parecer um problema
  // Reduzir falsos positivos verificando se há padrões de cleanup no código
  if (/addEventListener\s*\(/.test(linha)) {
    // Verificar se há removeEventListener no código (ignorando comentários)
    const srcSemComentarios = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

    // Apenas reportar se NÃO há nenhum padrão de cleanup
    // Ignorar se: removeEventListener existe OU cleanup/destroy existem OU é arquivo de teste
    if (!srcSemComentarios.includes('removeEventListener') &&
        !srcSemComentarios.includes('cleanup') &&
        !srcSemComentarios.includes('destroy') &&
        !relPath.includes('.test.') &&
        !relPath.includes('.spec.')) {
      problemas.push({
        tipo: 'memory-leak',
        descricao: 'Event listener pode causar vazamento de memória',
        impacto: 'baixo', // Reduzido de 'medio' para evitar falsos positivos
        linha: numeroLinha,
        coluna: linha.indexOf('addEventListener') + 1,
        sugestao: 'Adicione removeEventListener em cleanup/destroy'
      });
    }
  }

    // React: map sem key (detecção melhorada)
    // Não reportar para Server Components (não fazem re-renders) ou se já tem key
    const mapPattern = /\.map\s*\([^)]*\)/.test(linha);
    const isJsxLine = /return\s*<|<\w+/.test(linha) || relPath.includes('.tsx') || relPath.includes('.jsx');
    const needsKey = !linha.includes('key=');
    const isServerComp = contexto?.isServerComponent === true;
    const isAsyncFunction = /async\s+function|function\s+async|\=>\s*async/.test(linha);

    if (mapPattern && isJsxLine && needsKey && !isServerComp && !isAsyncFunction && !/useRouter\s*\(/.test(src)) {
      problemas.push({
        tipo: 'unnecessary-rerender',
        descricao: 'React map sem key prop pode causar rerenders desnecessários',
        impacto: 'medio',
        linha: numeroLinha,
        coluna: linha.indexOf('.map') + 1,
        sugestao: 'Adicione key prop única para cada elemento da lista'
      });
    }

    // N+1 queries pattern
    if (/\.forEach\s*\(.*\.(find|get|query|select)\s*\(/.test(linha)) {
      problemas.push({
        tipo: 'n-plus-one',
        descricao: 'Possível problema N+1 em consultas',
        impacto: 'alto',
        linha: numeroLinha,
        coluna: linha.indexOf('.forEach') + 1,
        sugestao: 'Use join/include ou agrupe consultas para evitar N+1'
      });
    }

    // Inefficient spread in loops
    if (dentroLoop > 0 && (linha.includes('= [...') || linha.includes('= { ...'))) {
      problemas.push({
        tipo: 'inefficient-spread',
        descricao: 'Spread operator dentro de loop cria novo objeto/array a cada iteração',
        impacto: 'alto',
        linha: numeroLinha,
        coluna: linha.indexOf('...') + 1,
        sugestao: 'Use push() ou mutação controlada para evitar criação excessiva de objetos'
      });
    }

    // Imports de bibliotecas grandes
    if (/import.*from\s+['"]lodash['"]|import.*from\s+['"]moment['"]/.test(linha)) {
      problemas.push({
        tipo: 'large-bundle',
        descricao: 'Import completo de biblioteca grande pode aumentar bundle',
        impacto: 'medio',
        linha: numeroLinha,
        coluna: linha.indexOf('import') + 1,
        sugestao: 'Use imports específicos: import { method } from "lodash/method"'
      });
    }

    // JSON.parse grande sem try-catch
    // Verificar se há try-catch ao redor do JSON.parse (em linhas anteriores ou seguintes)
    if (/JSON\.parse\s*\([^)]+\)/.test(linha)) {
      const linhasArray = src.split('\n');
      const contextoInicio = Math.max(0, index - 5);
      const contextoFim = Math.min(linhasArray.length, index + 5);
      const contexto = linhasArray.slice(contextoInicio, contextoFim).join('\n');
      const hasTryCatch = /\btry\s*\{[\s\S]*?JSON\.parse|JSON\.parse[\s\S]*?catch/.test(contexto);

      if (!hasTryCatch) {
        problemas.push({
          tipo: 'json-parse-unchecked',
          descricao: 'JSON.parse sem tratamento de erro pode causar crash',
          impacto: 'medio',
          linha: numeroLinha,
          coluna: linha.indexOf('JSON.parse') + 1,
          sugestao: 'Use try-catch: try { JSON.parse(str) } catch (e) { ... }'
        });
      }
    }

    // setTimeout/setInterval sem throttle em evento frequente
    if (/\bsetTimeout\s*\(|setInterval\s*\(/.test(linha)) {
      const eventosFrequentes = /onclick|onmousemove|onkeydown|oninput|onscroll|onresize/i;
      if (eventosFrequentes.test(linha)) {
        problemas.push({
          tipo: 'missing-throttle',
          descricao: 'Handler em evento frequente sem throttle/debounce pode causar many calls',
          impacto: 'alto',
          linha: numeroLinha,
          coluna: linha.indexOf('setTimeout') + 1,
          sugestao: 'Use throttle/debounce: lodash.throttle ou custom implementation'
        });
      }
    }

    // document.cookie acesso frequente
    if (/document\.cookie\s*=/.test(linha)) {
      problemas.push({
        tipo: 'cookie-write-frequent',
        descricao: 'Escrita frequente em document.cookie pode causar performance issues',
        impacto: 'baixo',
        linha: numeroLinha,
        coluna: linha.indexOf('document.cookie') + 1,
        sugestao: 'Minimize escritas em cookie, use localStorage/sessionStorage para dados maiores'
      });
    }
  });
}
function detectarProblemasPerformanceAST(ast: NodePath<Node>, problemas: ProblemaPerformance[], relPath: string): void {
  try {
    traverse(ast.node, {
      // Detectar loops aninhados via AST (mais preciso)
      ForStatement(path: NodePath<ForStatement>) {
        let parent = path.parent;
        while (parent) {
          if (parent.type === 'ForStatement' || parent.type === 'WhileStatement' || parent.type === 'DoWhileStatement') {
            problemas.push({
              tipo: 'inefficient-loop',
              descricao: 'Loop aninhado detectado via AST - pode causar performance O(n²)',
              impacto: 'alto',
              linha: path.node.loc?.start.line || 0,
              coluna: path.node.loc?.start.column || 0,
              sugestao: 'Considere restruturar algoritmo para evitar complexidade quadrática'
            });
            break;
          }
          parent = (parent as NodePath).parent; // Parent NodePath
        }
      },
      // Detectar função setTimeout/setInterval sem cleanup
      CallExpression(path: NodePath<CallExpression>) {
        if (path.node.callee.type === 'Identifier' && (path.node.callee.name === 'setTimeout' || path.node.callee.name === 'setInterval')) {
          // Verificar se há clearTimeout/clearInterval no escopo
          const binding = path.scope.getBinding(path.node.callee.name);
          if (!binding) return;

          // Heurística simples: se não há clear* na mesma função/arquivo
          const parentFunction = path.getFunctionParent();
          if (parentFunction && !parentFunction.toString().includes('clear') && !relPath.includes('test')) {
            problemas.push({
              tipo: 'memory-leak',
              descricao: `${path.node.callee.name} sem cleanup pode causar vazamento`,
              impacto: 'medio',
              linha: path.node.loc?.start.line || 0,
              coluna: path.node.loc?.start.column || 0,
              sugestao: `Use clear${path.node.callee.name.replace('set', '')} para limpar`
            });
          }
        }
      }
    });
  } catch {
    // Ignorar erros de traverse
  }
}
function agruparPorImpacto(problemas: ProblemaPerformance[]): Record<string, ProblemaPerformance[]> {
  return problemas.reduce((acc, problema) => {
    const impacto = problema.impacto;
    if (impacto) {
      if (!acc[impacto]) {
        acc[impacto] = [];
      }
      acc[impacto].push(problema);
    }
    return acc;
  }, {} as Record<string, ProblemaPerformance[]>);
}
function mapearImpactoParaNivel(impacto: ProblemaPerformance['impacto']): 'info' | 'aviso' | 'erro' {
  switch (impacto) {
    case 'alto':
      return 'aviso';
    case 'medio':
      return 'aviso';
    case 'baixo':
    default:
      return 'info';
  }
}
