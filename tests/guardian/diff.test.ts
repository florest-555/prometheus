// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { diffSnapshots, verificarErros } from '../../src/guardian/diff';

describe('guardian/diff', () => {
  describe('diffSnapshots', () => {
    it('should detect added files', () => {
      const before = { 'a.ts': 'hash1' };
      const after = { 'a.ts': 'hash1', 'b.ts': 'hash2' };
      const result = diffSnapshots(before, after);
      expect(result.adicionados).toContain('b.ts');
      expect(result.removidos).toHaveLength(0);
      expect(result.alterados).toHaveLength(0);
    });

    it('should detect removed files', () => {
      const before = { 'a.ts': 'hash1', 'b.ts': 'hash2' };
      const after = { 'a.ts': 'hash1' };
      const result = diffSnapshots(before, after);
      expect(result.removidos).toContain('b.ts');
      expect(result.adicionados).toHaveLength(0);
    });

    it('should detect changed files', () => {
      const before = { 'a.ts': 'hash1' };
      const after = { 'a.ts': 'hash2' };
      const result = diffSnapshots(before, after);
      expect(result.alterados).toContain('a.ts');
    });

    it('should return empty arrays when no changes', () => {
      const snapshot = { 'a.ts': 'hash1', 'b.ts': 'hash2' };
      const result = diffSnapshots(snapshot, { ...snapshot });
      expect(result.adicionados).toHaveLength(0);
      expect(result.removidos).toHaveLength(0);
      expect(result.alterados).toHaveLength(0);
    });

    it('should handle empty snapshots', () => {
      const result = diffSnapshots({}, {});
      expect(result.adicionados).toHaveLength(0);
      expect(result.removidos).toHaveLength(0);
      expect(result.alterados).toHaveLength(0);
    });
  });

  describe('verificarErros', () => {
    it('should return empty array when no diffs', () => {
      const result = verificarErros({ adicionados: [], removidos: [], alterados: [] });
      expect(result).toEqual([]);
    });

    it('should report removed files', () => {
      const result = verificarErros({ adicionados: [], removidos: ['deleted.ts'], alterados: [] });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toContain('deleted.ts');
    });

    it('should report added files', () => {
      const result = verificarErros({ adicionados: ['new.ts'], removidos: [], alterados: [] });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should report changed files', () => {
      const result = verificarErros({ adicionados: [], removidos: [], alterados: ['changed.ts'] });
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
