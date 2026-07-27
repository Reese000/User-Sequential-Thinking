# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A local MCP (Model Context Protocol) integration for the `sequentialthinking` tool. Wraps the upstream `@modelcontextprotocol/server-sequential-thinking` with session management, agent skills, and terminal UI.

## Architecture

- `src/thinking/` — Core session management and thinking logic
- `src/agents/` — Skills and human relay agent
- `src/ui/` — CLI interface, ASCII art, markdown rendering, spinners
- `src/utils/` — Config schemas, JSON protocol, terminal themes, defaults
- `src/skills/` — Skills registry
- `src/mcp/` — MCP server integration
- `test/` — Vitest test suite

## Build & Test

```bash
npm install
npm run build    # Compile TypeScript
npm test         # Run vitest
npm run test:watch  # Watch mode
```

## Key Technical Decisions

- TypeScript with ES2022 target, NodeNext module resolution
- ESM-only (`"type": "module"`)
- Vitest for testing
- chalk for terminal colors (ESM-compatible)
- All imports use `.js` extension suffix (NodeNext requirement)
