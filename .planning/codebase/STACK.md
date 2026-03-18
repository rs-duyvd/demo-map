# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- JavaScript (Node.js) - GSD framework hooks and CLI tools
- Markdown - Configuration, templates, documentation

**Secondary:**
- JSON - Configuration and manifest files

## Runtime

**Environment:**
- Node.js (version not explicitly specified, supports CommonJS)

**Package Manager:**
- npm (inferred from `.claude/package.json`)
- Lockfile: Not present

## Frameworks

**Core:**
- Get Shit Done (GSD) - v1.25.1 - Project management and workflow framework for Claude Code
  - Location: `.claude/get-shit-done/`
  - Purpose: Provides structured workflows, templates, and CLI tooling for organizing development phases and milestones

**Build/Dev:**
- No build system detected
- Node.js CommonJS modules used directly

## Key Dependencies

**Critical:**
- Node.js built-in modules (`fs`, `path`, `os`) - Used for file system operations in hooks

**Infrastructure:**
- No external npm dependencies detected

## Configuration

**Environment:**
- Uses environment variable: `CLAUDE_CONFIG_DIR` - Optional custom configuration directory for Claude Code
- Default config location: `~/.claude/`

**Build:**
- No build configuration present
- Simple Node.js script execution via `.claude/hooks/`

## Platform Requirements

**Development:**
- Node.js runtime
- Claude Code IDE (Anthropic's AI code editor)
- Git for version control

**Production:**
- Not applicable - this is a framework/tooling repository

## Framework Components

**GSD Framework Structure:**
- `.claude/get-shit-done/bin/` - CLI executable and core modules in CommonJS format
- `.claude/get-shit-done/templates/` - Markdown templates for phases, milestones, and planning
- `.claude/get-shit-done/workflows/` - Predefined workflow markdown files
- `.claude/get-shit-done/references/` - Documentation and reference guides
- `.claude/hooks/` - Integration hooks for Claude Code:
  - `gsd-statusline.js` - Status bar integration showing model, task, context usage
  - `gsd-check-update.js` - Update checking for GSD framework
  - `gsd-context-monitor.js` - Context window monitoring and warnings

**CLI Tools:**
- `gsd-tools.cjs` - Main command-line interface
- Subcommands via modular lib files:
  - `commands.cjs` - Command routing
  - `core.cjs` - Core functionality
  - `phase.cjs` - Phase management
  - `milestone.cjs` - Milestone operations
  - `roadmap.cjs` - Roadmap planning
  - `state.cjs` - State management
  - `template.cjs` - Template processing
  - And others for configuration, verification, frontmatter handling

## Data Storage

**Databases:**
- None (framework only)

**File Storage:**
- Local filesystem only - Stores:
  - Markdown documents in `.planning/` directory
  - GSD state in `.claude/` directory
  - Temporary context bridge files in system temp directory

**Caching:**
- GSD update check cache: `~/.claude/cache/gsd-update-check.json`
- Context window metrics bridge: OS temp directory (`/tmp/claude-ctx-{session_id}.json`)

## Configuration Patterns

**Manifest File:**
- `.claude/gsd-file-manifest.json` - Integrity check manifest with SHA256 hashes for all GSD files

**Settings:**
- `.claude/settings.json` - Defines hooks integration with Claude Code:
  - `SessionStart` hook - Runs GSD update check
  - `PostToolUse` hook - Runs context monitoring
  - Status line integration for IDE display

**Package File:**
- `.claude/package.json` - Minimal, specifies `"type": "commonjs"`

---

*Stack analysis: 2026-03-18*
