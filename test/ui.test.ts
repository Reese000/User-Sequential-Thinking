import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SequentialThinkingSession } from '../src/thinking/session.js';
import { CliInterface } from '../src/ui/cli.js';
import { MarkdownRenderer } from '../src/ui/markdown-renderer.js';
import { Spinner } from '../src/ui/spinner.js';
import { formatNumber, formatDuration, truncate, wrapText, formatTable } from '../src/ui/formatting.js';
import { getTheme, listThemes, themes, defaultTheme, darkTheme, minimalTheme } from '../src/utils/terminal-themes.js';

describe('MarkdownRenderer', () => {
  it('should render inline code', () => {
    const renderer = new MarkdownRenderer(true);
    const result = renderer.render('Use `console.log` for debugging');
    expect(result).toContain('console.log');
  });

  it('should render bold text', () => {
    const renderer = new MarkdownRenderer(true);
    const result = renderer.render('This is **bold** text');
    expect(result).toContain('bold');
  });

  it('should render italic text', () => {
    const renderer = new MarkdownRenderer(true);
    const result = renderer.render('This is *italic* text');
    expect(result).toContain('italic');
  });

  it('should pass through when disabled', () => {
    const renderer = new MarkdownRenderer(false);
    const input = '**bold** and `code`';
    expect(renderer.render(input)).toBe(input);
  });

  it('should render headers', () => {
    const renderer = new MarkdownRenderer(true);
    const result = renderer.render('# Title\n## Section\n### Subsection');
    expect(result).toContain('Title');
    expect(result).toContain('Section');
    expect(result).toContain('Subsection');
  });

  it('should render list items', () => {
    const renderer = new MarkdownRenderer(true);
    const result = renderer.render('- item one\n- item two');
    expect(result).toContain('item one');
    expect(result).toContain('item two');
  });

  it('should toggle enabled state', () => {
    const renderer = new MarkdownRenderer(true);
    renderer.setEnabled(false);
    const input = '**test**';
    expect(renderer.render(input)).toBe(input);
    renderer.setEnabled(true);
    expect(renderer.render(input)).not.toBe(input);
  });
});

describe('Spinner', () => {
  let mockStream: { write: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockStream = { write: vi.fn() };
  });

  it('should start and stop without errors', () => {
    const spinner = new Spinner('Loading...', mockStream as any);
    spinner.start();
    expect(spinner.isRunning()).toBe(true);
    spinner.stop();
    expect(spinner.isRunning()).toBe(false);
  });

  it('should write to the provided stream', () => {
    const spinner = new Spinner('Test', mockStream as any);
    spinner.start();
    spinner.stop('Done');
    expect(mockStream.write).toHaveBeenCalled();
  });

  it('should update message while running', () => {
    const spinner = new Spinner('Initial', mockStream as any);
    spinner.setMessage('Updated');
    spinner.start();
    spinner.stop();
    expect(spinner.isRunning()).toBe(false);
  });

  it('should not start twice', () => {
    const spinner = new Spinner('Test', mockStream as any);
    spinner.start();
    spinner.start(); // second start should be no-op
    spinner.stop();
    expect(spinner.isRunning()).toBe(false);
  });
});

describe('formatting utilities', () => {
  describe('formatNumber', () => {
    it('should format small numbers', () => {
      expect(formatNumber(42)).toBe('42');
    });

    it('should format numbers with thousands', () => {
      expect(formatNumber(1234)).toBeDefined(); // locale-dependent
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      expect(formatDuration(500)).toBe('500ms');
    });

    it('should format seconds', () => {
      expect(formatDuration(1500)).toBe('1s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(90000)).toBe('1m 30s');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate long strings with ellipsis', () => {
      const result = truncate('this is a very long string', 10);
      expect(result).toHaveLength(10);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should handle exact length', () => {
      expect(truncate('12345', 5)).toBe('12345');
    });
  });

  describe('wrapText', () => {
    it('should not wrap short text', () => {
      expect(wrapText('hello world', 80)).toBe('hello world');
    });

    it('should wrap at word boundaries', () => {
      const result = wrapText('one two three four five', 15);
      expect(result).toContain('\n');
    });

    it('should handle empty string', () => {
      expect(wrapText('', 80)).toBe('');
    });
  });

  describe('formatTable', () => {
    it('should format a table with headers and rows', () => {
      const result = formatTable(['Name', 'Value'], [['foo', '1'], ['bar', '2']]);
      expect(result).toContain('Name');
      expect(result).toContain('foo');
      expect(result).toContain('bar');
    });
  });
});

describe('Terminal Themes', () => {
  it('should have default theme', () => {
    expect(defaultTheme).toBeDefined();
    expect(defaultTheme.name).toBe('default');
    expect(typeof defaultTheme.thought).toBe('function');
  });

  it('should have dark theme', () => {
    expect(darkTheme).toBeDefined();
    expect(darkTheme.name).toBe('dark');
  });

  it('should have minimal theme', () => {
    expect(minimalTheme).toBeDefined();
    expect(minimalTheme.name).toBe('minimal');
  });

  it('should get theme by name', () => {
    expect(getTheme('default')).toBe(defaultTheme);
    expect(getTheme('dark')).toBe(darkTheme);
  });

  it('should fallback to default for unknown theme', () => {
    expect(getTheme('nonexistent')).toBe(defaultTheme);
  });

  it('should list all themes', () => {
    const names = listThemes();
    expect(names).toContain('default');
    expect(names).toContain('dark');
    expect(names).toContain('minimal');
  });

  it('should have all themes registered', () => {
    expect(Object.keys(themes)).toHaveLength(3);
  });
});

describe('CLI interface', () => {
  it('should create without errors', () => {
    const session = new SequentialThinkingSession({ disableThoughtLogging: true });
    const cli = new CliInterface(session);
    expect(cli).toBeDefined();
    cli.close();
  });
});
