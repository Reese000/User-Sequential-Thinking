import { describe, it, expect, beforeEach } from 'vitest';
import { findMatchingSkills, getSkillByName, buildSkillPrompt, AGENT_SKILLS } from '../src/agents/skills.js';
import { HumanRelayAgent } from '../src/agents/human-relay.js';
import type { ThoughtData } from '../src/thinking/session.js';

describe('skills module', () => {
  describe('AGENT_SKILLS', () => {
    it('should contain at least the core skills', () => {
      const names = AGENT_SKILLS.map(s => s.name);
      expect(names).toContain('code-review');
      expect(names).toContain('debug');
      expect(names).toContain('design');
      expect(names).toContain('research');
      expect(names).toContain('test');
    });

    it('should have all required fields on every skill', () => {
      for (const skill of AGENT_SKILLS) {
        expect(skill.name).toBeTruthy();
        expect(skill.description).toBeTruthy();
        expect(skill.triggerPatterns.length).toBeGreaterThan(0);
        expect(skill.systemPrompt).toBeTruthy();
      }
    });
  });

  describe('findMatchingSkills', () => {
    it('should match code-review skill', () => {
      const matches = findMatchingSkills('Please review this code');
      expect(matches.some(s => s.name === 'code-review')).toBe(true);
    });

    it('should match debug skill', () => {
      const matches = findMatchingSkills('This is broken and needs a fix');
      expect(matches.some(s => s.name === 'debug')).toBe(true);
    });

    it('should match design skill', () => {
      const matches = findMatchingSkills('Help me architect this system');
      expect(matches.some(s => s.name === 'design')).toBe(true);
    });

    it('should match research skill', () => {
      const matches = findMatchingSkills('I need to investigate this issue');
      expect(matches.some(s => s.name === 'research')).toBe(true);
    });

    it('should match test skill', () => {
      const matches = findMatchingSkills('Write tests for coverage');
      expect(matches.some(s => s.name === 'test')).toBe(true);
    });

    it('should be case insensitive', () => {
      const matches = findMatchingSkills('REVIEW the CODE');
      expect(matches.some(s => s.name === 'code-review')).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const matches = findMatchingSkills('hello world how are you');
      expect(matches).toHaveLength(0);
    });

    it('should match multiple skills for overlapping input', () => {
      const matches = findMatchingSkills('review and debug this code');
      const names = matches.map(s => s.name);
      expect(names).toContain('code-review');
      expect(names).toContain('debug');
    });
  });

  describe('getSkillByName', () => {
    it('should return the correct skill', () => {
      const skill = getSkillByName('code-review');
      expect(skill).toBeDefined();
      expect(skill!.name).toBe('code-review');
      expect(skill!.description).toContain('code review');
    });

    it('should return undefined for unknown name', () => {
      expect(getSkillByName('nonexistent')).toBeUndefined();
    });

    it('should return debug skill', () => {
      const skill = getSkillByName('debug');
      expect(skill).toBeDefined();
      expect(skill!.triggerPatterns).toContain('debug');
    });
  });

  describe('buildSkillPrompt', () => {
    it('should build a prompt from matching skills', () => {
      const prompt = buildSkillPrompt('review this code');
      expect(prompt).not.toBeNull();
      expect(prompt!).toContain('[code-review]');
      expect(prompt!).toContain('security');
    });

    it('should combine multiple matching skills', () => {
      const prompt = buildSkillPrompt('review and debug this');
      expect(prompt).toContain('[code-review]');
      expect(prompt).toContain('[debug]');
    });

    it('should return null for no matches', () => {
      const prompt = buildSkillPrompt('nothing matches here');
      expect(prompt).toBeNull();
    });
  });
});

