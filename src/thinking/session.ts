// src/thinking/session.ts

import chalk from 'chalk';

/** A single thought in the thinking chain */
export interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
}

/** Result returned after processing a thought */
export interface ThoughtResult {
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
  branches: string[];
  thoughtHistoryLength: number;
}

/** MCP content response format */
export interface McpResponse {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/** Options for the session */
export interface SessionOptions {
  disableThoughtLogging?: boolean;
  maxHistorySize?: number;
}

/**
 * Core thinking session that manages thought history and branches.
 * Wraps the upstream SequentialThinkingServer logic with a cleaner API.
 */
export class SequentialThinkingSession {
  private thoughtHistory: ThoughtData[] = [];
  private branches: Map<string, ThoughtData[]> = new Map();
  private disableThoughtLogging: boolean;
  private maxHistorySize: number;

  constructor(options: SessionOptions = {}) {
    this.disableThoughtLogging = options.disableThoughtLogging ??
      (process.env.DISABLE_THOUGHT_LOGGING || '').toLowerCase() === 'true';
    this.maxHistorySize = options.maxHistorySize ?? 1000;
  }

  /**
   * Validate thought data, throwing on invalid input.
   */
  validateThoughtData(input: Record<string, unknown>): ThoughtData {
    if (!input.thought || typeof input.thought !== 'string') {
      throw new Error('Invalid thought: must be a string');
    }
    if (typeof input.thoughtNumber !== 'number' || input.thoughtNumber < 1) {
      throw new Error('Invalid thoughtNumber: must be a positive number');
    }
    if (typeof input.totalThoughts !== 'number' || input.totalThoughts < 1) {
      throw new Error('Invalid totalThoughts: must be a positive number');
    }
    if (typeof input.nextThoughtNeeded !== 'boolean') {
      throw new Error('Invalid nextThoughtNeeded: must be a boolean');
    }

    return {
      thought: input.thought as string,
      thoughtNumber: input.thoughtNumber as number,
      totalThoughts: input.totalThoughts as number,
      nextThoughtNeeded: input.nextThoughtNeeded as boolean,
      isRevision: input.isRevision as boolean | undefined,
      revisesThought: input.revisesThought as number | undefined,
      branchFromThought: input.branchFromThought as number | undefined,
      branchId: input.branchId as string | undefined,
      needsMoreThoughts: input.needsMoreThoughts as boolean | undefined,
    };
  }

  /**
   * Format a thought for terminal display with box-drawing characters.
   */
  formatThought(thoughtData: ThoughtData): string {
    const { thoughtNumber, totalThoughts, thought, isRevision, revisesThought, branchFromThought, branchId } = thoughtData;

    let prefix: string;
    let context: string;

    if (isRevision) {
      prefix = chalk.yellow('Revision');
      context = ` (revising thought ${revisesThought})`;
    } else if (branchFromThought) {
      prefix = chalk.green('Branch');
      context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
    } else {
      prefix = chalk.blue('Thought');
      context = '';
    }

    const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
    const borderLen = Math.max(header.length, thought.length) + 4;
    const border = '─'.repeat(borderLen);

    return [
      `╬${border}╬`,
      `│ ${header.padEnd(borderLen - 2)} │`,
      `├${border}┤`,
      `│ ${thought.padEnd(borderLen - 2)} │`,
      `╰${border}╯`,
    ].join('\n');
  }

  /**
   * Process a thought: validate, record, format, and return MCP response.
   */
  processThought(input: Record<string, unknown>): McpResponse {
    try {
      const validated = this.validateThoughtData(input);

      // Auto-adjust totalThoughts if thoughtNumber exceeds it
      if (validated.thoughtNumber > validated.totalThoughts) {
        validated.totalThoughts = validated.thoughtNumber;
      }

      // Enforce history size limit
      if (this.thoughtHistory.length >= this.maxHistorySize) {
        this.thoughtHistory.shift();
      }
      this.thoughtHistory.push(validated);

      // Track branches
      if (validated.branchFromThought && validated.branchId) {
        if (!this.branches.has(validated.branchId)) {
          this.branches.set(validated.branchId, []);
        }
        this.branches.get(validated.branchId)!.push(validated);
      }

      // Log to stderr unless disabled
      if (!this.disableThoughtLogging) {
        console.error(this.formatThought(validated));
      }

      const result: ThoughtResult = {
        thoughtNumber: validated.thoughtNumber,
        totalThoughts: validated.totalThoughts,
        nextThoughtNeeded: validated.nextThoughtNeeded,
        branches: Array.from(this.branches.keys()),
        thoughtHistoryLength: this.thoughtHistory.length,
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed',
          }, null, 2),
        }],
        isError: true,
      };
    }
  }

  /** Get the full thought history */
  getHistory(): readonly ThoughtData[] {
    return this.thoughtHistory;
  }

  /** Get all branch IDs */
  getBranches(): string[] {
    return Array.from(this.branches.keys());
  }

  /** Get thoughts in a specific branch */
  getBranch(branchId: string): readonly ThoughtData[] {
    return this.branches.get(branchId) ?? [];
  }

  /** Get the current thought number */
  getCurrentThoughtNumber(): number {
    return this.thoughtHistory.length > 0
      ? this.thoughtHistory[this.thoughtHistory.length - 1].thoughtNumber
      : 0;
  }

  /** Reset the session */
  reset(): void {
    this.thoughtHistory = [];
    this.branches.clear();
  }

  /** Export session state as JSON-serializable object */
  export(): {
    thoughtHistory: ThoughtData[];
    branches: Record<string, ThoughtData[]>;
  } {
    return {
      thoughtHistory: [...this.thoughtHistory],
      branches: Object.fromEntries(this.branches),
    };
  }

  /** Import session state from a previously exported object */
  import(data: { thoughtHistory: ThoughtData[]; branches?: Record<string, ThoughtData[]> }): void {
    this.thoughtHistory = [...data.thoughtHistory];
    this.branches = new Map(Object.entries(data.branches ?? {}));
  }
}
