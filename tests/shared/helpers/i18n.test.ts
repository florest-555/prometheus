// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { i18n, createI18nMessages } from '../../../src/shared/helpers/i18n';

describe('i18n', () => {
  describe('i18n function', () => {
    it('should return pt-BR message by default', () => {
      const result = i18n({ 'pt-BR': 'Olá', en: 'Hello' });
      expect(result).toBe('Olá');
    });

    it('should handle object messages', () => {
      const result = i18n({
        'pt-BR': { greeting: 'Olá' },
        en: { greeting: 'Hello' },
      });
      expect(result.greeting).toBe('Olá');
    });
  });

  describe('createI18nMessages', () => {
    it('should create a proxy', () => {
      const pt = { hello: 'Olá', goodbye: 'Tchau' };
      const en = { hello: 'Hello' };
      const messages = createI18nMessages(pt, en);
      expect(messages.hello).toBeDefined();
      expect(messages.goodbye).toBeDefined();
    });

    it('should return pt-BR values by default', () => {
      const messages = createI18nMessages(
        { msg: 'Português' },
        { msg: 'English' },
      );
      expect(messages.msg).toBe('Português');
    });
  });
});
