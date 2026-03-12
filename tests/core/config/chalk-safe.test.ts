// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import chalk from '../../../src/core/config/chalk-safe';

describe('chalk-safe', () => {
  it('should export chalk as default', () => {
    expect(chalk).toBeDefined();
  });

  it('should have color functions', () => {
    expect(typeof chalk.cyan).toBe('function');
    expect(typeof chalk.green).toBe('function');
    expect(typeof chalk.red).toBe('function');
    expect(typeof chalk.yellow).toBe('function');
    expect(typeof chalk.magenta).toBe('function');
    expect(typeof chalk.gray).toBe('function');
  });

  it('should have style functions', () => {
    expect(typeof chalk.bold).toBe('function');
    expect(typeof chalk.dim).toBe('function');
  });

  it('should return strings', () => {
    expect(typeof chalk.cyan('test')).toBe('string');
    expect(typeof chalk.bold('test')).toBe('string');
    expect(typeof chalk.red('test')).toBe('string');
  });

  it('should support chaining (cyan.bold)', () => {
    expect(typeof chalk.cyan.bold).toBe('function');
    expect(typeof chalk.cyan.bold('test')).toBe('string');
  });

  it('should support chaining (bold.cyan)', () => {
    expect(typeof chalk.bold.cyan).toBe('function');
    expect(typeof chalk.bold.cyan('test')).toBe('string');
  });

  it('should not crash on non-string input', () => {
    // chalk should handle number -> string conversion
    expect(typeof chalk.cyan(42 as any)).toBe('string');
  });
});
