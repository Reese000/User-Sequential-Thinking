# Architecture

## Components

1. **Upstream MCP Server**
   - `@modelcontextprotocol/server-sequential-thinking`
   - Exposes one MCP tool: `sequentialthinking`
   - Uses `StdioServerTransport` and local process execution

2. **Local Runtime Wrapper/Entrypoint**
   - Executable path used in this setup: `C:/Progra~1/nodejs/node.exe`
   - Target script: `C:/mcp-tools/server-sequential-thinking/dist/index.js`

3. **Cursor MCP Host Config**
   - Reads from:
     - `~/.cursor/mcp.json`
     - optionally `Desktop/Cursor/.cursor/mcp.json`
     - optionally `%APPDATA%/Cursor/User/globalStorage/mcp.json`

4. **MCP Registry Cache**
   - Cache entries are created under:
     - `~/.cursor/projects/.../mcps/user-user-sequential-thinking/`
   - The registry identifier can become `user-user-sequential-thinking` even though package name is `sequential-thinking`.

## Data Flow

- Cursor launches MCP process from config `command + args`
- Server registers tool schema `sequentialthinking`
- Cursor host maps tools into an internal offer list
- Tool invocation sends JSON-RPC input through MCP over stdio
- Server returns structured thought state and internal thought history metadata

## Runtime Note

The server emits startup logs to stderr:

- `Sequential Thinking MCP Server running on stdio`

This is expected for this implementation.
