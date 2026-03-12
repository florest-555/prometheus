// SPDX-License-Identifier: MIT-0
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeDefaultPlugins, getAvailablePlugins, PADRAO_PLUGIN_CONFIGURACAO, PADRAO_LANGUAGE_SUPORTE } from '../../../src/shared/plugins/init';
import * as registry from '../../../src/shared/plugins/registry';

vi.mock('../../../src/shared/plugins/registry', () => ({
  getGlobalRegistry: vi.fn(),
}));

// Mock the corePlugin
vi.mock('../../../src/shared/plugins/core-plugin.js', () => ({
  default: { name: 'core', version: '1.0.0', extensions: ['.js'], parse: vi.fn() }
}));

describe('shared/plugins/init', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initializeDefaultPlugins', () => {
    it('should get global registry and register core plugin', () => {
      const mockRegister = vi.fn();
      vi.mocked(registry.getGlobalRegistry).mockReturnValue({
        registerPlugin: mockRegister
      } as any);

      initializeDefaultPlugins();

      expect(registry.getGlobalRegistry).toHaveBeenCalled();
      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({ name: 'core' }));
    });
  });

  describe('getAvailablePlugins', () => {
    it('should return core plugin as available', () => {
      const plugins = getAvailablePlugins();
      expect(plugins).toContain('core');
      expect(plugins.length).toBe(1);
    });
  });

  describe('PADRAO_PLUGIN_CONFIGURACAO', () => {
    it('should have core plugin enabled by default', () => {
      expect(PADRAO_PLUGIN_CONFIGURACAO.enabled).toContain('core');
      expect(PADRAO_PLUGIN_CONFIGURACAO.autoload).toBe(true);
    });
  });

  describe('PADRAO_LANGUAGE_SUPORTE', () => {
    it('should have TS and JS enabled with core parser', () => {
      expect(PADRAO_LANGUAGE_SUPORTE.javascript.enabled).toBe(true);
      expect(PADRAO_LANGUAGE_SUPORTE.typescript.parser).toBe('core');
      expect(PADRAO_LANGUAGE_SUPORTE.css.enabled).toBe(true);
    });
  });
});
