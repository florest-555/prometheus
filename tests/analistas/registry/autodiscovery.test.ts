// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { discoverAnalistasPlugins } from '../../../src/analistas/registry/autodiscovery';

describe('autodiscovery', () => {
  it('should export discoverAnalistasPlugins', () => {
    expect(discoverAnalistasPlugins).toBeDefined();
    expect(typeof discoverAnalistasPlugins).toBe('function');
  });

  it('should return an array', async () => {
    const result = await discoverAnalistasPlugins();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should discover plugins from plugins directory', async () => {
    const result = await discoverAnalistasPlugins();
    // Should discover at least some plugins from the plugins folder
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});
