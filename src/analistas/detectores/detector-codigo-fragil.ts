// SPDX-License-Identifier: MIT-0
import type { NodePath } from '@babel/traverse';
import type { ArrowFunctionExpression, CallExpression, CatchClause, ClassMethod, FunctionDeclaration, FunctionExpression, Node, NumericLiteral, TSAnyKeyword } from '@babel/types';
import { config } from '@core/config/config.js';
import { traverse } from '@core/config/traverse.js';
import { DetectorCodigoFragilMensagens } from '@core/messages/analistas/detector-codigo-fragil-messages.js';
import { detectarFrameworks } from '@shared/helpers/framework-detector.js';
import { isWhitelistedConstant } from '@shared/helpers/magic-constants-whitelist.js';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers/suppressao.js';

import type { ContextoExecucao,Fragilidade, Ocorrencia } from '@';
import { criarAnalista, criarOcorrencia } from '@';

// Cache de frameworks detectados (evita múltiplas leituras do package.json)
let frameworksDetectados: string[] | null = null;
const LIMITES = {
  LINHAS_FUNCAO: 30,
  PARAMETROS_FUNCAO: 4,
  MAX_PARAMETROS_CRITICO: 6,
  CALLBACKS_ANINHADOS: 2,
  COMPLEXIDADE_COGNITIVA: 15,
  REGEX_COMPLEXA_LENGTH: 50
} as const;

