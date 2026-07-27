// src/ui/spinner.ts

import chalk from 'chalk';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * Terminal spinner for indicating ongoing operations.
 */
export class Spinner {
  private frameIndex = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private message: string;
  private stream: NodeJS.WriteStream;

  constructor(message = 'Thinking...', stream: NodeJS.WriteStream = process.stderr) {
    this.message = message;
    this.stream = stream;
  }

  /**
   * Start the spinner animation.
   */
  start(): void {
    if (this.interval) return;
    this.frameIndex = 0;
    this.interval = setInterval(() => {
      this.stream.write(`\r${chalk.cyan(FRAMES[this.frameIndex])} ${this.message}`);
      this.frameIndex = (this.frameIndex + 1) % FRAMES.length;
    }, 80);
  }

  /**
   * Stop the spinner and optionally show a final message.
   */
  stop(finalMessage?: string): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.stream.write('\r' + ' '.repeat(this.message.length + 4) + '\r');
    if (finalMessage) {
      this.stream.write(finalMessage + '\n');
    }
  }

  /**
   * Update the spinner message while running.
   */
  setMessage(message: string): void {
    this.message = message;
  }

  /**
   * Check if the spinner is currently running.
   */
  isRunning(): boolean {
    return this.interval !== null;
  }
}
