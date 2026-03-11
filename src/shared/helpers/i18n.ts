// SPDX-License-Identifier: MIT-0
import { config } from '@core/config/config.js';

/**
 * Helper para internacionalização simples.
 * Seleciona a mensagem com base na configuração de idioma.
 */
export function i18n<T>(messages: { 'pt-BR': T; en: T }): T {
  const lang = config.LANGUAGE || 'pt-BR';
  return messages[lang] || messages['pt-BR'];
}

/**
 * Proxy para internacionalizar objetos de mensagens de forma dinâmica.
 * Útil para objetos que contêm tanto strings quanto funções.
 */
export function createI18nMessages<T extends object>(pt: T, en: Partial<T>): T {
  return new Proxy(pt, {
    get(target, prop, receiver) {
      const lang = config.LANGUAGE || 'pt-BR';
      if (lang === 'en' && en[prop as keyof T]) {
        return en[prop as keyof T];
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
