# User-Sequential-Thinking MCP

A local, fully documented MCP integration for the Model Context Protocol `sequentialthinking` tool.

## Purpose

This repository documents the locally hosted Sequential Thinking MCP setup used in your current Cursor environment, including:

- Standard install and verification checklist
- MCP configuration templates for user-level and workspace-level setups
- Tool schema and usage examples
- Registry/cache behavior and why the active server identifier can differ from the server name
- Troubleshooting guidance for "no tools/prompts/resources" startup failures

## Server in Use

- Upstream package: `@modelcontextprotocol/server-sequential-thinking`
- Runtime command: `C:/Progra~1/nodejs/node.exe`
- Entrypoint used in examples: `C:/mcp-tools/server-sequential-thinking/dist/index.js`
- Registered MCP tool: `sequentialthinking`
- MCP identifier observed in this environment: `user-user-sequential-thinking`

## Contents

- [Architecture](./docs/ARCHITECTURE.md)
- [Installation](./docs/INSTALLATION.md)
- [Configuration](./docs/CONFIGURATION.md)
- [Usage](./docs/USAGE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Change Log](./docs/CHANGELOG.md)

## Health Check Summary

- MCP server starts successfully using local stdio transport
- Tool registration returns 1 tool under the active server identifier (`user-user-sequential-thinking`)
- A valid call returns structured output containing `thoughtHistoryLength`, `branches`, and final thought state

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
