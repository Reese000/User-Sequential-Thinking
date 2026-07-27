// src/exports.ts
//
// Barrel exports for all public APIs.

// Thinking session (core)
export { SequentialThinkingSession } from './thinking/session.js';
export type { ThoughtData, ThoughtResult, McpResponse, SessionOptions } from './thinking/session.js';

// Agents
export { AGENT_SKILLS, findMatchingSkills, getSkillByName, buildSkillPrompt } from './agents/skills.js';
export { HumanRelayAgent } from './agents/human-relay.js';
export type { Skill } from './agents/skills.js';
export type { RelayQuestion, RelayResponse } from './agents/human-relay.js';

// Skills registry
export { SkillsRegistry } from './skills/skills-registry.js';
export type { SkillEntry } from './skills/skills-registry.js';

// MCP server
export { McpServerWrapper } from './mcp/index.js';

// Utils - Config
export { DEFAULT_CONFIG, SEQUENTIAL_THINKING_TOOL, parseArgs, mergeConfig } from './utils/config-schema.js';
export type { ServerConfig, ToolDefinition } from './utils/config-schema.js';

// Utils - JSON Protocol
export { JsonProtocol, JsonRpcError } from './utils/json-protocol.js';
export type { JsonRequest, JsonResponse } from './utils/json-protocol.js';

// Utils - Terminal Themes
export { defaultTheme, darkTheme, minimalTheme, themes, getTheme, listThemes } from './utils/terminal-themes.js';
export type { TerminalTheme } from './utils/terminal-themes.js';

// Utils - Defaults
export * from './utils/defaults.js';

// UI
export { CliInterface } from './ui/cli.js';
export { UI } from './ui/ui.js';
export { LOGO, BANNER, STATUS, sectionHeader, keyValue } from './ui/ascii-art.js';
export { MarkdownRenderer } from './ui/markdown-renderer.js';
export { Spinner } from './ui/spinner.js';
export { formatNumber, formatDuration, truncate, wrapText, formatTable } from './ui/formatting.js';