describe('HumanRelayAgent', () => {
  let agent: HumanRelayAgent;
  const sampleHistory: ThoughtData[] = [
    { thought: 'First thought', thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true },
    { thought: 'Second thought', thoughtNumber: 2, totalThoughts: 3, nextThoughtNeeded: true },
  ];

  beforeEach(() => {
    agent = new HumanRelayAgent();
  });

  describe('createQuestion', () => {
    it('should create a relay question', () => {
      const q = agent.createQuestion('Which approach?', 'Analyzing options', sampleHistory, ['A', 'B']);
      expect(q.question).toBe('Which approach?');
      expect(q.context).toBe('Analyzing options');
      expect(q.options).toEqual(['A', 'B']);
      expect(q.thoughtHistory).toHaveLength(2);
    });

    it('should store a copy of thought history, not the reference', () => {
      const q = agent.createQuestion('Q', 'C', sampleHistory);
      expect(q.thoughtHistory).not.toBe(sampleHistory);
      expect(q.thoughtHistory).toEqual(sampleHistory);
    });

    it('should increment pending count', () => {
      agent.createQuestion('Q1', 'C1', []);
      agent.createQuestion('Q2', 'C2', []);
      expect(agent.getPendingCount()).toBe(2);
    });

    it('should work without options', () => {
      const q = agent.createQuestion('Open question', 'Context', []);
      expect(q.options).toBeUndefined();
    });
  });

  describe('formatQuestion', () => {
    it('should format a question with options', () => {
      const q = agent.createQuestion('Which?', 'Debugging', sampleHistory, ['Yes', 'No']);
      const formatted = agent.formatQuestion(q);
      expect(formatted).toContain('HUMAN RELAY REQUIRED');
      expect(formatted).toContain('Which?');
      expect(formatted).toContain('Debugging');
      expect(formatted).toContain('1. Yes');
      expect(formatted).toContain('2. No');
      expect(formatted).toContain('Thoughts so far: 2');
      expect(formatted).toContain('Second thought');
    });

    it('should format a question without options', () => {
      const q = agent.createQuestion('Open?', 'Context', []);
      const formatted = agent.formatQuestion(q);
      expect(formatted).toContain('HUMAN RELAY REQUIRED');
      expect(formatted).toContain('Open?');
      expect(formatted).not.toContain('Options:');
    });

    it('should handle empty thought history', () => {
      const q = agent.createQuestion('Q', 'C', []);
      const formatted = agent.formatQuestion(q);
      expect(formatted).not.toContain('Thoughts so far');
    });

    it('should truncate long thoughts to 100 chars', () => {
      const longThought: ThoughtData[] = [
        { thought: 'A'.repeat(200), thoughtNumber: 1, totalThoughts: 1, nextThoughtNeeded: false },
      ];
      const q = agent.createQuestion('Q', 'C', longThought);
      const formatted = agent.formatQuestion(q);
      expect(formatted).toContain('...');
      // The displayed thought should be truncated
      expect(formatted).not.toContain('A'.repeat(200));
    });
  });

  describe('processResponse', () => {
    it('should return continueThinking true for normal answer', () => {
      const response = agent.processResponse('Yes, proceed');
      expect(response.answer).toBe('Yes, proceed');
      expect(response.continueThinking).toBe(true);
    });

    it('should return continueThinking false for stop answer', () => {
      const response = agent.processResponse('stop');
      expect(response.continueThinking).toBe(false);
    });

    it('should handle Stop with capital S', () => {
      const response = agent.processResponse('Stop');
      expect(response.continueThinking).toBe(false);
    });

    it('should treat "stopped" as a stop command', () => {
      const response = agent.processResponse('stopped');
      expect(response.continueThinking).toBe(false);
    });

    it('should treat anything starting with stop as stop', () => {
      const response = agent.processResponse('stop-and-go');
      expect(response.continueThinking).toBe(false);
    });
  });

  describe('getPendingCount', () => {
    it('should return 0 for fresh agent', () => {
      expect(agent.getPendingCount()).toBe(0);
    });

    it('should track pending questions', () => {
      agent.createQuestion('Q1', 'C1', []);
      expect(agent.getPendingCount()).toBe(1);
      agent.createQuestion('Q2', 'C2', []);
      expect(agent.getPendingCount()).toBe(2);
    });
  });

  describe('clearPending', () => {
    it('should clear all pending questions', () => {
      agent.createQuestion('Q1', 'C1', []);
      agent.createQuestion('Q2', 'C2', []);
      agent.clearPending();
      expect(agent.getPendingCount()).toBe(0);
    });
  });

  describe('exportState', () => {
    it('should export pending questions', () => {
      agent.createQuestion('Q1', 'C1', sampleHistory);
      agent.createQuestion('Q2', 'C2', []);
      const state = agent.exportState();
      expect(state).toHaveLength(2);
      expect(state[0].question).toBe('Q1');
      expect(state[1].question).toBe('Q2');
    });

    it('should return a copy, not the internal array', () => {
      agent.createQuestion('Q', 'C', []);
      const state = agent.exportState();
      state.pop();
      expect(agent.getPendingCount()).toBe(1);
    });

    it('should return empty array for fresh agent', () => {
      expect(agent.exportState()).toEqual([]);
    });
  });
});
