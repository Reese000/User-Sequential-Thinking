# Troubleshooting

## Symptom: "No tools/prompts/resources"

### Likely causes

- Stale MCP cache entries after config edits
- Server identifier changed (`user-sequential-thinking` vs `user-user-sequential-thinking`)
- Config exists in one Cursor scope but host is reading another file
- `node` path or entrypoint path malformed due spaces

### Repair-first sequence

1. Validate config paths and cache status:

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode check
```

2. If check reports inconsistencies, apply repair:

```powershell
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode repair
```

3. Restart Cursor fully (close all windows) and retry host-level actions.
4. Run the direct probe after repair:

```powershell
node .\scripts\mcp-probe.mjs 'C:/mcp-tools/server-sequential-thinking/dist/index.js' 'C:/Progra~1/nodejs/node.exe' 12000
```

5. If still unresolved, review config scope precedence:
   - `~/.cursor/mcp.json`
   - `Desktop/Cursor/.cursor/mcp.json`
   - `%APPDATA%/Cursor/User/globalStorage/mcp.json`

## Log locations

- Cursor MCP allowlist: `%APPDATA%/Cursor/logs/*/window1/workbench.mcp.allowlist.log`
- User server startup: `%APPDATA%/Cursor/logs/*/window1/exthost/anysphere.cursor-mcp/MCP *.log`

## Command failure examples and correction

- `spawn C:\Users\Reese ENOENT`
  - Fix: avoid unquoted command paths with spaces; use short paths or absolute no-space wrapper.

## Recovery checklist

- Delete stale server cache folder only if config was changed extensively
- Recreate schema in cache folder using `-Mode repair`
- Confirm probe output shows `status: "ok"` and `hasSequentialThinking: true`

## Expected probe result

```json
{
  "status": "ok",
  "hasSequentialThinking": true
}
```

