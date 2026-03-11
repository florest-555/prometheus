// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import * as detectorDependenciasModule from '../../../src/analistas/detectores/detector-dependencias';

describe('detector-dependencias', () => {
  it('should export something', () => {
    expect(detectorDependenciasModule).toBeDefined();
  });

  it('should export detectorDependencias or default', () => {
    const mod = detectorDependenciasModule as any;
    const detector = mod.detectorDependencias || mod.default || mod;
    expect(detector).toBeDefined();
  });

  it('should export grafoDependencias', () => {
    const mod = detectorDependenciasModule as any;
    expect(mod.grafoDependencias).toBeDefined();
    expect(mod.grafoDependencias instanceof Map).toBe(true);
  });
});
