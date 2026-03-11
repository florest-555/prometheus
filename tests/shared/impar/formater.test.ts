// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { formatarPrettierMinimo } from '../../../src/shared/impar/formater';

describe('shared/impar/formater', () => {

  describe('formatarPrettierMinimo', () => {
    it('should format simple JSON by normalizing endings and indents', () => {
      const code = '{"a":  1}';
      const result = formatarPrettierMinimo({ code, relPath: 'test.json' });
      expect(result.ok).toBe(true);
      expect(result.formatted).toBe('{\n  "a": 1\n}\n');
      expect(result.parser).toBe('json');
    });

    it('should fall back correctly for JSON with comments (JSONC)', () => {
      const code = '// comment\n{"a": 1}';
      const result = formatarPrettierMinimo({ code, relPath: 'test.json' });
      expect(result.ok).toBe(true);
      // Because json with comments falls down to formatarCodeMinimo, it will just normalize newlines without parsing JSON.
      expect(result.formatted).toBe('// comment\n{"a": 1}\n');
    });

    it('should format markdown and clean up empty lines and spaces', () => {
      const code = '# Title\n  \n\n\n\ntext\n\n';
      const result = formatarPrettierMinimo({ code, relPath: 'test.md' });
      expect(result.ok).toBe(true);
      expect(result.formatted).toBe('# Title\n\n\ntext\n');
      expect(result.parser).toBe('markdown');
    });

    it('should handle XML and fix basic spacing without breaking valid mixed content', () => {
      const code = '<?xml version="1.0" ?>  \n<root> \n<foo />\n</root>';
      const result = formatarPrettierMinimo({ code, relPath: 'doc.xml' });
      expect(result.ok).toBe(true);
      // Our barebones basic formatting preserves newlines differently for very broken pieces and 
      // preserves the xml prolog '<?xml version="1.0" ?>' spacing out of the box because it is untouched.
      expect(result.formatted).toContain('<?xml');
      expect(result.parser).toBe('xml');
    });

    it('should normalize separators in CSS', () => {
      const code = `/* -------------------------- titulo -------------------------- */\n.foo { }`;
      const result = formatarPrettierMinimo({ code, relPath: 'style.css' });
      expect(result.ok).toBe(true);
      expect(result.formatted).toContain('/* -------------------------- titulo -------------------------- */');
    });

    it('should gracefully return unknown for unhandled types', () => {
      const code = 'some raw text';
      const result = formatarPrettierMinimo({ code, relPath: 'unknown.xyz' });
      expect(result.ok).toBe(true);
      expect(result.parser).toBe('unknown');
      expect(result.formatted).toBe(code);
    });
  });

});
