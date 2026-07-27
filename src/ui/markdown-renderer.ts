// src/ui/markdown-renderer.ts

import chalk from 'chalk';

/**
 * Renders markdown-like text for terminal display using chalk.
 * Handles: headers, bold, italic, code, code blocks, lists, links.
 */
export class MarkdownRenderer {
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  /**
   * Render markdown text for terminal display.
   */
  render(text: string): string {
    if (!this.enabled) return text;

    let result = text;

    // Code blocks (``` ... ```)
    result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
      return chalk.bgGray.white(`\n${code.trim()}\n`);
    });

    // Inline code
    result = result.replace(/`([^`]+)`/g, (_match, code) => {
      return chalk.bgGray.white(code);
    });

    // Bold
    result = result.replace(/\*\*([^*]+)\*\*/g, (_match, text) => {
      return chalk.bold(text);
    });

    // Italic
    result = result.replace(/\*([^*]+)\*/g, (_match, text) => {
      return chalk.italic(text);
    });

    // Headers
    result = result.replace(/^### (.+)$/gm, (_match, text) => {
      return chalk.bold.underline(text);
    });
    result = result.replace(/^## (.+)$/gm, (_match, text) => {
      return chalk.bold.underline(text);
    });
    result = result.replace(/^# (.+)$/gm, (_match, text) => {
      return chalk.bold.underline.underline(text);
    });

    // Unordered list items
    result = result.replace(/^[\-\*] (.+)$/gm, (_match, text) => {
      return `  ${chalk.cyan('*')} ${text}`;
    });

    // Ordered list items
    result = result.replace(/^\d+\. (.+)$/gm, (_match, text) => {
      return `  ${chalk.cyan('•')} ${text}`;
    });

    return result;
  }

  /**
   * Enable or disable rendering.
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}
