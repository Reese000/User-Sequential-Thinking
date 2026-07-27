// src/utils/config-schema.ts

/** Configuration schema for the Sequential Thinking MCP server */

/** Server configuration */
export interface ServerConfig {
  /** Server name reported to MCP hosts */
  name: string;
  /** Server version */
  version: string;
  /** Disable thought logging to stderr */
  disableThoughtLogging: boolean;
  /** Maximum number of thoughts to keep in history */
  maxHistorySize: number;
  /** Enable debug output */
  debug: boolean;
}

/** MCP tool definition matching the upstream schema */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/** Default server configuration */
export const DEFAULT_CONFIG: ServerConfig = {
  name: 'user-sequential-thinking',
  version: '1.0.0',
  disableThoughtLogging: false,
  maxHistorySize: 1000,
  debug: false,
};

/** The sequential thinking tool definition */
export const SEQUENTIAL_THINKING_TOOL: ToolDefinition = {
  name: 'sequentialthinking',
  description: `A detailed tool for dynamic and reflective problem-solving through thoughts.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out

Key features:
- You can adjust total_thoughts up or down as you progress
- You can question or revise previous thoughts
- You can add more thoughts even after reaching what seemed like the end
- You can express uncertainty and explore alternative approaches
- Not every thought needs to build linearly - you can branch or backtrack
- Generates a solution hypothesis
- Verifies the hypothesis based on the Chain of Thought steps
- Repeats the process until satisfied
- Provides a correct answer`,
  inputSchema: {
    type: 'object',
    properties: {
      thought: {
        type: 'string',
        description: 'Your current thinking step',
      },
      nextThoughtNeeded: {
        type: 'boolean',
        description: 'Whether another thought step is needed',
      },
      thoughtNumber: {
        type: 'integer',
        description: 'Current thought number',
        minimum: 1,
      },
      totalThoughts: {
        type: 'integer',
        description: 'Estimated total thoughts needed',
        minimum: 1,
      },
      isRevision: {
        type: 'boolean',
        description: 'Whether this revises previous thinking',
      },
      revisesThought: {
        type: 'integer',
        description: 'Which thought is being reconsidered',
        minimum: 1,
      },
      branchFromThought: {
        type: 'integer',
        description: 'Branching point thought number',
        minimum: 1,
      },
      branchId: {
        type: 'string',
        description: 'Branch identifier',
      },
      needsMoreThoughts: {
        type: 'boolean',
        description: 'If more thoughts are needed',
      },
    },
    required: ['thought', 'nextThoughtNeeded', 'thoughtNumber', 'totalThoughts'],
  },
};

/**
 * Parse command-line arguments into a partial server config.
 * Falls back to defaults for missing values.
 */
export function parseArgs(argv: string[]): Partial<ServerConfig> {
  const args = argv.slice(2);
  const config: Partial<ServerConfig> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--disable-logging':
        config.disableThoughtLogging = true;
        break;
      case '--debug':
        config.debug = true;
        break;
      case '--max-history':
        config.maxHistorySize = parseInt(args[++i], 10) || DEFAULT_CONFIG.maxHistorySize;
        break;
      case '--name':
        config.name = args[++i] || DEFAULT_CONFIG.name;
        break;
    }
  }

  return config;
}

/**
 * Merge partial config with defaults.
 */
export function mergeConfig(partial: Partial<ServerConfig>): ServerConfig {
  return { ...DEFAULT_CONFIG, ...partial };
}
