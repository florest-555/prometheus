// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { optionsDiagnosticar } from '../../src/cli/options-diagnosticar';

describe('cli/options-diagnosticar', () => {

  it('should export an array of options', () => {
    expect(Array.isArray(optionsDiagnosticar)).toBe(true);
    expect(optionsDiagnosticar.length).toBeGreaterThan(10);
  });

  it('should have correct parser for --include', () => {
    const includeOpt = optionsDiagnosticar.find(opt => opt.flags.includes('--include')) as any;
    expect(includeOpt).toBeDefined();
    expect(typeof includeOpt.parser).toBe('function');

    const result = includeOpt.parser('src/**', ['lib/**']);
    expect(result).toEqual(['lib/**', 'src/**']);
  });

  it('should have correct parser for --exclude', () => {
    const excludeOpt = optionsDiagnosticar.find(opt => opt.flags.includes('--exclude')) as any;
    expect(excludeOpt).toBeDefined();
    expect(typeof excludeOpt.parser).toBe('function');

    const result = excludeOpt.parser('node_modules', []);
    expect(result).toEqual(['node_modules']);
  });

});
