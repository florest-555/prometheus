// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { gerarHashHex, gerarSnapshotDoConteudo } from '../../src/guardian/hash';

describe('guardian/hash', () => {
  describe('gerarHashHex', () => {
    it('should return a hex string', () => {
      const hash = gerarHashHex('hello world');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });

    it('should return same hash for same content', () => {
      const h1 = gerarHashHex('test content');
      const h2 = gerarHashHex('test content');
      expect(h1).toBe(h2);
    });

    it('should return different hash for different content', () => {
      const h1 = gerarHashHex('content a');
      const h2 = gerarHashHex('content b');
      expect(h1).not.toBe(h2);
    });

    it('should handle empty string', () => {
      const hash = gerarHashHex('');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('gerarSnapshotDoConteudo', () => {
    it('should return a hash string', () => {
      const result = gerarSnapshotDoConteudo('line1\nline2\nline3');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return consistent result', () => {
      const r1 = gerarSnapshotDoConteudo('test');
      const r2 = gerarSnapshotDoConteudo('test');
      expect(r1).toBe(r2);
    });
  });
});
