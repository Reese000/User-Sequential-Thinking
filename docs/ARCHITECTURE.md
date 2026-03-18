# Architecture

## Components

1. **Upstream MCP Server**
   - `@modelcontextprotocol/server-sequential-thinking`
   - Exposes one MCP tool: `sequentialthinking`
   - Uses `StdioServerTransport` and local process execution

2. **Local Runtime Wrapper/Entrypoint**
   - Executable path used in this setup: `C:/Progra~1/nodejs/node.exe`
   - Target script: `C:/mcp-tools/server-sequential-thinking/dist/index.js`
   - Optional wrapper: `C:/mcp-tools/mcp-server-sequential-thinking.cmd`

3. **Cursor MCP Host Config**
   - Reads from:
     - `~/.cursor/mcp.json`
     - `Desktop/Cursor/.cursor/mcp.json`
     - `%APPDATA%/Cursor/User/globalStorage/mcp.json`

4. **Registry Cache**
   - Cache entries are created under:
     - `~/.cursor/projects/.../mcps/user-user-sequential-thinking/`
   - Registry identifier can become `user-user-sequential-thinking` even though package name is `sequential-thinking`.

5. **Maintenance Scripts**
   - `scripts/maintain-sequential-thinking.ps1`
     - Checks/repairs config entries and cache descriptors
   - `scripts/mcp-probe.mjs`
     - Verifies tool availability with protocol-level initialize + tools/list

## Data Flow

- Cursor launches MCP process from config `command + args`
- Server registers tool schema `sequentialthinking`
- Optional maintenance script inspects/repairs MCP cache folder `SERVER_METADATA.json` and `tools/sequentialthinking.json`
- Optional probe performs initialize and tools/list over stdio to confirm registry
- MCP call sends JSON-RPC input through MCP transport and returns structured thought history metadata

## Runtime Note

The server emits startup logs to stderr:

- `Sequential Thinking MCP Server running on stdio`

This is expected for this implementation.