export const analistaCodigoFragil = criarAnalista({
  nome: 'codigo-fragil',
  categoria: 'qualidade',
  descricao: 'Detecta padrões de código que podem levar a problemas futuros',
  limites: {
    maxLinhasFuncao: config.ANALISE_LIMITES?.CODIGO_FRAGIL?.MAX_LINHAS_FUNCAO ?? LIMITES.LINHAS_FUNCAO,
    maxParametros: config.ANALISE_LIMITES?.CODIGO_FRAGIL?.MAX_PARAMETROS ?? LIMITES.PARAMETROS_FUNCAO,
    maxNestedCallbacks: config.ANALISE_LIMITES?.CODIGO_FRAGIL?.MAX_NESTED_CALLBACKS ?? LIMITES.CALLBACKS_ANINHADOS
  },
  test: (relPath: string): boolean => {
    if (/\.(deprecados?|abandonados?)\//i.test(relPath) || relPath.includes('.deprecados/') || relPath.includes('abandonados/')) {
      return false;
    }
    return /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(relPath);
  },
  aplicar: async (src: string, relPath: string, ast: NodePath<Node> | null, _fullPath?: string, _contexto?: ContextoExecucao): Promise<Ocorrencia[] | null> => {
    if (!ast || !src) {
      return null;
    }

    // Limites efetivos (lidos dinamicamente para respeitar overrides por env/config)
    const maxLinhasFuncao = config.ANALISE_LIMITES?.CODIGO_FRAGIL?.MAX_LINHAS_FUNCAO ?? LIMITES.LINHAS_FUNCAO;
    const maxParametros = config.ANALISE_LIMITES?.CODIGO_FRAGIL?.MAX_PARAMETROS ?? LIMITES.PARAMETROS_FUNCAO;
    const maxNestedCallbacks = config.ANALISE_LIMITES?.CODIGO_FRAGIL?.MAX_NESTED_CALLBACKS ?? LIMITES.CALLBACKS_ANINHADOS;
    const fragilidades: Fragilidade[] = [];
    try {
      // Detectar problemas baseados em texto
      detectarConsoleLog(src, fragilidades);
      detectarTodoComments(src, fragilidades);

      // Detecções avançadas baseadas em texto
      detectarProblemasAvancados(src, fragilidades);

      // Detectar problemas via AST
      traverse(ast.node, {
        // Blocos catch vazios
        CatchClause(path: NodePath<CatchClause>) {
          const body = path.node.body.body;
          const linha = path.node.loc?.start.line || 0;
          if (body.length === 0) {
            fragilidades.push({
              tipo: 'catch-vazio',
              linha,
              coluna: path.node.loc?.start.column || 0,
              severidade: 'media',
              contexto: 'Bloco catch vazio'
            });
          } else if (body.length === 1 && isSingleConsoleLog(body[0])) {
            fragilidades.push({
              tipo: 'catch-apenas-log',
              linha,
              coluna: path.node.loc?.start.column || 0,
              severidade: 'baixa',
              contexto: 'Catch apenas com console.log'
            });
          }
        },
        // Uso explícito de 'any'
        TSAnyKeyword(path: NodePath<TSAnyKeyword>) {
          fragilidades.push({
            tipo: 'any-explicito',
            linha: path.node.loc?.start.line || 0,
            coluna: path.node.loc?.start.column || 0,
            severidade: 'media',
            contexto: 'Tipo any explícito'
          });
        },
        // Funções muito longas + muitos parâmetros
        FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
          const node = path.node;

          // Verificar tamanho da função
          if (node.body?.type === 'BlockStatement') {
            const inicio = node.loc?.start.line || 0;
            const fim = node.loc?.end.line || 0;
            const numLinhas = fim - inicio;
            if (numLinhas > maxLinhasFuncao) {
              fragilidades.push({
                tipo: 'funcao-longa',
                linha: inicio,
                coluna: node.loc?.start.column || 0,
                severidade: numLinhas > Math.max(maxLinhasFuncao + 20, Math.floor(maxLinhasFuncao * 1.7)) ? 'alta' : 'media',
                contexto: `Função com ${numLinhas} linhas (máx: ${maxLinhasFuncao})`
              });
            }
          }

          // Verificar número de parâmetros
          const numParams = node.params.length;
          if (numParams > maxParametros) {
            fragilidades.push({
              tipo: 'muitos-parametros',
              linha: node.loc?.start.line || 0,
              coluna: node.loc?.start.column || 0,
              severidade: numParams > Math.max(maxParametros + 2, Math.floor(maxParametros * 1.5)) ? 'alta' : 'media',
              contexto: `Função com ${numParams} parâmetros (máx: ${maxParametros})`
            });
          }

          // Complexidade Cognitiva (AST)
          const comp = calcularComplexidadeCognitivaAST(path);
          if (comp > LIMITES.COMPLEXIDADE_COGNITIVA) {
            fragilidades.push({
              tipo: 'cognitive-complexity',
              linha: node.loc?.start.line || 0,
              coluna: node.loc?.start.column || 0,
              severidade: comp > LIMITES.COMPLEXIDADE_COGNITIVA * 2 ? 'alta' : 'media',
              contexto: `Complexidade cognitiva elevada: ${comp} (limite: ${LIMITES.COMPLEXIDADE_COGNITIVA})`
            });
          }
        },
        ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
          const node = path.node;
          if (node.body?.type === 'BlockStatement') {
            const inicio = node.loc?.start.line || 0;
            const fim = node.loc?.end.line || 0;
            const numLinhas = fim - inicio;
            if (numLinhas > maxLinhasFuncao) {
              fragilidades.push({
                tipo: 'funcao-longa',
                linha: inicio,
                coluna: node.loc?.start.column || 0,
                severidade: numLinhas > Math.max(maxLinhasFuncao + 20, Math.floor(maxLinhasFuncao * 1.7)) ? 'alta' : 'media',
                contexto: `Arrow function with ${numLinhas} lines (max: ${maxLinhasFuncao})`
              });
            }

            // Complexidade Cognitiva
            const comp = calcularComplexidadeCognitivaAST(path);
            if (comp > LIMITES.COMPLEXIDADE_COGNITIVA) {
              fragilidades.push({
                tipo: 'cognitive-complexity',
                linha: inicio,
                coluna: node.loc?.start.column || 0,
                severidade: comp > LIMITES.COMPLEXIDADE_COGNITIVA * 2 ? 'alta' : 'media',
                contexto: `Complexidade cognitiva elevada (arrow): ${comp} (limite: ${LIMITES.COMPLEXIDADE_COGNITIVA})`
              });
            }
          }
        },
        FunctionExpression(path: NodePath<FunctionExpression>) {
          const node = path.node;
          if (node.body?.type === 'BlockStatement') {
            const inicio = node.loc?.start.line || 0;
            const fim = node.loc?.end.line || 0;
            const numLinhas = fim - inicio;
            if (numLinhas > maxLinhasFuncao) {
              fragilidades.push({
                tipo: 'funcao-longa',
                linha: inicio,
                coluna: node.loc?.start.column || 0,
                severidade: numLinhas > Math.max(maxLinhasFuncao + 20, Math.floor(maxLinhasFuncao * 1.7)) ? 'alta' : 'media',
                contexto: `Function expression with ${numLinhas} lines (max: ${maxLinhasFuncao})`
              });
            }

            // Complexidade Cognitiva
            const comp = calcularComplexidadeCognitivaAST(path);
            if (comp > LIMITES.COMPLEXIDADE_COGNITIVA) {
              fragilidades.push({
                tipo: 'cognitive-complexity',
                linha: inicio,
                coluna: node.loc?.start.column || 0,
                severidade: comp > LIMITES.COMPLEXIDADE_COGNITIVA * 2 ? 'alta' : 'media',
                contexto: `Complexidade cognitiva elevada: ${comp} (limite: ${LIMITES.COMPLEXIDADE_COGNITIVA})`
              });
            }
          }
        },
        // Números mágicos - apenas reportar se for valor não-comum
        NumericLiteral(path: NodePath<NumericLiteral>) {
          const value = path.node.value;

          // Ignorar valores comuns que sempre são válidos
          // Indices de array (0, 1) são frequentes e esperados
          if (isInVariableDeclarator(path) || isInArrayIndex(path)) {
            return;
          }

          // Ignorar números negativos comuns (-1 para not found)
          if (value === -1) {
            return;
          }

          // Detectar frameworks do projeto (cache básico via closure)
          if (!frameworksDetectados) {
            const rootDir = process.cwd();
            const frameworks = detectarFrameworks(rootDir);
            frameworksDetectados = frameworks.map(f => f.name);
          }

          // Verificar se está na whitelist (valores comuns + limites de frameworks)
          if (isWhitelistedConstant(value, frameworksDetectados)) {
            return;
          }

          // Apenas reportar números maiores que 1 dígito para evitar falsos positivos
          if (Math.abs(value) >= 10) {
            fragilidades.push({
              tipo: 'magic-number',
              linha: path.node.loc?.start.line || 0,
              coluna: path.node.loc?.start.column || 0,
              severidade: 'baixa',
              contexto: `Número mágico: ${value}`
            });
          }
        },
        // Muitos parâmetros - ClassMethod
        ClassMethod(path: NodePath<ClassMethod>) {
          const node = path.node;
          const numParams = node.params && Array.isArray(node.params) ? node.params.length : 0;
          if (numParams > LIMITES.PARAMETROS_FUNCAO) {
            fragilidades.push({
              tipo: 'muitos-parametros',
              linha: node.loc?.start.line || 0,
              coluna: node.loc?.start.column || 0,
              severidade: numParams > LIMITES.MAX_PARAMETROS_CRITICO ? 'alta' : 'media',
              contexto: `Método com ${numParams} parâmetros`
            });
          }

          // Complexidade Cognitiva
          const comp = calcularComplexidadeCognitivaAST(path);
          if (comp > LIMITES.COMPLEXIDADE_COGNITIVA) {
            fragilidades.push({
              tipo: 'cognitive-complexity',
              linha: node.loc?.start.line || 0,
              coluna: node.loc?.start.column || 0,
              severidade: comp > LIMITES.COMPLEXIDADE_COGNITIVA * 2 ? 'alta' : 'media',
              contexto: `Complexidade cognitiva elevada (método): ${comp} (limite: ${LIMITES.COMPLEXIDADE_COGNITIVA})`
            });
          }
        }
      });

      // Detectar callbacks aninhados (requer análise específica)
      detectarNestedCallbacks(ast, fragilidades, maxNestedCallbacks);

      // Detectar code smells avançados
      detectarGodObjects(ast, fragilidades, 10);
      detectarFeatureEnvy(ast, fragilidades, 5);
      detectarDataClumps(ast, fragilidades, 3);

      // Gerar ocorrências por severidade
      const ocorrencias: Ocorrencia[] = [];

      // Agrupar por severidade
      const porSeveridade = agruparPorSeveridade(fragilidades);
      for (const [severidade, items] of Object.entries(porSeveridade)) {
        if (items.length > 0) {
          const nivel = severidade === 'alta' ? 'erro' : severidade === 'media' ? 'aviso' : 'info';

          // Criar resumo por tipo
          const resumoPorTipo = items.reduce((acc, item) => {
            acc[item.tipo] = (acc[item.tipo] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const resumo = Object.entries(resumoPorTipo).map(([tipo, count]) => `${tipo}: ${count}`).join(', ');
          ocorrencias.push(criarOcorrencia({
            tipo: 'codigo-fragil',
            nivel,
            mensagem: DetectorCodigoFragilMensagens.fragilidadesResumo(severidade, resumo, {
              severidade,
              total: items.length,
              tipos: resumoPorTipo,
              amostra: items.slice(0, 3).map(f => `${f.tipo}:L${f.linha}`)
            }),
            relPath,
            linha: items[0].linha
          }));
        }
      }

      // Aplicar supressões inline antes de retornar
      return filtrarOcorrenciasSuprimidas(ocorrencias, 'codigo-fragil', src);
    } catch (erro) {
      return [criarOcorrencia({
        tipo: 'ERRO_ANALISE',
        nivel: 'aviso',
        mensagem: DetectorCodigoFragilMensagens.erroAnalisarCodigoFragil(erro),
        relPath,
        linha: 1
      })];
    }
  }
});

function detectarConsoleLog(src: string, fragilidades: Fragilidade[]): void {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Ignorar linhas comentadas (// ou /* ... */)
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') && trimmedLine.endsWith('*/')) {
      continue;
    }

    // Detectar console.log não comentado
    const consoleMatch = line.match(/console\.(log|debug|info)\s*\(/);
    if (consoleMatch) {
      // Verificar se não está dentro de comentário de bloco
      const beforeMatch = line.substring(0, consoleMatch.index);
      if (beforeMatch.includes('/*') && !beforeMatch.includes('*/')) {
        continue; // Está dentro de comentário de bloco
      }

      // Reduzir severidade para info (console.log em dev é válido)
      fragilidades.push({
        tipo: 'console-log',
        linha: i + 1,
        coluna: consoleMatch.index || 0,
        severidade: 'baixa',
        contexto: 'console.log encontrado - considere remover em produção'
      });
    }
  }
}
function detectarTodoComments(src: string, fragilidades: Fragilidade[]): void {
  const regex = /\/\/\s*TODO|\/\*\s*TODO/gi;
  let match;
  while ((match = regex.exec(src)) !== null) {
    const linha = src.substring(0, match.index).split('\n').length;
    fragilidades.push({
      tipo: 'todo-comment',
      linha,
      coluna: 0,
      severidade: 'baixa',
      contexto: 'Comentário TODO encontrado'
    });
  }
}

/**
 * Detecta problemas avançados de código que indicam fragilidade (não duplicados com outros analistas)
 */
function detectarProblemasAvancados(src: string, fragilidades: Fragilidade[]): void {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Ignorar linhas comentadas
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') && trimmedLine.endsWith('*/')) {
      continue;
    }

    // Promise sem catch (exclusivo - não coberto por outros analistas)
    if (/\.then\s*\(/.test(line) && !line.includes('.catch')) {
      const nextLines = lines.slice(i, Math.min(i + 3, lines.length)).join(' ');
      if (!nextLines.includes('.catch')) {
        fragilidades.push({
          tipo: 'promise-sem-catch',
          linha: i + 1,
          coluna: line.indexOf('.then'),
          severidade: 'media',
          contexto: 'Promise sem tratamento de erro (.catch)'
        });
      }
    }

    // addEventListener sem removeEventListener (detecção aprimorada)
    if (/addEventListener\s*\(/.test(line)) {
      const eventNome = line.match(/addEventListener\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (eventNome && !src.includes(`removeEventListener`) && !src.includes(`{ once: true }`) && !src.includes('AbortController')) {
        fragilidades.push({
          tipo: 'event-listener-sem-cleanup',
          linha: i + 1,
          coluna: line.indexOf('addEventListener'),
          severidade: 'media',
          contexto: `Event listener '${eventNome[1]}' sem cleanup`
        });
      }
    }

    // Regex complexa (mais de 50 caracteres com múltiplos grupos)
    const regexMatch = line.match(/\/([^\/\\]|\\.)+\/[gimuy]*/);
    if (regexMatch && regexMatch[0].length > LIMITES.REGEX_COMPLEXA_LENGTH && (regexMatch[0].match(/\(/g) || []).length > 3) {
      fragilidades.push({
        tipo: 'regex-complexa',
        linha: i + 1,
        coluna: line.indexOf(regexMatch[0]),
        severidade: 'media',
        contexto: 'Regex complexa - considere quebrar em partes menores'
      });
    }

    // Potencial vazamento de memória - setInterval/setTimeout sem clear + addEventListener sem remove
    // Ignorar se há useEffect com cleanup ou clearTimeout/clearInterval no código
    const hasUseEffectCleanup = /useEffect\s*\([^)]*=>\s*\{[^}]*return\s*\(\s*\)\s*=>/.test(src) ||
                                /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*return\s+function/.test(src) ||
                                /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*clear(Timer|Interval)/.test(src);
    const hasClearTimer = src.includes('clearTimeout') || src.includes('clearInterval');

    if ((/setInterval\s*\(/.test(line) || /setTimeout\s*\(/.test(line)) &&
        !hasClearTimer &&
        !hasUseEffectCleanup &&
        !line.includes('once')) {
      fragilidades.push({
        tipo: 'memory-leak-potential',
        linha: i + 1,
        coluna: line.search(/setInterval|setTimeout/),
        severidade: 'media',
        contexto: 'Potencial vazamento: timer sem cleanup'
      });
    }
  }

  // No longer needed: regex detection removed in favor of AST
}

/**
 * Detecta complexidade cognitiva alta baseada em estruturas de controle (mais avançado que analista de funções longas)
 */
function calcularComplexidadeCognitivaAST(path: NodePath): number {
  let score = 0;
  let nesting = 0;

  const incrementTypes = [
    'IfStatement', 'WhileStatement', 'DoWhileStatement',
    'ForStatement', 'ForInStatement', 'ForOfStatement',
    'SwitchStatement', 'CatchClause', 'ConditionalExpression'
  ];

  path.traverse({
    enter(p) {
      if (incrementTypes.includes(p.node.type)) {
        score += 1 + nesting;
        nesting++;
      }
      if (p.node.type === 'LogicalExpression' && (p.node.operator === '&&' || p.node.operator === '||')) {
        score += 1;
      }
    },
    exit(p) {
      if (incrementTypes.includes(p.node.type)) {
        nesting--;
      }
    }
  });

  return score;
}

function detectarNestedCallbacks(ast: NodePath<Node>, fragilidades: Fragilidade[], limite: number): void {
  const lim = Number.isFinite(limite) && limite >= 0 ? limite : 2;
  traverse(ast.node, {
    CallExpression(path: NodePath<CallExpression>) {
      const profundidade = calcularProfundidadeCallback(path);
      if (profundidade > lim) {
        fragilidades.push({
          tipo: 'nested-callbacks',
          linha: path.node.loc?.start.line || 0,
          coluna: path.node.loc?.start.column || 0,
          severidade: profundidade > lim + 1 ? 'alta' : 'media',
          contexto: `Callbacks aninhados (nível ${profundidade}, máx: ${lim})`
        });
      }
    }
  });
}
function calcularProfundidadeCallback(path: NodePath): number {
  let profundidade = 0;
  let current: NodePath | null = path;
  while (current) {
    if (current.isCallExpression() && hasCallbackArgument(current)) {
      profundidade++;
    }
    current = current.parentPath;
  }
  return profundidade;
}
function hasCallbackArgument(path: NodePath): boolean {
  if (!path.isCallExpression()) return false;
  return path.node.arguments.some(arg => arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression');
}
function isSingleConsoleLog(stmt: Node): boolean {
  // Statement node
  return stmt.type === 'ExpressionStatement' && stmt.expression?.type === 'CallExpression' && stmt.expression.callee?.type === 'MemberExpression' && stmt.expression.callee.object?.type === 'Identifier' && stmt.expression.callee.object.name === 'console';
}
function isInVariableDeclarator(path: NodePath): boolean {
  return path.findParent(p => p.isVariableDeclarator()) !== null;
}
function isInArrayIndex(path: NodePath): boolean {
  return path.findParent(p => p.isMemberExpression() && p.node.computed) !== null;
}
function agruparPorSeveridade(fragilidades: Fragilidade[]): Record<string, Fragilidade[]> {
  return fragilidades.reduce((acc, frag) => {
    const sev = frag.severidade as string || 'media';
    if (!acc[sev]) {
      acc[sev] = [];
    }
    acc[sev].push(frag);
    return acc;
  }, {} as Record<string, Fragilidade[]>);
}

function detectarGodObjects(ast: NodePath<Node>, fragilidades: Fragilidade[], limiteProps = 10): void {
  traverse(ast.node, {
    ObjectExpression(path: NodePath) {
      const hasParent = path.findParent(p => p.isVariableDeclarator() || p.isProperty());
      if (hasParent) {
        const node = path.node as unknown as { properties?: unknown[]; loc?: { start: { line: number; column: number } } };
        const props = node.properties?.length || 0;
        if (props > limiteProps) {
          fragilidades.push({
            tipo: 'god-object',
            linha: node.loc?.start.line || 0,
            coluna: node.loc?.start.column || 0,
            severidade: props > limiteProps * 2 ? 'alta' : 'media',
            contexto: `Objeto com ${props} propriedades (limite: ${limiteProps}) - considere dividir em objetos menores`
          });
        }
      }
    }
  });
}

function detectarFeatureEnvy(ast: NodePath<Node>, fragilidades: Fragilidade[], limiteAcessos = 5): void {
  traverse(ast.node, {
    FunctionDeclaration(path: NodePath) {
      const node = path.node as unknown as { id?: { name?: string }; loc?: { start: { line: number } } };
      const funName = node.id?.name || 'anonymous';
      const body = path.get('body') as NodePath;
      if (!body || !(body as NodePath).isBlockStatement()) return;

      const objectAccesses = new Map<string, number>();

      path.traverse({
        MemberExpression(memberPath: NodePath) {
          const memberNode = memberPath.node as unknown as { object: { type: string; name?: string } };
          if (memberNode.object.type === 'Identifier' && memberNode.object.name) {
            const current = objectAccesses.get(memberNode.object.name) || 0;
            objectAccesses.set(memberNode.object.name, current + 1);
          }
        }
      });

      for (const [objName, count] of objectAccesses) {
        if (objName !== funName && count > limiteAcessos) {
          fragilidades.push({
            tipo: 'feature-envy',
            linha: node.loc?.start.line || 0,
            coluna: 0,
            severidade: 'media',
            contexto: `Função '${funName}' acessa '${objName}' ${count} vezes - considere mover para classe/objeto de origem`
          });
        }
      }
    }
  });
}

function detectarDataClumps(ast: NodePath<Node>, fragilidades: Fragilidade[], limiteParams = 3): void {
  const parametrosGroups: Map<string, number> = new Map();

  traverse(ast.node, {
    FunctionDeclaration(path: NodePath) {
      const params = (path.node as unknown as { params: unknown[] }).params || [];
      if (params.length >= limiteParams) {
        const paramTypes = params.map((p: unknown) => (p as unknown as { type: string }).type).join(',');
        const current = parametrosGroups.get(paramTypes) || 0;
        parametrosGroups.set(paramTypes, current + 1);
      }
    },
    FunctionExpression(path: NodePath) {
      const params = (path.node as unknown as { params: unknown[] }).params || [];
      if (params.length >= limiteParams) {
        const paramTypes = params.map((p: unknown) => (p as unknown as { type: string }).type).join(',');
        const current = parametrosGroups.get(paramTypes) || 0;
        parametrosGroups.set(paramTypes, current + 1);
      }
    }
  });

  for (const [types, count] of parametrosGroups) {
    if (count > 2) {
      fragilidades.push({
        tipo: 'data-clump',
        linha: 1,
        coluna: 0,
        severidade: 'baixa',
        contexto: `Grupo de ${types.split(',').length} parâmetros aparece ${count} vezes - considere criar objeto/interface`
      });
    }
  }
}
