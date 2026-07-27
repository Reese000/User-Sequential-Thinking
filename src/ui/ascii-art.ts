// src/ui/ascii-art.ts

import chalk from 'chalk';

/** ASCII art logo for the Sequential Thinking server */
export const LOGO = `
${chalk.blue('  ╔═══════════════════════════════════════════════╗')}
${chalk.blue('  ║')}  ${chalk.cyan.bold('Sequential Thinking')} ${chalk.gray('MCP Server')}              ${chalk.blue('║')}
${chalk.blue('  ║')}  ${chalk.gray('v1.0.0 — Structured reasoning tool')}           ${chalk.blue('║')}
${chalk.blue('  ╚═══════════════════════════════════════════════╝')}
`;

/** Compact banner for non-interactive mode */
export const BANNER = `${chalk.cyan('Sequential Thinking')} ${chalk.gray('v1.0.0')} — running on stdio`;

/** Separator line */
export const SEPARATOR = chalk.gray('─'.repeat(50));

/** Status indicators */
export const STATUS = {
  ready: chalk.green('●') + ' Ready',
  busy: chalk.yellow('●') + ' Processing...',
  error: chalk.red('●') + ' Error',
  idle: chalk.gray('●') + ' Idle',
} as const;

/**
 * Format a section header.
 */
export function sectionHeader(title: string): string {
  const width = 50;
  const padding = Math.max(0, width - title.length - 4);
  return `\n${chalk.bold(`[${title}]`)}${' '.repeat(padding)}\n`;
}

/**
 * Format a key-value pair for display.
 */
export function keyValue(key: string, value: string | number | boolean): string {
  return `${chalk.gray(key + ':')} ${String(value)}`;
}
