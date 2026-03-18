# Usage

## Minimal Health Check

1. Confirm server process can start:

```powershell
& 'C:/Progra~1/nodejs/node.exe' 'C:/mcp-tools/server-sequential-thinking/dist/index.js'
```

Expected: process prints `Sequential Thinking MCP Server running on stdio`.

2. Confirm MCP host tool availability with your environment call and current active identifier:

```text
server: user-user-sequential-thinking
tool: sequentialthinking
```

## Maintenance commands

### Read-only audit

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode check
```

### Apply standard repair actions

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode repair
```

### Protocol-level probe only

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
node .\scripts\mcp-probe.mjs 'C:/mcp-tools/server-sequential-thinking/dist/index.js' 'C:/Progra~1/nodejs/node.exe'
```

Expected result when tool is available:

```json
{
  "status": "ok",
  "totalTools": 1,
  "hasSequentialThinking": true,
  "availableTools": [
    {
      "name": "sequentialthinking",
      "description": "A structured reflective reasoning tool for complex multi-step problem solving."
    }
  ]
}
```

## Example MCP call payload

```json
{
  "thought": "Validate startup path and tool availability.",
  "nextThoughtNeeded": false,
  "thoughtNumber": 1,
  "totalThoughts": 1
}
```

## Expected structured response (shape)

```json
{
  "thoughtNumber": 1,
  "totalThoughts": 1,
  "nextThoughtNeeded": false,
  "branches": [],
  "thoughtHistoryLength": 1
}
```

## Branching/Revision Use Cases

- `isRevision: true` with `revisesThought` to revise prior reasoning
- `branchFromThought` + `branchId` for divergent paths
- Keep `nextThoughtNeeded` true until the reasoning chain is complete

## Operational Guidance

- Keep logs/stderr clean; avoid noisy stdout in production when using wrappers
- If call fails, verify:
  - MCP config still points to valid local path
  - Cache folder exists and is not stale
  - Server identifier used in calls matches current registry

