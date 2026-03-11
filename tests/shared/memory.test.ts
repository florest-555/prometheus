// SPDX-License-Identifier: MIT-0
import { describe, it, expect } from 'vitest';
import { ConversationMemory, PrometheusContextMemory } from '../../src/shared/memory';

describe('memory', () => {
  describe('ConversationMemory', () => {
    it('should create instance without persistence', () => {
      const mem = new ConversationMemory(10);
      expect(mem).toBeDefined();
    });

    it('should initialize empty', async () => {
      const mem = new ConversationMemory(10);
      await mem.init();
      expect(mem.getContext()).toEqual([]);
    });

    it('should add and retrieve messages', async () => {
      const mem = new ConversationMemory(10);
      await mem.init();
      await mem.addMessage({ role: 'user', content: 'Hello', timestamp: new Date().toISOString() });
      const context = mem.getContext();
      expect(context).toHaveLength(1);
      expect(context[0].content).toBe('Hello');
    });

    it('should return last N messages', async () => {
      const mem = new ConversationMemory(10);
      await mem.init();
      await mem.addMessage({ role: 'user', content: 'a', timestamp: '2025-01-01' });
      await mem.addMessage({ role: 'user', content: 'b', timestamp: '2025-01-02' });
      await mem.addMessage({ role: 'user', content: 'c', timestamp: '2025-01-03' });
      const last2 = mem.getContext(2);
      expect(last2).toHaveLength(2);
      expect(last2[0].content).toBe('b');
    });

    it('should get summary', async () => {
      const mem = new ConversationMemory(10);
      await mem.init();
      await mem.addMessage({ role: 'user', content: 'hi', timestamp: '2025-01-01' });
      await mem.addMessage({ role: 'assistant', content: 'hello', timestamp: '2025-01-02' });
      const summary = mem.getSummary();
      expect(summary.totalMessages).toBe(2);
      expect(summary.userMessages).toBe(1);
      expect(summary.assistantMessages).toBe(1);
    });

    it('should clear messages', async () => {
      const mem = new ConversationMemory(10);
      await mem.init();
      await mem.addMessage({ role: 'user', content: 'test', timestamp: '2025-01-01' });
      await mem.clear();
      expect(mem.getContext()).toHaveLength(0);
    });
  });

  describe('PrometheusContextMemory', () => {
    it('should create instance', () => {
      const mem = new PrometheusContextMemory(20);
      expect(mem).toBeDefined();
    });

    it('should initialize with default state', async () => {
      const mem = new PrometheusContextMemory(20);
      await mem.init();
      const state = mem.getState();
      expect(state.schemaVersion).toBe(1);
      expect(state.lastRuns).toEqual([]);
      expect(state.preferences).toEqual({});
    });

    it('should return undefined for no last run', async () => {
      const mem = new PrometheusContextMemory(20);
      await mem.init();
      expect(mem.getLastRun()).toBeUndefined();
    });

    it('should get/set preferences', async () => {
      const mem = new PrometheusContextMemory(20);
      await mem.init();
      await mem.setPreference('verbose', true);
      expect(mem.getPreference('verbose')).toBe(true);
    });

    it('should record run start', async () => {
      const mem = new PrometheusContextMemory(20);
      await mem.init();
      const id = await mem.recordRunStart({ cwd: '/project', argv: ['diagnosticar'] });
      expect(typeof id).toBe('string');
      expect(mem.getLastRun()).toBeDefined();
    });

    it('should record run end', async () => {
      const mem = new PrometheusContextMemory(20);
      await mem.init();
      const id = await mem.recordRunStart({ cwd: '/project', argv: ['diagnosticar'] });
      await mem.recordRunEnd(id, { ok: true, exitCode: 0, durationMs: 100 });
      const last = mem.getLastRun();
      expect(last?.ok).toBe(true);
      expect(last?.exitCode).toBe(0);
    });

    it('should clear state', async () => {
      const mem = new PrometheusContextMemory(20);
      await mem.init();
      await mem.setPreference('key', 'value');
      await mem.clear();
      const state = mem.getState();
      expect(state.lastRuns).toEqual([]);
      expect(state.preferences).toEqual({});
    });
  });
});
