// src/utils/json-protocol.ts

/**
 * JSON protocol utilities for MCP message serialization/deserialization.
 */

/** A JSON-RPC style request for MCP */
export interface JsonRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
}

/** A JSON-RPC style response for MCP */
export interface JsonResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

/** Standard JSON-RPC error codes */
export enum JsonRpcError {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

export class JsonProtocol {
  private messageId = 0;

  /**
   * Create a new JSON-RPC request.
   */
  createRequest(method: string, params?: Record<string, unknown>): JsonRequest {
    return {
      jsonrpc: '2.0',
      id: ++this.messageId,
      method,
      params,
    };
  }

  /**
   * Create a success response.
   */
  createResponse(id: number | string, result: unknown): JsonResponse {
    return {
      jsonrpc: '2.0',
      id,
      result,
    };
  }

  /**
   * Create an error response.
   */
  createErrorResponse(
    id: number | string,
    code: JsonRpcError,
    message: string,
    data?: unknown,
  ): JsonResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: { code, message, data },
    };
  }

  /**
   * Safely parse a JSON string into a request.
   * Returns null if parsing fails or the result is not a valid request.
   */
  parseRequest(raw: string): JsonRequest | null {
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === 'object' &&
        parsed.jsonrpc === '2.0' &&
        typeof parsed.method === 'string' &&
        (typeof parsed.id === 'number' || typeof parsed.id === 'string')
      ) {
        return parsed as JsonRequest;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Safely parse a JSON string into a response.
   */
  parseResponse(raw: string): JsonResponse | null {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.jsonrpc === '2.0') {
        return parsed as JsonResponse;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Serialize a request or response to a JSON string with newline terminator.
   */
  serialize(message: JsonRequest | JsonResponse): string {
    return JSON.stringify(message) + '\n';
  }

  /**
   * Get the next message ID (for testing/verification).
   */
  getCurrentMessageId(): number {
    return this.messageId;
  }

  /**
   * Reset message ID counter.
   */
  reset(): void {
    this.messageId = 0;
  }
}
