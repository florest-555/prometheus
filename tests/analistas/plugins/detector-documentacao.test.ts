// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaDocumentacao } from '../../../src/analistas/plugins/detector-documentacao';

describe('analistaDocumentacao', () => {
  it('should be defined', () => {
    expect(analistaDocumentacao).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaDocumentacao.nome).toBe('documentacao');
  });
});