# Installation

## Prerequisites

- Windows 10/11
- Node.js installed at either:
  - `C:/Program Files/nodejs/node.exe` (or short path `C:/Progra~1/nodejs/node.exe`)
- MCP package available locally:
  - `C:/Users/Reese Chang/AppData/Roaming/npm/node_modules/@modelcontextprotocol/server-sequential-thinking`
- PowerShell 7+ (`pwsh`) recommended for script execution

## Install Package Locally

```powershell
npm install -g @modelcontextprotocol/server-sequential-thinking@2025.12.18
```

## Create a no-space command path copy (optional but recommended)

Option A (current): call node directly with full path to `dist/index.js`.

```powershell
$node='C:/Progra~1/nodejs/node.exe'
$entry='C:/mcp-tools/server-sequential-thinking/dist/index.js'
```

Option B (optional): keep a stable wrapper script:

- `C:/mcp-tools/mcp-server-sequential-thinking.cmd`

## Repository maintenance scripts

After installation, run the check command to confirm a valid local configuration and cache state.

```powershell
cd 'C:/Users/Reese Chang/Desktop/AI/User-Sequential-Thinking'
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode check
```

If check indicates missing paths, missing cache descriptors, or stale entries, run:

```powershell
powershell .\scripts\maintain-sequential-thinking.ps1 -Mode repair
```

## Recommended runtime behavior

- Prefer explicit local paths for command and args
- Avoid relative paths in MCP json
- Keep runtime entries deterministic by using explicit `Progra~1` node path and copied dist path without spaces

