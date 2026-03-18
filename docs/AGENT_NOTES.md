# Agent Notes (internal use)

## Last Verified Context

- MCP service now enumerates this server under `user-user-sequential-thinking` in this environment.
- Active tool name: `sequentialthinking`.
- A startup call returns valid structured output:
  `thoughtHistoryLength`, `branches`, `thoughtNumber`, `totalThoughts`, `nextThoughtNeeded`.

## Safety and Governance

- This documentation is non-destructive and environment-specific.
- Keep secrets out of docs and cache files.
- Avoid hardcoding API tokens in MCP JSON.
