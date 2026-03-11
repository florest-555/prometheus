// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaXml } from '../../../src/analistas/plugins/analista-xml';

describe('analistaXml', () => {
  it('should be defined', () => {
    expect(analistaXml).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaXml.nome).toBe('analista-xml');
  });
});