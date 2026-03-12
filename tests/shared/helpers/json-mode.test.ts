// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { ativarModoJson, desativarModoJson, isJsonMode, resetJsonMode } from '../../../src/shared/helpers/json-mode';

describe('json-mode', () => {
  afterEach(() => {
    resetJsonMode();
  });

  it('should start with JSON mode off', () => {
    expect(isJsonMode()).toBe(false);
  });

  it('should activate JSON mode', () => {
    ativarModoJson();
    expect(isJsonMode()).toBe(true);
  });

  it('should deactivate JSON mode', () => {
    ativarModoJson();
    expect(isJsonMode()).toBe(true);
    desativarModoJson();
    expect(isJsonMode()).toBe(false);
  });

  it('should reset JSON mode', () => {
    ativarModoJson();
    resetJsonMode();
    expect(isJsonMode()).toBe(false);
  });
});
