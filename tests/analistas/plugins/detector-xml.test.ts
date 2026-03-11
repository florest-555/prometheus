// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { detectarArquetipoXML } from '../../../src/analistas/plugins/detector-xml';

describe('detectarArquetipoXML', () => {
  it('should be defined', () => {
    expect(detectarArquetipoXML).toBeDefined();
  });

  it('should return empty array when no XML files', () => {
    const result = detectarArquetipoXML(['file.js', 'file.ts']);
    expect(result).toEqual([]);
  });

  it('should detect web-xml-project when web.xml present', () => {
    const result = detectarArquetipoXML(['web.xml', 'sitemap.xml']);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].nome).toBe('web-xml-project');
  });
});