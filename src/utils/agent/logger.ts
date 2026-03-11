import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export function getDataDir(): string { return join(homedir(), '.local', 'share', 'egocentric'); }
export function getLogDir(): string { return join(getDataDir(), 'logs'); }

export function initLogger(logDir?: string): void {
  const dir = logDir || getLogDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  console.log(`Logger initialized. Log directory: ${dir}`);
}

function log(level: string, message: string, ...args: unknown[]): void { console.log(`[${new Date().toISOString()}] [${level}] ${message}`, ...args); }
export const logger = {
  info: (m: string, ...a: unknown[]): void => log('INFO', m, ...a),
  warn: (m: string, ...a: unknown[]): void => log('WARN', m, ...a),
  error: (m: string, ...a: unknown[]): void => log('ERROR', m, ...a),
  debug: (m: string, ...a: unknown[]): void => log('DEBUG', m, ...a)
};
