// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectorMarkdown } from '../../../src/analistas/plugins/detector-markdown';

describe('detectorMarkdown', () => {
  it('should be defined', () => {
    expect(detectorMarkdown).toBeDefined();
  });

  it('should have correct name', () => {
    expect(detectorMarkdown.nome).toBe('detector-markdown');
  });
});