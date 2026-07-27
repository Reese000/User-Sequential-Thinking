# User-Sequential-Thinking

A local MCP (Model Context Protocol) integration for the `sequentialthinking` tool. Wraps the upstream `@modelcontextprotocol/server-sequential-thinking` with session management, agent skills, and terminal UI.

## Purpose

This MCP server provides a structured, reflective problem-solving tool for AI agents. It implements the sequential thinking protocol with:

- **Session management** — Thought history, branching, export/import
- **Agent skills** — Pre-built skill prompts (code review, debug, design, research, test) that guide the thinking process
- **Human relay** — Handoff points for human judgment when the thinking process reaches ambiguity
- **Terminal UI** — Interactive CLI, markdown rendering, spinner, ASCII art, formatting utilities
- **MCP transport** — Stdio-based MCP server compatible with any MCP host (Claude Desktop, etc.)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥20 |
| Language | TypeScript (ES2022, ESM, NodeNext) |
| MCP SDK | `@modelcontextprotocol/sdk` ^1.27.1 |
| CLI | `yargs` ^17.7.2, `chalk` ^5.3.0 |
| Testing | Vitest ^3.0.0 |
| Format | ESM-only (`"type": "module"`) |

## Architecture

```
src/
├── index.ts              — Entry point, public API exports
├── exports.ts            — Barrel exports
├── agents/
│   ├── skills.ts         — Pre-built skill prompts + matcher
│   └── human-relay.ts    — Human handoff agent
├── mcp/
│   └── index.ts          — MCP server wrapper (stdio transport)
├── skills/
│   └── skills-registry.ts — Runtime skill registry
├── thinking/
│   └── session.ts        — Core thought session management
├── ui/
│   ├── cli.ts            — Interactive CLI
│   ├── ui.ts             — Base UI
│   ├── formatting.ts     — Number/string/table formatting
│   ├── spinner.ts        — Terminal spinner
│   ├── markdown-renderer.ts — Terminal markdown rendering
│   └── ascii-art.ts      — ASCII art/logo/section headers
└── utils/
    ├── config-schema.ts   — Server config, tool definition, CLI args
    ├── json-protocol.ts   — JSON-RPC protocol helpers
    ├── terminal-themes.ts — Color themes (default, dark, minimal)
    └── defaults.ts        — Default values
```

## Setup

```bash
npm install
```

## Usage

### As an MCP server (stdio transport)

```bash
npm run build
npm start        # Starts the MCP server on stdio
```

Configure in your MCP host (e.g., Claude Desktop `mcp_servers.json`):

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "node",
      "args": ["path/to/user-sequential-thinking/dist/index.js"]
    }
  }
}
```

### Interactive CLI

```typescript
import { SequentialThinkingSession, CliInterface } from 'user-sequential-thinking';

const session = new SequentialThinkingSession();
const cli = new CliInterface(session);
cli.start();
```

### As a library

```typescript
import { SequentialThinkingSession } from 'user-sequential-thinking';

const session = new SequentialThinkingSession();
const result = session.processThought({
  thought: 'Analyzing the problem...',
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true,
});
console.log(result);
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Watch mode tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | TypeScript type check (no emit) |
| `npm start` | Run compiled MCP server |

## Status

**Functional.** Core session management (thought validation, history, branching, export/import) is complete and tested. The MCP server wrapper runs on stdio. The interactive CLI supports all core commands (`/history`, `/branches`, `/export`, `/reset`, `/quit`). Agent skills registry and human relay agent are implemented with full test coverage.

Tests pass: ~33 test cases across session management, agent skills, human relay, markdown renderer, spinner, formatting utilities, terminal themes, and CLI.

## License

MIT
