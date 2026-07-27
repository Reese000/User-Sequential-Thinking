// src/ui/ui.ts

import chalk from 'chalk';
import { SequentialThinkingSession, type ThoughtData, type McpResponse } from '../thinking/session.js';
import { LOGO, STATUS, sectionHeader, keyValue } from './ascii-art.js';
import { MarkdownRenderer } from './markdown-renderer.js';
import { Spinner } from './spinner.js';
import { formatDuration, truncate } from './formatting.js';

/**
 * High-level UI manager that coordinates display of thinking sessions.
 */
export class UI {
  private session: SequentialThinkingSession;
  private renderer: MarkdownRenderer;
  private spinner: Spinner;
  private startTime: number;

  constructor(session: SequentialThinkingSession) {
    this.session = session;
    this.renderer = new MarkdownRenderer();
    this.spinner = new Spinner();
    this.startTime = Date.now();
  }

  /**
   * Display the startup banner.
   */
  showBanner(): void {
    console.log(LOGO);
  }

  /**
   * Display the current status.
   */
  showStatus(): void {
    const history = this.session.getHistory();
    const branches = this.session.getBranches();
    const elapsed = formatDuration(Date.now() - this.startTime);

    console.log('');
    console.log(sectionHeader('Session Status'));
    console.log(keyValue('Thoughts', history.length));
    console.log(keyValue('Branches', branches.length));
    console.log(keyValue('Runtime', elapsed));
    if (history.length > 0) {
      const last = history[history.length - 1];
      console.log(keyValue('Last thought', truncate(last.thought, 60)));
      console.log(keyValue('More needed', last.nextThoughtNeeded ? 'yes' : 'no'));
    }
    console.log('');
  }

  /**
   * Display a thought result.
   */
  showThoughtResult(result: McpResponse): void {
    if (result.isError) {
      console.log(chalk.red('Thought failed:'));
      console.log(result.content[0].text);
    }
  }

  /**
   * Display the full thought history.
   */
  showHistory(): void {
    const history = this.session.getHistory();
    if (history.length === 0) {
      console.log(chalk.gray('No thoughts recorded.'));
      return;
    }

    console.log(sectionHeader('Thought History'));
    history.forEach((thought) => {
      const prefix = thought.isRevision
        ? chalk.yellow('REV')
        : thought.branchFromThought
          ? chalk.green('BRN')
          : chalk.blue('THK');
      console.log(
        `${prefix} ${thought.thoughtNumber}/${thought.totalThoughts} — ${truncate(thought.thought, 70)}`,
      );
    });
    console.log('');
  }

  /**
   * Display the export state.
   */
  showExport(): string {
    return JSON.stringify(this.session.export(), null, 2);
  }

  /**
   * Start the spinner.
   */
  showSpinner(message?: string): void {
    if (message) this.spinner.setMessage(message);
    this.spinner.start();
  }

  /**
   * Stop the spinner.
   */
  hideSpinner(message?: string): void {
    this.spinner.stop(message);
  }

  /**
   * Render markdown text for terminal display.
   */
  renderMarkdown(text: string): string {
    return this.renderer.render(text);
  }
}
