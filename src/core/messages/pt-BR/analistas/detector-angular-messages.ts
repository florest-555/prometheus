// SPDX-License-Identifier: MIT-0

import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorAngularMensagens = createI18nMessages({
  vazamentoMemoriaSubscription: (nome: string) => `[ALERTA] Potencial vazamento de memoria: Subscription '${nome}' detectada sem cleanup no ngOnDestroy.`,
  trackByObrigatorio: '[PERFORMANCE] *ngFor detectado sem trackBy. Isso pode causar problemas de performance ao renderizar listas grandes.',
  renderer2Sugerido: "[ARQUITETURA] Manipulacao direta do DOM detectada. Use 'Renderer2' ou 'ElementRef' para manter a abstracao do Angular.",
  logicaNoConstrutor: '[ARQUITETURA] Logica detectada no constructor. Prefira usar o hook ngOnInit para inicializacoes complexas.',
  signalSugerido: (nome: string) => `[SUGESTAO] Atributo '${nome}' poderia ser um Signal para melhor performance e reatividade.`,
  logicaTemplateExcessiva: '[TEMPLATE] Excesso de logica complexa detectada no template. Considere mover para propriedades computadas ou metodos no componente.',
  onPushSugerido: '[PERFORMANCE] Considere usar ChangeDetectionStrategy.OnPush para este componente.'
}, {
  vazamentoMemoriaSubscription: (nome: string) => `[ALERT] Potential memory leak: Subscription '${nome}' detected without cleanup in ngOnDestroy.`,
  trackByObrigatorio: '[PERFORMANCE] *ngFor detected without trackBy. This can cause performance issues when rendering large lists.',
  renderer2Sugerido: "[ARCHITECTURE] Direct DOM manipulation detected. Use 'Renderer2' or 'ElementRef' to maintain Angular's abstraction.",
  logicaNoConstrutor: '[ARCHITECTURE] Logic detected in the constructor. Prefer using the ngOnInit hook for complex initializations.',
  signalSugerido: (nome: string) => `[SUGGESTION] Attribute '${nome}' could be a Signal for better performance and reactivity.`,
  logicaTemplateExcessiva: '[TEMPLATE] Excessive complex logic detected in the template. Consider moving to computed properties or methods in the component.',
  onPushSugerido: '[PERFORMANCE] Consider using ChangeDetectionStrategy.OnPush for this component.'
});
