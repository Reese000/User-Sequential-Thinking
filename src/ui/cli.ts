// src/ui/cli.ts

import readline from 'node:readline';
import chalk from 'chalk';
import { SequentialThinkingSession, type ThoughtData } from '../thinking/session.js';

/**
 * CLI interface for interactive sequential thinking.
 */
export class CliInterface {
  private session: SequentialThinkingSession;
  private rl: readline.Interface | null = null;

  constructor(session: SequentialThinkingSession) {
    this.session = session;
  }

  /**
   * Start the interactive CLI loop.
   */
  async start(): Promise<void> {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(chalk.cyan('Sequential Thinking CLI'));
    console.log(chalk.gray('Type your thoughts. Commands: /history, /branches, /export, /reset, /quit'));
    console.log('');

    return new Promise((resolve) => {
      const prompt = () => {
        this.rl!.question(chalk.blue('> '), async (input) => {
          const trimmed = input.trim();

          if (!trimmed) {
            prompt();
            return;
          }

          if (trimmed.startsWith('/')) {
            const handled = await this.handleCommand(trimmed);
            if (handled === 'quit') {
              this.rl!.close();
              resolve();
              return;
            }
            prompt();
            return;
          }

          // Treat as a thought
          const history = this.session.getHistory();
          const thoughtNumber = history.length + 1;

          const result = this.session.processThought({
            thought: trimmed,
            thoughtNumber,
            totalThoughts: thoughtNumber + 1,
            nextThoughtNeeded: true,
          });

          if (result.isError) {
            console.log(chalk.red(`Error: ${result.content[0].text}`));
          }

          prompt();
        });
      };

      prompt();
    });
  }

  /**
   * Handle slash commands.
   */
  private async handleCommand(input: string): Promise<string | null> {
    const cmd = input.split(/\s+/)[0].toLowerCase();

    switch (cmd) {
      case '/history': {
        const history = this.session.getHistory();
        if (history.length === 0) {
          console.log(chalk.gray('No thoughts recorded yet.'));
        } else {
          history.forEach((t, i) => {
            console.log(chalk.gray(`${i + 1}. [${t.thoughtNumber}/${t.totalThoughts}] ${t.thought.substring(0, 80)}`));
          });
        }
        break;
      }
      case '/branches': {
        const branches = this.session.getBranches();
        if (branches.length === 0) {
          console.log(chalk.gray('No branches.'));
        } else {
          branches.forEach(id => {
            const branch = this.session.getBranch(id);
            console.log(chalk.green(`Branch ${id}: ${branch.length} thoughts`));
          });
        }
        break;
      }
      case '/export': {
        const state = this.session.export();
        console.log(JSON.stringify(state, null, 2));
        break;
      }
      case '/reset': {
        this.session.reset();
        console.log(chalk.yellow('Session reset.'));
        break;
      }
      case '/quit':
      case '/exit':
        return 'quit';
      default:
        console.log(chalk.gray(`Unknown command: ${cmd}`));
    }

    return null;
  }

  /**
   * Close the CLI interface.
   */
  close(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
  }
}
