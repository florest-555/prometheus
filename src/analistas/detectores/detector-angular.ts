// SPDX-License-Identifier: MIT-0
import type { NodePath } from '@babel/traverse';
import type { CallExpression, ClassMethod, Decorator, Node } from '@babel/types';
import { traverse } from '@core/config/traverse.js';
import { DetectorAngularMensagens } from '@core/messages/analistas/detector-angular-messages.js';
import { filtrarOcorrenciasSuprimidas } from '@shared/helpers/suppressao.js';

import type { ContextoExecucao,Ocorrencia } from '@';
import { criarAnalista, criarOcorrencia } from '@';

export const analistaAngular = criarAnalista({
  nome: 'angular-especifico',
  categoria: 'framework',
  descricao: 'Analisa padrões específicos do ecossistema Angular (v2+)',
  test: (relPath: string) => /\.(ts|html)$/.test(relPath),
  aplicar: async (src: string, relPath: string, ast: NodePath<Node> | null, _fullPath?: string, _contexto?: ContextoExecucao): Promise<Ocorrencia[] | null> => {
    if (!src) return null;
    const ocorrencias: Ocorrencia[] = [];
    const isTS = relPath.endsWith('.ts');
    const isHTML = relPath.endsWith('.html');

    if (isTS && ast) {
      let isComponent = false;
      let hasNgOnDestroy = false;
      let hasUnsubscribeOrTakeUntil = false;
      const subscriptions: string[] = [];

      try {
        traverse(ast.node, {
          Decorator(path: NodePath<Decorator>) {
            const expr = path.node.expression;
            const name = expr.type === 'CallExpression' && expr.callee.type === 'Identifier' ? expr.callee.name : '';

            if (name === 'Component') {
              isComponent = true;

              if (expr.type === 'CallExpression' && expr.arguments.length > 0 && expr.arguments[0].type === 'ObjectExpression') {
                const props = expr.arguments[0].properties;
                const hasOnPush = props.some((p) =>
                  p.type === 'ObjectProperty' && p.key.type === 'Identifier' && p.key.name === 'changeDetection' &&
                  p.value?.type === 'MemberExpression' && p.value.property.type === 'Identifier' && p.value.property.name === 'OnPush'
                );
                if (!hasOnPush) {
                  ocorrencias.push(criarOcorrencia({
                    tipo: 'on-push-missing',
                    nivel: 'info',
                    mensagem: DetectorAngularMensagens.onPushSugerido,
                    relPath,
                    linha: path.node.loc?.start.line || 0
                  }));
                }
              }
            }
          },
          ClassMethod(path: NodePath<ClassMethod>) {
            if (path.node.key.type === 'Identifier' && path.node.key.name === 'ngOnDestroy') {
              hasNgOnDestroy = true;
              const bodyStr = JSON.stringify(path.node.body);
              if (bodyStr.includes('unsubscribe') || bodyStr.includes('.next(')) {
                hasUnsubscribeOrTakeUntil = true;
              }
            }
            if (path.node.kind === 'constructor') {
                if (path.node.body.body.length > 2) {
                    const hasComplexLogic = path.node.body.body.some((s) =>
                        s.type !== 'ExpressionStatement' ||
                        (s.expression.type === 'CallExpression' && s.expression.callee.type !== 'MemberExpression' && (s.expression.callee.type === 'Identifier' && s.expression.callee.name !== 'super'))
                    );
                    if (hasComplexLogic) {
                        ocorrencias.push(criarOcorrencia({
                            tipo: 'heavy-constructor',
                            nivel: 'aviso',
                            mensagem: DetectorAngularMensagens.logicaNoConstrutor,
                            relPath,
                            linha: path.node.loc?.start.line || 0
                        }));
                    }
                }
            }
          },
          CallExpression(path: NodePath<CallExpression>) {
            if (path.node.callee.type === 'MemberExpression' && path.node.callee.property.type === 'Identifier' && path.node.callee.property.name === 'subscribe') {
              if (path.parentPath.isVariableDeclarator()) {
                const id = path.parentPath.node.id;
                if (id.type === 'Identifier') subscriptions.push(id.name);
              } else if (path.parentPath.isAssignmentExpression()) {
                const left = path.parentPath.node.left;
                if (left.type === 'MemberExpression' && left.property.type === 'Identifier') {
                    subscriptions.push(left.property.name);
                } else if (left.type === 'Identifier') {
                    subscriptions.push(left.name);
                }
              } else {
                const fullCall = src.substring(path.node.start || 0, path.node.end || 0);
                if (!fullCall.includes('takeUntil')) {
                    ocorrencias.push(criarOcorrencia({
                        tipo: 'unhandled-subscription',
                        nivel: 'alto',
                        mensagem: DetectorAngularMensagens.vazamentoMemoriaSubscription('Anônima'),
                        relPath,
                        linha: path.node.loc?.start.line || 0
                    }));
                }
              }
            }

            const callee = path.node.callee;
            if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier') {
                const obj = callee.object.name;
                const prop = callee.property.type === 'Identifier' ? callee.property.name : '';
                if (obj === 'document' || (obj === 'window' && prop === 'document')) {
                    ocorrencias.push(criarOcorrencia({
                        tipo: 'direct-dom-access',
                        nivel: 'aviso',
                        mensagem: DetectorAngularMensagens.renderer2Sugerido,
                        relPath,
                        linha: path.node.loc?.start.line || 0
                    }));
                }
            }
          }
        });

        if (isComponent && subscriptions.length > 0 && (!hasNgOnDestroy || !hasUnsubscribeOrTakeUntil)) {
            subscriptions.forEach(s => {
                ocorrencias.push(criarOcorrencia({
                    tipo: 'unhandled-subscription',
                    nivel: 'alto',
                    mensagem: DetectorAngularMensagens.vazamentoMemoriaSubscription(s),
                    relPath,
                    linha: 0
                }));
            });
        }
      } catch {
        // Silencioso
      }
    }

    if (isHTML) {
      const lines = src.split('\n');
      lines.forEach((line, index) => {
        // Detectar *ngFor sem trackBy
        if (line.includes('*ngFor') && !line.includes('trackBy')) {
          ocorrencias.push(criarOcorrencia({
            tipo: 'missing-trackby',
            nivel: 'media',
            mensagem: DetectorAngularMensagens.trackByObrigatorio,
            relPath,
            linha: index + 1
          }));
        }
        // Detectar excesso de lógica no template (heurística)
        if ((line.match(/[=<>!]/g) || []).length > 5 && line.includes('{{')) {
            ocorrencias.push(criarOcorrencia({
                tipo: 'heavy-template-logic',
                nivel: 'baixa',
                mensagem: DetectorAngularMensagens.logicaTemplateExcessiva,
                relPath,
                linha: index + 1
            }));
        }
      });
    }

    return filtrarOcorrenciasSuprimidas(ocorrencias, 'angular-especifico', src);
  }
});
