// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import {
  maskKeepingNewlines,
  maskJsComments,
  maskHtmlComments,
  maskTagBlocks,
  maskXmlNonCode,
  maskPythonStringsAndComments,
  maskPythonComments,
} from '../../../src/shared/helpers/masking';

describe('masking', () => {
  describe('maskKeepingNewlines', () => {
    it('should mask region preserving newlines', () => {
      const result = maskKeepingNewlines('abcdef\nghijkl', 3, 10);
      expect(result.length).toBe('abcdef\nghijkl'.length);
      expect(result.slice(0, 3)).toBe('abc');
      expect(result).toContain('\n');
    });

    it('should preserve surrounding text', () => {
      const result = maskKeepingNewlines('hello world', 5, 11);
      expect(result.startsWith('hello')).toBe(true);
    });
  });

  describe('maskJsComments', () => {
    it('should mask block comments', () => {
      const src = 'const x = 1; /* comment */ const y = 2;';
      const result = maskJsComments(src);
      expect(result).not.toContain('comment');
      expect(result).toContain('const x');
    });

    it('should mask line comments', () => {
      const src = 'const x = 1; // line comment\nconst y = 2;';
      const result = maskJsComments(src);
      expect(result).not.toContain('line comment');
      expect(result).toContain('const y');
    });

    it('should preserve newlines in multiline block comments', () => {
      const src = 'a\n/* comment\nwith newline */\nb';
      const result = maskJsComments(src);
      const newlines = (result.match(/\n/g) || []).length;
      expect(newlines).toBe(3);
    });
  });

  describe('maskHtmlComments', () => {
    it('should mask HTML comments', () => {
      const src = '<div><!-- comment --><p>text</p></div>';
      const result = maskHtmlComments(src);
      expect(result).not.toContain('comment');
      expect(result).toContain('<div>');
    });

    it('should handle multiline HTML comments', () => {
      const src = '<!-- multi\nline\ncomment -->\n<div></div>';
      const result = maskHtmlComments(src);
      const newlines = (result.match(/\n/g) || []).length;
      expect(newlines).toBe(3);
    });
  });

  describe('maskTagBlocks', () => {
    it('should mask script blocks', () => {
      const src = '<div></div><script>alert(1);</script><p>ok</p>';
      const result = maskTagBlocks(src, 'script');
      expect(result).not.toContain('alert');
    });

    it('should mask style blocks', () => {
      const src = '<style>body { color: red; }</style><div>ok</div>';
      const result = maskTagBlocks(src, 'style');
      expect(result).not.toContain('color');
    });
  });

  describe('maskXmlNonCode', () => {
    it('should mask XML comments', () => {
      const src = '<root><!-- xml comment --><child/></root>';
      const result = maskXmlNonCode(src);
      expect(result).not.toContain('xml comment');
    });

    it('should mask CDATA sections', () => {
      const src = '<root><![CDATA[some data]]></root>';
      const result = maskXmlNonCode(src);
      expect(result).not.toContain('some data');
    });
  });

  describe('maskPythonComments', () => {
    it('should mask Python comments', () => {
      const src = 'x = 1  # comment\ny = 2';
      const result = maskPythonComments(src);
      expect(result).not.toContain('comment');
      expect(result).toContain('x = 1');
    });
  });

  describe('maskPythonStringsAndComments', () => {
    it('should mask Python strings and comments', () => {
      const src = 'x = "hello"  # comment\ny = 2';
      const result = maskPythonStringsAndComments(src);
      expect(result).not.toContain('hello');
      expect(result).not.toContain('comment');
    });
  });
});
