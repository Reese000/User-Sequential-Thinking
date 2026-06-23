# User-Sequential-Thinking MCP

A local, fully documented MCP integration for the Model Context Protocol `sequentialthinking` tool.

## Purpose

This repository documents and supports the locally hosted Sequential Thinking MCP setup used in your current Cursor environment, including:

- Standard install and verification checklist
- Deterministic probe and repair scripts
- MCP configuration templates for user-level and workspace-level setups
- Tool schema and usage examples
- Registry/cache behavior and why the active server identifier can differ from the package name
- Troubleshooting guidance for "no tools/prompts/resources" startup failures

## Server in Use

- Upstream package: `@modelcontextprotocol/server-sequential-thinking`
- Runtime command: `C:/Progra~1/nodejs/node.exe`
- Entrypoint used in examples: `C:/mcp-tools/server-sequential-thinking/dist/index.js`
- Registered MCP tool: `sequentialthinking`
- MCP identifier observed in this environment: `user-user-sequential-thinking`

## Repository Contents

- [Architecture](./docs/ARCHITECTURE.md)
- [Installation](./docs/INSTALLATION.md)
- [Configuration](./docs/CONFIGURATION.md)
- [Usage](./docs/USAGE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Change Log](./docs/CHANGELOG.md)
- [Maintenance Scripts](./scripts)

## New Operational Scripts

- `scripts/maintain-sequential-thinking.ps1`:
  - `-Mode check` (default): validates config files, cache paths, and discovery candidates.
  - `-Mode repair`: updates config/cache entries and regenerates cache descriptors.
- `scripts/mcp-probe.mjs`:
  - Runs a protocol-level MCP initialize + tools/list probe to prove the tool registry includes `sequentialthinking`.

### Quick check (read-only)

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode check
```

### Apply repair actions

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode repair
```

### Direct probe validation

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
node .\scripts\mcp-probe.mjs 'C:/mcp-tools/server-sequential-thinking/dist/index.js' 'C:/Progra~1/nodejs/node.exe' 12000
```

## Health Check Summary

- MCP server starts successfully using local stdio transport
- Tool registration can return the `sequentialthinking` tool without adding new MCP tools
- A valid call returns structured output with `thoughtHistoryLength`, `branches`, and final thought state

## Repository Convention (Critic-style Formatting)

Use a strict status-first response format when updating this repo or submitting changes:

- `[STATUS]` = current outcome (`DONE`, `BLOCKED`, etc.)
- `[VIOLATIONS]` = issues discovered
- `[CRITIQUE]` = explanation of what is/was wrong
- `[REQUIRED ACTION]` = corrective steps

## Citation Context

This repo captures runtime-local integration details only; the upstream npm package remains unchanged.

## License

MIT-0 style permissive documentation intent for internal/Team use.

