// SPDX-License-Identifier: MIT-0
import { describe, it, expect, beforeEach } from 'vitest';
import { PluginRegistry, getGlobalRegistry, configureGlobalRegistry, resetGlobalRegistry } from '../../../src/shared/plugins/registry';

// Global mocks for logs etc can be implied usually, but we want to test registry logic
const mockPlugin = {
  name: 'test-plugin',
  version: '1.0.0',
  extensions: ['.test'],
  parse: () => ({ nodes: [] })
};

describe('shared/plugins/registry', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry({ enabled: ['test-plugin'] });
    resetGlobalRegistry();
  });

  describe('Global Instance', () => {
    it('getGlobalRegistry should lazily create an instance', () => {
      const g1 = getGlobalRegistry();
      const g2 = getGlobalRegistry();
      expect(g1).toBeInstanceOf(PluginRegistry);
      expect(g1).toBe(g2); // Singleton
    });

    it('configureGlobalRegistry should recreate instance', () => {
      configureGlobalRegistry({ enabled: ['my-plugin'] });
      const g = getGlobalRegistry();
      expect(g.getStats().pluginsHabilitados).toBe(1);
    });
  });

  describe('registerPlugin', () => {
    it('should validate and register correctly', () => {
      registry.registerPlugin(mockPlugin);
      expect(registry.getRegisteredPlugins()).toContain('test-plugin');
      expect(registry.getSupportedExtensions()).toContain('.test');
      expect(registry.getStats().pluginsRegistrados).toBe(1);
    });

    it('should throw on invalid plugin name', () => {
      expect(() => registry.registerPlugin({ ...mockPlugin, name: '' } as any)).toThrow();
    });

    it('should throw on missing parse method', () => {
      expect(() => registry.registerPlugin({ ...mockPlugin, parse: undefined } as any)).toThrow();
    });
  });

  describe('getPluginForExtension', () => {
    it('should return registered plugin if enabled', async () => {
      registry.registerPlugin(mockPlugin);
      const plugin = await registry.getPluginForExtension('.test');
      expect(plugin).toEqual(mockPlugin);
    });

    it('should return null if extension not supported', async () => {
      const plugin = await registry.getPluginForExtension('.unknown');
      expect(plugin).toBeNull();
    });

    it('should return null if plugin is disabled by user config', async () => {
      registry.registerPlugin(mockPlugin);
      // Reconfigure to disable test-plugin
      registry.updateConfig({ enabled: ['other-plugin'] });
      const plugin = await registry.getPluginForExtension('.test');
      expect(plugin).toBeNull();
    });

    it('should assume plugin enabled if no `enabled` array was configured by user', async () => {
      const reg2 = new PluginRegistry({}); // no explicit `enabled` provided
      reg2.registerPlugin(mockPlugin);
      const plugin = await reg2.getPluginForExtension('.test');
      expect(plugin).toEqual(mockPlugin);
    });
  });

  describe('updateConfig & updateLanguageSupport', () => {
    it('should update config and affect stats', () => {
      registry.updateConfig({ enabled: ['a', 'b'], autoload: false });
      const stats = registry.getStats();
      expect(stats.pluginsHabilitados).toBe(2);
      expect(stats.autoloadAtivo).toBe(false);
    });

    it('should update language support correctly', async () => {
      registry.registerPlugin(mockPlugin);
      registry.updateLanguageSupport({
        test: { enabled: false, parser: '', extensions: [], features: [] }
      });
      // Language 'test' maps to extension '.test'
      const plugin = await registry.getPluginForExtension('.test');
      expect(plugin).toBeNull(); // Because lang support disabled it
    });
  });

  describe('clearCache', () => {
    it('should empty internal state', () => {
      registry.registerPlugin(mockPlugin);
      registry.clearCache();
      expect(registry.getStats().pluginsRegistrados).toBe(0);
      expect(registry.getStats().extensoesSuportadas).toBe(0);
    });
  });
});
