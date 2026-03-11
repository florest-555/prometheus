// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { analistaTodoComentarios } from '../../../src/analistas/js-ts/analista-todo-comments';

describe('analistaTodoComentarios', () => {
  it('should be defined', () => {
    expect(analistaTodoComentarios).toBeDefined();
  });

  it('should have correct name', () => {
    expect(analistaTodoComentarios.nome).toBe('todo-comments');
  });

  it('should have correct categoria', () => {
    expect(analistaTodoComentarios.categoria).toBe('qualidade');
  });

  it('should have a descricao', () => {
    expect(typeof analistaTodoComentarios.descricao).toBe('string');
  });

  it('should not be global', () => {
    expect(analistaTodoComentarios.global).toBe(false);
  });

  it('should accept .ts and .js files', () => {
    expect(analistaTodoComentarios.test!('src/foo.ts')).toBe(true);
    expect(analistaTodoComentarios.test!('src/foo.js')).toBe(true);
  });

  it('should reject test files', () => {
    expect(analistaTodoComentarios.test!('foo.test.ts')).toBe(false);
    expect(analistaTodoComentarios.test!('foo.spec.ts')).toBe(false);
  });

  it('should ignore its own file', () => {
    expect(analistaTodoComentarios.test!('analistas/analista-todo-comments.ts')).toBe(false);
  });

  it('should return null for empty source', () => {
    const result = analistaTodoComentarios.aplicar('', 'file.ts');
    expect(result).toBeNull();
  });

  it('should return null for code without TODO comments', () => {
    const result = analistaTodoComentarios.aplicar('const x = 1;\nconst y = 2;', 'file.ts');
    expect(result).toBeNull();
  });

  it('should detect TODO in line comments', () => {
    const code = '// TODO: fix this\nconst x = 1;';
    const result = analistaTodoComentarios.aplicar(code, 'file.ts');
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[]).length).toBeGreaterThan(0);
    expect((result as any[])[0].tipo).toBe('TODO-pendente');
  });

  it('should detect TODO in block comments', () => {
    const code = '/* TODO: fix this */\nconst x = 1;';
    const result = analistaTodoComentarios.aplicar(code, 'file.ts');
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should not detect TODO inside strings', () => {
    const code = "const msg = 'TODO: this is not a comment';\n";
    const result = analistaTodoComentarios.aplicar(code, 'file.ts');
    expect(result).toBeNull();
  });
});
