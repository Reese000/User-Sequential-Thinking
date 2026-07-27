// src/agents/human-relay.ts

import type { ThoughtData, McpResponse } from '../thinking/session.js';

/**
 * Human relay agent: bridges between automated thinking and human input.
 *
 * When the thinking process reaches a point where human judgment is needed,
 * this agent formats the current state and presents questions for human review.
 */

/** A question to relay to the human operator */
export interface RelayQuestion {
  question: string;
  context: string;
  options?: string[];
  thoughtHistory: ThoughtData[];
}

/** Human relay response */
export interface RelayResponse {
  answer: string;
  continueThinking: boolean;
  additionalContext?: string;
}

/**
 * HumanRelayAgent manages handoff points between automated thinking and human input.
 */
export class HumanRelayAgent {
  private pendingQuestions: RelayQuestion[] = [];

  /**
   * Create a relay question from current thinking state.
   */
  createQuestion(
    question: string,
    context: string,
    thoughtHistory: readonly ThoughtData[],
    options?: string[],
  ): RelayQuestion {
    const relayQ: RelayQuestion = {
      question,
      context,
      options,
      thoughtHistory: [...thoughtHistory],
    };
    this.pendingQuestions.push(relayQ);
    return relayQ;
  }

  /**
   * Format a relay question for display.
   */
  formatQuestion(question: RelayQuestion): string {
    const lines: string[] = [
      '',
      '=== HUMAN RELAY REQUIRED ===',
      '',
      `Context: ${question.context}`,
      '',
      `Question: ${question.question}`,
    ];

    if (question.options && question.options.length > 0) {
      lines.push('');
      lines.push('Options:');
      question.options.forEach((opt, i) => {
        lines.push(`  ${i + 1}. ${opt}`);
      });
    }

    if (question.thoughtHistory.length > 0) {
      lines.push('');
      lines.push(`Thoughts so far: ${question.thoughtHistory.length}`);
      const last = question.thoughtHistory[question.thoughtHistory.length - 1];
      lines.push(`Last thought: ${last.thought.substring(0, 100)}...`);
    }

    lines.push('');
    lines.push('=============================');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Process a human response to a relay question.
   */
  processResponse(answer: string): RelayResponse {
    const continueThinking = !answer.toLowerCase().startsWith('stop');
    return {
      answer,
      continueThinking,
    };
  }

  /**
   * Get the count of pending questions.
   */
  getPendingCount(): number {
    return this.pendingQuestions.length;
  }

  /**
   * Clear all pending questions.
   */
  clearPending(): void {
    this.pendingQuestions = [];
  }

  /**
   * Export relay state.
   */
  exportState(): RelayQuestion[] {
    return [...this.pendingQuestions];
  }
}
