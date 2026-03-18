# Changelog

## [2026-03-18] Improve Operations Without New Tools

- Added maintenance scripts to perform read-only checks and repair steps for config and cache consistency (`scripts/maintain-sequential-thinking.ps1`).
- Added deterministic MCP probe utility (`scripts/mcp-probe.mjs`) to validate that `sequentialthinking` is registered.
- Added `DISABLE_THOUGHT_LOGGING=true` in canonical config examples for quieter wrapper-host usage.
- Updated documentation to include repair-driven workflows in installation, usage, configuration, and troubleshooting.

## [Unreleased]

- Initial repository creation for local Sequential Thinking MCP documentation.
- Added architecture and runtime setup docs.
- Documented registration identifier (`user-user-sequential-thinking`) and cache behavior.
- Added practical troubleshooting steps based on observed startup logs.

## [2026-03-18] Local Docs Baseline

- Added full documentation package under `docs/`.
- Documented startup verification with concrete command and payload examples.
- Included minimal installation, configuration, and troubleshooting sections.
