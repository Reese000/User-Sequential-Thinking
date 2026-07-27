// src/mcp/index.ts

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { SequentialThinkingSession } from '../thinking/session.js';
import { SEQUENTIAL_THINKING_TOOL, type ServerConfig, DEFAULT_CONFIG } from '../utils/config-schema.js';

/**
 * MCP Server wrapper that bridges the SequentialThinkingSession
 * with the Model Context Protocol transport layer.
 */
export class McpServerWrapper {
  private server: Server;
  private session: SequentialThinkingSession;
  private config: ServerConfig;

  constructor(config: Partial<ServerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    this.session = new SequentialThinkingSession({
      disableThoughtLogging: this.config.disableThoughtLogging,
      maxHistorySize: this.config.maxHistorySize,
    });

    this.server = new Server(
      {
        name: this.config.name,
        version: this.config.version,
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.registerHandlers();
  }

  /**
   * Register MCP request handlers.
   */
  private registerHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [SEQUENTIAL_THINKING_TOOL],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
      if (request.params.name === 'sequentialthinking') {
        const result = this.session.processThought(
          request.params.arguments as Record<string, unknown>,
        );
        return {
          content: result.content,
          isError: result.isError,
        } satisfies CallToolResult;
      }
      return {
        content: [{ type: 'text' as const, text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      } satisfies CallToolResult;
    });
  }

  /**
   * Connect to the stdio transport and start listening.
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    if (this.config.debug) {
      console.error(`${this.config.name} v${this.config.version} running on stdio`);
    }
  }

  /**
   * Get the underlying session (for testing/inspection).
   */
  getSession(): SequentialThinkingSession {
    return this.session;
  }

  /**
   * Get the server config.
   */
  getConfig(): ServerConfig {
    return { ...this.config };
  }
}
