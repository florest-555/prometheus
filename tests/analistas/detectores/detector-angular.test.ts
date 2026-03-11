// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaAngular } from '../../../src/analistas/detectores/detector-angular';

describe('analistaAngular', () => {
  it('should be defined', () => {
    expect(analistaAngular).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaAngular.nome).toBe('angular-especifico');
  });

  it('should have correct categoria', () => {
    expect(analistaAngular.categoria).toBe('framework');
  });

  it('should have a descricao', () => {
    expect(typeof analistaAngular.descricao).toBe('string');
  });

  it('should identify TS and HTML files', () => {
    expect(analistaAngular.test!('component.ts')).toBe(true);
    expect(analistaAngular.test!('template.html')).toBe(true);
    expect(analistaAngular.test!('style.css')).toBe(false);
    expect(analistaAngular.test!('file.js')).toBe(false);
  });

  it('should have aplicar function', () => {
    expect(typeof analistaAngular.aplicar).toBe('function');
  });

  it('should return null for empty src', async () => {
    const result = await analistaAngular.aplicar('', 'component.ts', null);
    expect(result).toBeNull();
  });

  it('should detect *ngFor without trackBy in HTML', async () => {
    const html = '<div *ngFor="let item of items">\n  {{ item.name }}\n</div>';
    const result = await analistaAngular.aplicar(html, 'template.html', null);
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    const trackByOccurrences = (result as any[]).filter(o => o.tipo === 'missing-trackby');
    expect(trackByOccurrences.length).toBeGreaterThan(0);
  });

  it('should not flag *ngFor with trackBy', async () => {
    const html = '<div *ngFor="let item of items; trackBy: trackById">\n  {{ item.name }}\n</div>';
    const result = await analistaAngular.aplicar(html, 'template.html', null);
    const trackByOccurrences = (result as any[] || []).filter(o => o.tipo === 'missing-trackby');
    expect(trackByOccurrences.length).toBe(0);
  });
});
