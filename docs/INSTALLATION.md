# Installation

## Prerequisites

- Windows 10/11
- Node.js installed at either:
  - `C:/Program Files/nodejs/node.exe` (or short path `C:/Progra~1/nodejs/node.exe`)
- MCP package available locally:
  - `C:/Users/Reese Chang/AppData/Roaming/npm/node_modules/@modelcontextprotocol/server-sequential-thinking`

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

## Keep Runtime Offline-Predictable

- Prefer explicit local paths for command and args
- Avoid relative paths in MCP json
- Avoid command aliases that include spaces unless quoted and tested

## Optional wrapper path

A local wrapper file can still be used if preferred:

- `C:/mcp-tools/mcp-server-sequential-thinking.cmd`

Its contents:

```bat
@echo off
"C:\Program Files\nodejs\node.exe" "C:\Users\Reese Chang\AppData\Roaming\npm\node_modules\@modelcontextprotocol\server-sequential-thinking\dist\index.js" %*
```
