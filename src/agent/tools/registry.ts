import axios from 'axios';
import { exec } from 'child_process';
import { readdir, readFile, stat,writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';

import type { Tool, ToolEntry,ToolHandler } from '@';

const execAsync = promisify(exec);
type ToolParams = Record<string, unknown>;

export class ToolRegistry {
  private tools: Map<string, ToolEntry> = new Map();
  constructor() { this.registerBuiltin(); }

  private registerBuiltin(): void {
    this.register('file_read', 'Read contents of a file', { type: 'object', properties: { path: { type: 'string', description: 'The path to the file' } }, required: ['path'] }, async (p: ToolParams) => readFile(p.path as string, 'utf-8'));
    this.register('file_write', 'Write content to a file', { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] }, async (p: ToolParams) => { await writeFile(p.path as string, p.content as string, 'utf-8'); return `File written: ${p.path}`; });
    this.register('file_list', 'List files in a directory', { type: 'object', properties: { path: { type: 'string' }, recursive: { type: 'boolean', default: false } }, required: ['path'] }, async (p: ToolParams) => { if (p.recursive) { const files = await this.walkDir(p.path as string); return files.join('\n'); } return (await readdir(p.path as string)).join('\n'); });
    this.register('shell_exec', 'Execute a shell command', { type: 'object', properties: { command: { type: 'string' }, cwd: { type: 'string' }, timeout: { type: 'number', default: 30 } }, required: ['command'] }, async (p: ToolParams) => { try { const { stdout, stderr } = await execAsync(p.command as string, { cwd: p.cwd as string | undefined, timeout: ((p.timeout as number) || 30) * 1000 }); return stdout || stderr || '(no output)'; } catch (e: unknown) { return `Error: ${(e as Error).message}`; } });
    this.register('web_fetch', 'Fetch content from a URL', { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] }, async (p: ToolParams) => { const r = await axios.get(p.url as string, { timeout: 30000 }); return r.data; });
    this.register('web_search', 'Search the web', { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number', default: 5 } }, required: ['query'] }, async (p: ToolParams) => `Search not implemented. Query: ${p.query}`);
    this.register('git_exec', 'Execute a Git command', { type: 'object', properties: { command: { type: 'string' }, cwd: { type: 'string', default: '.' } }, required: ['command'] }, async (p: ToolParams) => { try { const { stdout, stderr } = await execAsync(`git ${p.command}`, { cwd: p.cwd as string || '.' }); return stdout || stderr; } catch (e: unknown) { return `Error: ${(e as Error).message}`; } });
    this.register('rag_index', 'Index text with embeddings', { type: 'object', properties: { content: { type: 'string' }, metadata: { type: 'string', default: '' } }, required: ['content'] }, async () => 'RAG not implemented');
    this.register('rag_search', 'Search vector database', { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }, async () => 'RAG not implemented');
  }

  private async walkDir(dir: string, baseDir: string = ''): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const relativePath = baseDir ? join(baseDir, entry) : entry;
      try { const stats = await stat(fullPath); if (stats.isDirectory()) { const subFiles = await this.walkDir(fullPath, relativePath); files.push(...subFiles); } else { files.push(relativePath); } } catch { /* skip */ }
    }
    return files;
  }

  register(name: string, description: string, inputSchema: Record<string, unknown>, handler: ToolHandler): void {
    this.tools.set(name, { tool: { name, description, input_schema: inputSchema }, handler });
  }
  get(name: string): ToolEntry | undefined { return this.tools.get(name); }
  list(): Tool[] { return Array.from(this.tools.values()).map((e) => e.tool); }
  async execute(name: string, params: Record<string, unknown>): Promise<unknown> {
    const entry = this.tools.get(name);
    if (!entry) throw new Error(`Tool not found: ${name}`);
    return entry.handler(params);
  }
}
