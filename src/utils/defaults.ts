// src/utils/defaults.ts

/**
 * Default values used throughout the application.
 */

/** Default MCP server transport settings */
export const DEFAULT_TRANSPORT = {
  type: 'stdio' as const,
} as const;

/** Default validation limits */
export const VALIDATION_LIMITS = {
  minThoughtNumber: 1,
  minTotalThoughts: 1,
  maxThoughtLength: 100000,
  maxHistorySize: 1000,
} as const;

/** Default error messages */
export const ERROR_MESSAGES = {
  INVALID_THOUGHT: 'Invalid thought: must be a non-empty string',
  INVALID_THOUGHT_NUMBER: 'Invalid thoughtNumber: must be a positive number',
  INVALID_TOTAL_THOUGHTS: 'Invalid totalThoughts: must be a positive number',
  INVALID_NEXT_THOUGHT: 'Invalid nextThoughtNeeded: must be a boolean',
  THOUGHT_TOO_LONG: `Thought exceeds maximum length of ${VALIDATION_LIMITS.maxThoughtLength} characters`,
  UNKNOWN_TOOL: 'Unknown tool',
  SERVER_NOT_READY: 'Server not ready',
} as const;

/** Default box-drawing characters for formatted output */
export const BOX_CHARS = {
  topLeft: '╬',
  topRight: '╬',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  teeLeft: '├',
  teeRight: '┤',
} as const;

/** Default server metadata */
export const SERVER_METADATA = {
  name: 'user-sequential-thinking',
  version: '1.0.0',
  toolName: 'sequentialthinking',
} as const;
