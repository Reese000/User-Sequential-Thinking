import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SequentialThinkingSession } from '../src/thinking/session.js';

describe('SequentialThinkingSession', () => {
  let session: SequentialThinkingSession;

  beforeEach(() => {
    session = new SequentialThinkingSession({ disableThoughtLogging: true });
  });

  describe('validateThoughtData', () => {
    it('should accept valid thought data', () => {
      const result = session.validateThoughtData({
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      });
      expect(result.thought).toBe('Test thought');
      expect(result.thoughtNumber).toBe(1);
      expect(result.totalThoughts).toBe(3);
      expect(result.nextThoughtNeeded).toBe(true);
    });

    it('should throw for missing thought', () => {
      expect(() => session.validateThoughtData({
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      })).toThrow('Invalid thought');
    });

    it('should throw for non-string thought', () => {
      expect(() => session.validateThoughtData({
        thought: 123,
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      })).toThrow('Invalid thought');
    });

    it('should throw for invalid thoughtNumber', () => {
      expect(() => session.validateThoughtData({
        thought: 'Test',
        thoughtNumber: 0,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      })).toThrow('Invalid thoughtNumber');
    });

    it('should throw for invalid totalThoughts', () => {
      expect(() => session.validateThoughtData({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 0,
        nextThoughtNeeded: true,
      })).toThrow('Invalid totalThoughts');
    });

    it('should throw for non-boolean nextThoughtNeeded', () => {
      expect(() => session.validateThoughtData({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: 'yes',
      })).toThrow('Invalid nextThoughtNeeded');
    });

    it('should preserve optional fields', () => {
      const result = session.validateThoughtData({
        thought: 'Revision',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1,
        branchFromThought: 1,
        branchId: 'branch-a',
        needsMoreThoughts: true,
      });
      expect(result.isRevision).toBe(true);
      expect(result.revisesThought).toBe(1);
      expect(result.branchFromThought).toBe(1);
      expect(result.branchId).toBe('branch-a');
      expect(result.needsMoreThoughts).toBe(true);
    });
  });

  describe('processThought', () => {
    it('should process a valid thought and return MCP response', () => {
      const result = session.processThought({
        thought: 'Analyzing the problem',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      });
      expect(result.isError).toBeFalsy();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.thoughtNumber).toBe(1);
      expect(parsed.totalThoughts).toBe(3);
      expect(parsed.nextThoughtNeeded).toBe(true);
      expect(parsed.thoughtHistoryLength).toBe(1);
      expect(parsed.branches).toEqual([]);
    });

    it('should auto-adjust totalThoughts when thoughtNumber exceeds it', () => {
      session.processThought({
        thought: 'Thought 1',
        thoughtNumber: 1,
        totalThoughts: 2,
        nextThoughtNeeded: true,
      });
      const result = session.processThought({
        thought: 'Thought 3',
        thoughtNumber: 3,
        totalThoughts: 2,
        nextThoughtNeeded: true,
      });
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.totalThoughts).toBe(3); // auto-adjusted
    });

    it('should return error response for invalid input', () => {
      const result = session.processThought({});
      expect(result.isError).toBe(true);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.status).toBe('failed');
      expect(parsed.error).toBeDefined();
    });

    it('should track branches', () => {
      session.processThought({
        thought: 'Original path',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      });
      const result = session.processThought({
        thought: 'Branching here',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'branch-a',
      });
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.branches).toContain('branch-a');
    });

    it('should log to stderr when logging is enabled', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const loggingSession = new SequentialThinkingSession({ disableThoughtLogging: false });
      loggingSession.processThought({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      });
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not log when logging is disabled', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      session.processThought({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('history and branches', () => {
    it('should maintain thought history', () => {
      session.processThought({ thought: 'T1', thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true });
      session.processThought({ thought: 'T2', thoughtNumber: 2, totalThoughts: 3, nextThoughtNeeded: true });
      session.processThought({ thought: 'T3', thoughtNumber: 3, totalThoughts: 3, nextThoughtNeeded: false });
      expect(session.getHistory()).toHaveLength(3);
    });

    it('should return current thought number', () => {
      expect(session.getCurrentThoughtNumber()).toBe(0);
      session.processThought({ thought: 'T1', thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true });
      expect(session.getCurrentThoughtNumber()).toBe(1);
    });

    it('should track multiple branches', () => {
      session.processThought({ thought: 'Root', thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true });
      session.processThought({ thought: 'A', thoughtNumber: 2, totalThoughts: 3, nextThoughtNeeded: true, branchFromThought: 1, branchId: 'a' });
      session.processThought({ thought: 'B', thoughtNumber: 2, totalThoughts: 3, nextThoughtNeeded: true, branchFromThought: 1, branchId: 'b' });
      expect(session.getBranches()).toEqual(['a', 'b']);
      expect(session.getBranch('a')).toHaveLength(1);
      expect(session.getBranch('b')).toHaveLength(1);
    });

    it('should return empty array for unknown branch', () => {
      expect(session.getBranch('nonexistent')).toEqual([]);
    });

    it('should respect maxHistorySize', () => {
      const smallSession = new SequentialThinkingSession({ disableThoughtLogging: true, maxHistorySize: 3 });
      for (let i = 1; i <= 5; i++) {
        smallSession.processThought({ thought: `T${i}`, thoughtNumber: i, totalThoughts: 5, nextThoughtNeeded: true });
      }
      expect(smallSession.getHistory()).toHaveLength(3);
      expect(smallSession.getHistory()[0].thought).toBe('T3');
    });
  });

  describe('reset', () => {
    it('should clear all history and branches', () => {
      session.processThought({ thought: 'T1', thoughtNumber: 1, totalThoughts: 2, nextThoughtNeeded: true, branchFromThought: 1, branchId: 'b1' });
      session.reset();
      expect(session.getHistory()).toHaveLength(0);
      expect(session.getBranches()).toHaveLength(0);
      expect(session.getCurrentThoughtNumber()).toBe(0);
    });
  });

  describe('export/import', () => {
    it('should export session state', () => {
      session.processThought({ thought: 'T1', thoughtNumber: 1, totalThoughts: 2, nextThoughtNeeded: true });
      session.processThought({ thought: 'T2', thoughtNumber: 2, totalThoughts: 2, nextThoughtNeeded: false, branchFromThought: 1, branchId: 'b1' });
      const exported = session.export();
      expect(exported.thoughtHistory).toHaveLength(2);
      expect(exported.branches['b1']).toHaveLength(1);
    });

    it('should import session state', () => {
      const state = {
        thoughtHistory: [
          { thought: 'Imported', thoughtNumber: 1, totalThoughts: 1, nextThoughtNeeded: false },
        ],
        branches: {},
      };
      session.import(state);
      expect(session.getHistory()).toHaveLength(1);
      expect(session.getHistory()[0].thought).toBe('Imported');
    });
  });

  describe('formatThought', () => {
    it('should format a regular thought', () => {
      const result = session.formatThought({
        thought: 'Analysis step',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      });
      expect(result).toContain('Thought');
      expect(result).toContain('1/3');
      expect(result).toContain('Analysis step');
    });

    it('should format a revision', () => {
      const result = session.formatThought({
        thought: 'Correcting',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1,
      });
      expect(result).toContain('Revision');
      expect(result).toContain('revising thought 1');
    });

    it('should format a branch', () => {
      const result = session.formatThought({
        thought: 'Alternative',
        thoughtNumber: 3,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchFromThought: 2,
        branchId: 'alt',
      });
      expect(result).toContain('Branch');
      expect(result).toContain('from thought 2');
      expect(result).toContain('alt');
    });
  });
});
