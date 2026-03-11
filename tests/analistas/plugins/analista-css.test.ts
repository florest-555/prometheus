// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaCss } from '../../../src/analistas/plugins/analista-css';

describe('analistaCss', () => {
  it('should be defined', () => {
    expect(analistaCss).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaCss.nome).toBe('analista-css');
  });

  it('should identify CSS files', () => {
    expect(analistaCss.test('file.css')).toBe(true);
    expect(analistaCss.test('file.scss')).toBe(true);
    expect(analistaCss.test('file.sass')).toBe(true);
    expect(analistaCss.test('file.js')).toBe(false);
  });
});