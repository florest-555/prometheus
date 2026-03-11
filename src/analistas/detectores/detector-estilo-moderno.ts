// SPDX-License-Identifier: MIT-0
import type { NodePath } from '@babel/traverse';
import type { CallExpression, Node, VariableDeclarator } from '@babel/types';
import { traverse } from '@core/config/traverse.js';
import { DetectorEstiloModernoMensagens } from '@core/messages/analistas/detector-estilo-moderno-messages.js';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers/suppressao.js';

import type { ContextoExecucao,Ocorrencia } from '@';
import { criarAnalista, criarOcorrencia } from '@';

export const analistaEstiloModerno = criarAnalista({
  nome: 'estilo-moderno',
  categoria: 'estetica',
  descricao: 'Refina o código com padrões e melhores práticas de 2026',
  test: (relPath: string): boolean => {
    return /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(relPath);
  },
  aplicar: async (src: string, relPath: string, ast: NodePath<Node> | null, _fullPath?: string, _contexto?: ContextoExecucao): Promise<Ocorrencia[] | null> => {
    if (!ast || !src) return null;

    const ocorrencias: Ocorrencia[] = [];
    const isTS = /\.(ts|tsx)$/.test(relPath);

    try {
      traverse(ast.node, {
        // 1. Detectar Await Waterfalls
        BlockStatement(path: NodePath) {
          const body = path.node.type === 'BlockStatement' ? path.node.body : [];
          if (!Array.isArray(body)) return;

          let awaitCount = 0;
          let lastAwaitLine = -1;

          for (const stmt of body) {
            let hasAwait = false;
            if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'AwaitExpression') {
              hasAwait = true;
            } else if (stmt.type === 'VariableDeclaration') {
              hasAwait = stmt.declarations.some((d) => d.init?.type === 'AwaitExpression');
            }

            if (hasAwait) {
              const currentLine = stmt.loc?.start.line || 0;
              if (lastAwaitLine !== -1 && currentLine === lastAwaitLine + 1) {
                awaitCount++;
              } else {
                awaitCount = 1;
              }
              lastAwaitLine = currentLine;

              if (awaitCount >= 3) {
                ocorrencias.push(criarOcorrencia({
                  tipo: 'await-waterfall',
                  nivel: 'info',
                  mensagem: DetectorEstiloModernoMensagens.waterfallDetectado,
                  relPath,
                  linha: currentLine
                }));
                awaitCount = 0; // Reset para não duplicar
              }
            } else {
              awaitCount = 0;
            }
          }
        },

        // 2. Sugerir 'satisfies' em TS
        VariableDeclarator(path: NodePath<VariableDeclarator>) {
          if (!isTS) return;
          const node = path.node;
          if (node.id.type === 'Identifier' && node.id.typeAnnotation && node.init?.type === 'ObjectExpression') {
             // Se tem anotação de tipo e é um objeto literal, pode ser satisfies
             ocorrencias.push(criarOcorrencia({
                tipo: 'suggest-satisfies',
                nivel: 'info',
                mensagem: DetectorEstiloModernoMensagens.satisfiesSugerido(node.id.name),
                relPath,
                linha: node.loc?.start.line || 0
             }));
          }
        },

        // 3. Sugerir 'Object.hasOwn'
        CallExpression(path: NodePath<CallExpression>) {
          const callee = path.node.callee;
          if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier' && callee.property.name === 'hasOwnProperty') {
            ocorrencias.push(criarOcorrencia({
              tipo: 'suggest-hasown',
              nivel: 'info',
              mensagem: DetectorEstiloModernoMensagens.hasOwnSugerido,
              relPath,
              linha: path.node.loc?.start.line || 0
            }));
          }
        },

        // 4. Sugerir 'using' para recursos (heurística por nome)
        VariableDeclaration(path: NodePath) {
            const node = path.node;
            if (node.type !== 'VariableDeclaration') return;
            if (node.kind === 'const' || node.kind === 'let') {
                for (const decl of node.declarations) {
                    if (decl.id.type === 'Identifier') {
                        const name = decl.id.name.toLowerCase();
                        if ((name.includes('client') || name.includes('handle') || name.includes('resource') || name.includes('connection')) &&
                            !src.includes('using ') && isTS) {
                            ocorrencias.push(criarOcorrencia({
                                tipo: 'suggest-using',
                                nivel: 'info',
                                mensagem: DetectorEstiloModernoMensagens.usingSugerido(decl.id.name),
                                relPath,
                                linha: decl.loc?.start.line || 0
                            }));
                        }
                    }
                }
            }
        }
      });

      return filtrarOcorrenciasSuprimidas(ocorrencias, 'estilo-moderno', src);
    } catch {
      return [];
    }
  }
});
