// src/utils/terminal-themes.ts

import chalk from 'chalk';

/** A terminal color theme */
export interface TerminalTheme {
  name: string;
  thought: typeof chalk;
  revision: typeof chalk;
  branch: typeof chalk;
  error: typeof chalk;
  success: typeof chalk;
  info: typeof chalk;
  border: typeof chalk;
  muted: typeof chalk;
}

/** Default theme using standard chalk colors */
export const defaultTheme: TerminalTheme = {
  name: 'default',
  thought: chalk.blue,
  revision: chalk.yellow,
  branch: chalk.green,
  error: chalk.red,
  success: chalk.green,
  info: chalk.cyan,
  border: chalk.gray,
  muted: chalk.dim,
};

/** Dark theme (optimized for dark terminals) */
export const darkTheme: TerminalTheme = {
  name: 'dark',
  thought: chalk.blueBright,
  revision: chalk.yellowBright,
  branch: chalk.greenBright,
  error: chalk.redBright,
  success: chalk.greenBright,
  info: chalk.cyanBright,
  border: chalk.white,
  muted: chalk.dim,
};

/** Minimal theme (no colors, plain text indicators) */
export const minimalTheme: TerminalTheme = {
  name: 'minimal',
  thought: chalk.white,
  revision: chalk.white,
  branch: chalk.white,
  error: chalk.white,
  success: chalk.white,
  info: chalk.white,
  border: chalk.white,
  muted: chalk.white,
};

/** Available themes */
export const themes: Record<string, TerminalTheme> = {
  default: defaultTheme,
  dark: darkTheme,
  minimal: minimalTheme,
};

/**
 * Get a theme by name. Falls back to default if not found.
 */
export function getTheme(name: string): TerminalTheme {
  return themes[name] ?? defaultTheme;
}

/**
 * List available theme names.
 */
export function listThemes(): string[] {
  return Object.keys(themes);
}
