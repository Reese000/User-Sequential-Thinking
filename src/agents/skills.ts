// src/agents/skills.ts

import type { ThoughtData, McpResponse } from '../thinking/session.js';

/**
 * Pre-built skill prompts that guide the thinking process for specific task types.
 */

/** A skill definition with trigger pattern and system prompt */
export interface Skill {
  name: string;
  description: string;
  triggerPatterns: string[];
  systemPrompt: string;
}

/** All available skills */
export const AGENT_SKILLS: Skill[] = [
  {
    name: 'code-review',
    description: 'Structured code review with security, performance, and correctness analysis',
    triggerPatterns: ['review', 'code review', 'audit'],
    systemPrompt: `Perform a structured code review:
1. Identify the core functionality and architecture
2. Check for security vulnerabilities (injection, auth bypass, secrets)
3. Check for performance issues (N+1 queries, unnecessary allocations, blocking)
4. Check for correctness (edge cases, error handling, race conditions)
5. Check for maintainability (naming, structure, documentation)
6. Provide a prioritized list of findings with severity levels`,
  },
  {
    name: 'debug',
    description: 'Systematic debugging approach for identifying root causes',
    triggerPatterns: ['debug', 'fix', 'broken', 'error', 'bug'],
    systemPrompt: `Apply systematic debugging:
1. Reproduce the issue — what are the exact steps?
2. Gather evidence — logs, stack traces, state dumps
3. Form hypotheses — what could cause this symptom?
4. Test hypotheses — which one explains all evidence?
5. Fix the root cause, not just the symptom
6. Verify the fix doesn't regress other functionality
7. Add a test to prevent recurrence`,
  },
  {
    name: 'design',
    description: 'Architecture and design planning with trade-off analysis',
    triggerPatterns: ['design', 'architect', 'plan', 'structure'],
    systemPrompt: `Apply structured design thinking:
1. Clarify requirements and constraints
2. Identify the key design decisions
3. List at least 3 viable approaches
4. For each approach, evaluate: complexity, scalability, maintainability, risk
5. Select the best approach with justification
6. Define interfaces and data flow
7. Identify potential failure modes and mitigations`,
  },
  {
    name: 'research',
    description: 'Deep research with source evaluation and synthesis',
    triggerPatterns: ['research', 'investigate', 'explore', 'compare'],
    systemPrompt: `Conduct structured research:
1. Define the question clearly
2. Identify what is known vs unknown
3. Gather information from multiple sources
4. Evaluate source reliability
5. Synthesize findings into a coherent picture
6. Identify gaps and remaining questions
7. Provide a recommendation with confidence level`,
  },
  {
    name: 'test',
    description: 'Test strategy design and test case generation',
    triggerPatterns: ['test', 'testing', 'coverage', 'spec'],
    systemPrompt: `Design a test strategy:
1. Identify what needs to be tested (units, integration, e2e)
2. List critical paths and edge cases
3. Define test cases for: happy path, error cases, boundary conditions
4. Consider: mocking strategy, test data, assertions
5. Prioritize tests by risk and value
6. Estimate coverage impact`,
  },
];

/**
 * Find skills that match the given text.
 */
export function findMatchingSkills(text: string): Skill[] {
  const lower = text.toLowerCase();
  return AGENT_SKILLS.filter(skill =>
    skill.triggerPatterns.some(pattern => lower.includes(pattern))
  );
}

/**
 * Get a skill by name.
 */
export function getSkillByName(name: string): Skill | undefined {
  return AGENT_SKILLS.find(skill => skill.name === name);
}

/**
 * Generate a system prompt that combines multiple matching skills.
 */
export function buildSkillPrompt(text: string): string | null {
  const matches = findMatchingSkills(text);
  if (matches.length === 0) return null;
  return matches.map(s => `[${s.name}]\n${s.systemPrompt}`).join('\n\n');
}
