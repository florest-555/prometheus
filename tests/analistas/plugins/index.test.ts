// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import * as index from '../../../src/analistas/plugins/index';

describe('index', () => {
  it('should export analistaCss', () => {
    expect(index.analistaCss).toBeDefined();
  });

  it('should export detectarArquetipoNode', () => {
    expect(index.detectarArquetipoNode).toBeDefined();
  });
});