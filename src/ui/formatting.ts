// src/ui/formatting.ts

import chalk from 'chalk';

/**
 * Format a number with thousands separators.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Format a duration in milliseconds to a human-readable string.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Truncate a string to a maximum length, adding ellipsis if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Wrap text to a given width, breaking at word boundaries.
 */
export function wrapText(text: string, width: number): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 > width && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
}

/**
 * Create an aligned table.
 */
export function formatTable(
  headers: string[],
  rows: string[][],
  options: { padding?: number; align?: ('left' | 'right')[] } = {},
): string {
  const padding = options.padding ?? 2;
  const colWidths = headers.map((h, i) => {
    const maxData = rows.reduce((max, row) => Math.max(max, row[i]?.length ?? 0), 0);
    return Math.max(h.length, maxData);
  });

  const sep = colWidths.map(w => '─'.repeat(w + padding * 2)).join('─');
  const headerRow = headers
    .map((h, i) => h.padEnd(colWidths[i]))
    .join('  '.repeat(padding) + '  ' + '  '.repeat(padding));

  const dataRows = rows.map(row =>
    row.map((cell, i) => cell.padEnd(colWidths[i])).join('  '.repeat(padding) + '  ' + '  '.repeat(padding)),
  );

  return [chalk.bold(headerRow), sep, ...dataRows].join('\n');
}
