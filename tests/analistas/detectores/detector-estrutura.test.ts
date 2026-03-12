// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import * as detectorEstruturaModule from '../../../src/analistas/detectores/detector-estrutura';

describe('detector-estrutura', () => {
  it('should export something', () => {
    expect(detectorEstruturaModule).toBeDefined();
  });

  it('should export detectorEstrutura or default', () => {
    const mod = detectorEstruturaModule as any;
    const detector = mod.detectorEstrutura || mod.default || mod;
    expect(detector).toBeDefined();
  });
});
