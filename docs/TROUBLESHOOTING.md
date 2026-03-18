# Troubleshooting

## Symptom: "No tools/prompts/resources"

### Likely causes

- Stale MCP cache entries after config edits
- Server identifier changed (`user-sequential-thinking` vs `user-user-sequential-thinking`)
- Config exists in one Cursor scope but host is reading another file
- `node` path or entrypoint path malformed due spaces

### Fix sequence

1. Validate config in all relevant scopes:
   - `~/.cursor/mcp.json`
   - `Desktop/Cursor/.cursor/mcp.json`
   - `%APPDATA%/Cursor/User/globalStorage/mcp.json`
2. Confirm active identifier by attempting call against currently known IDs.
3. Ensure cache entries are valid and reload host after edits:
   - `~/.cursor/projects/<workspace>/mcps/user-user-sequential-thinking/`
4. Restart Cursor fully (close all windows) and retry.

## Log locations

- Cursor MCP allowlist: `%APPDATA%/Cursor/logs/*/window1/workbench.mcp.allowlist.log`
- User server startup: `%APPDATA%/Cursor/logs/*/window1/exthost/anysphere.cursor-mcp/MCP *.log`

## Command failure examples and correction

- `spawn C:\Users\Reese ENOENT`
  - Fix: avoid unquoted command paths with spaces; use short paths or absolute no-space wrapper.

## Recovery checklist

- Delete stale server cache folder only if config was changed extensively
- Recreate schema in cache folder
- Reload Cursor and re-run a two-step MCP probe call

## Verification Command Template

```powershell
node -e "console.log('manual verify placeholder')"
```

Use this with your host-level preferred probe script.
