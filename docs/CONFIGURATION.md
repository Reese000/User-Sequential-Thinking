# Configuration

## Recommended `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "user-user-sequential-thinking": {
      "command": "C:/Progra~1/nodejs/node.exe",
      "args": [
        "C:/mcp-tools/server-sequential-thinking/dist/index.js"
      ],
      "env": {
        "DISABLE_THOUGHT_LOGGING": "true"
      }
    },
    "critic": {
      "command": "node",
      "args": [
        "C:/Users/Reese Chang/Desktop/Critic-MCP/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

### Scope precedence

Cursor reads MCP JSON from multiple scopes, and behavior is based on effective merged config in the current process:

- `~/.cursor/mcp.json`
- `Desktop/Cursor/.cursor/mcp.json`
- `%APPDATA%/Cursor/User/globalStorage/mcp.json`

Run `pwsh .\scripts\maintain-sequential-thinking.ps1 -Mode check` to print a status summary for all scopes in the environment.

## MCP Cache Folder Snapshot (this environment)

Active MCP cache folder observed:

- `C:/Users/Reese Chang/.cursor/projects/c-Users-Reese-Chang-Desktop-AI/mcps/user-user-sequential-thinking/`

Required files:

- `SERVER_METADATA.json`
- `tools/sequentialthinking.json`

### `SERVER_METADATA.json`

```json
{
  "serverIdentifier": "user-user-sequential-thinking",
  "serverName": "user-user-sequential-thinking"
}
```

### Tool Schema (summary)

```json
{
  "name": "sequentialthinking",
  "title": "Sequential Thinking",
  "arguments": {
    "thought": { "type": "string" },
    "nextThoughtNeeded": { "type": "boolean" },
    "thoughtNumber": { "type": "integer", "minimum": 1 },
    "totalThoughts": { "type": "integer", "minimum": 1 },
    "isRevision": { "type": "boolean" },
    "revisesThought": { "type": "integer", "minimum": 1 },
    "branchFromThought": { "type": "integer", "minimum": 1 },
    "branchId": { "type": "string" },
    "needsMoreThoughts": { "type": "boolean" }
  },
  "required": ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
}
```

## Why `user-user-sequential-thinking` Appears

- Cursor can store the same server under an internal prefix in the allowlist/cache layer.
- Tool access should target the active registered server identifier.
- In this workspace, that identifier is `user-user-sequential-thinking`.
