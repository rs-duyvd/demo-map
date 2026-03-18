# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
.claude/
├── get-shit-done/              # GSD framework (v1.25.1)
│   ├── bin/
│   │   ├── gsd-tools.cjs       # Main CLI entry point (100+ commands)
│   │   └── lib/
│   │       ├── commands.cjs     # Atomic operations (slug, timestamp, todos, history)
│   │       ├── phase.cjs        # Phase CRUD and lifecycle operations
│   │       ├── state.cjs        # STATE.md management and progression
│   │       ├── roadmap.cjs      # ROADMAP.md parsing and updates
│   │       ├── milestone.cjs    # Milestone archival and versioning
│   │       ├── template.cjs     # Template selection and frontmatter filling
│   │       ├── verify.cjs       # Verification suite for structure and commits
│   │       ├── config.cjs       # Configuration initialization and management
│   │       ├── init.cjs         # Project scaffolding and setup
│   │       ├── core.cjs         # Shared utilities (path, file, git, config loading)
│   │       ├── frontmatter.cjs  # YAML frontmatter extraction and validation
│   │       └── model-profiles.cjs # Model mapping for executor/planner/researcher
│   ├── workflows/              # Workflow markdown files defining command behavior
│   │   ├── plan-phase.md       # Phase planning workflow
│   │   ├── execute-phase.md    # Phase execution workflow
│   │   ├── verify-phase.md     # Phase verification workflow
│   │   ├── map-codebase.md     # Codebase analysis workflow
│   │   ├── add-phase.md        # Phase creation workflow
│   │   └── [~30+ others]       # Complete workflow definitions for all /gsd: commands
│   ├── templates/              # Markdown templates for documents
│   │   ├── state.md            # STATE.md template
│   │   ├── phase-prompt.md     # Phase execution prompt template
│   │   ├── summary-standard.md # Standard SUMMARY.md template
│   │   ├── summary-minimal.md  # Minimal SUMMARY.md template
│   │   ├── summary-complex.md  # Complex SUMMARY.md template
│   │   ├── UAT.md              # User acceptance test template
│   │   ├── milestone.md        # Milestone document template
│   │   ├── codebase/
│   │   │   ├── architecture.md # Codebase architecture template
│   │   │   ├── structure.md    # Codebase structure template
│   │   │   ├── stack.md        # Technology stack template
│   │   │   ├── conventions.md  # Coding conventions template
│   │   │   ├── testing.md      # Testing patterns template
│   │   │   ├── integrations.md # External integrations template
│   │   │   └── concerns.md     # Technical concerns template
│   │   └── [others: research, retrospective, UAT, etc.]
│   ├── references/             # Reference documentation for developers
│   │   ├── model-profiles.md   # Model selection strategy
│   │   ├── phase-argument-parsing.md # Phase number format handling
│   │   ├── decimal-phase-calculation.md # Phase numbering algorithm
│   │   ├── planning-config.md  # Configuration schema reference
│   │   └── [others: git integration, TDD, verification patterns]
│   └── bin/lib/                # CommonJS modules (no TypeScript transpilation)
├── hooks/                      # IDE integration entry points
│   ├── gsd-statusline.js      # Render IDE status bar with context usage
│   ├── gsd-check-update.js    # Check for framework updates on session start
│   └── gsd-context-monitor.js # Monitor context window, emit warnings
├── commands/                   # Individual command implementations (scaffolding)
├── agents/                     # Agent-specific implementation scaffolds
├── settings.json               # Claude Code hook configuration
├── package.json                # Minimal Node.js package metadata (CommonJS)
└── gsd-file-manifest.json      # Integrity check manifest (SHA256 hashes)
```

## Directory Purposes

**`.claude/get-shit-done/bin/`:**
- Purpose: Executable code and modular library
- Contains: CommonJS modules (.cjs extension for Node.js + Git Bash compatibility)
- Key files: `gsd-tools.cjs` is the single entry point, lib/ contains functional domains

**`.claude/get-shit-done/bin/lib/`:**
- Purpose: Domain-specific functionality organized by concern
- Contains: Phase management, state management, verification, templating, configuration
- Key insight: Each file is a module exporting 2-4 named command functions (e.g., `cmdPhaseAdd`, `cmdPhasesList`)
- Import pattern: Core utilities imported once per module, dependencies explicit via `require()`

**`.claude/get-shit-done/workflows/`:**
- Purpose: Document workflow logic and prompts for each /gsd: command
- Contains: Markdown files defining agent responsibilities, input expectations, output format
- Naming: `{command-name}.md` (e.g., `execute-phase.md`, `map-codebase.md`)
- Not executable — reference documentation for orchestrator behavior

**`.claude/get-shit-done/templates/`:**
- Purpose: Content templates for user-created documents
- Contains: Markdown boilerplate for plans, summaries, state, milestones
- Subdirectory `codebase/`: Templates for architecture/testing/stack analysis (mirrors document names)
- Pattern: Frontmatter with required fields + markdown body with sections

**`.claude/get-shit-done/references/`:**
- Purpose: Developer reference guides for implementation details
- Contains: Algorithm descriptions, schema definitions, pattern explanations
- Examples: `decimal-phase-calculation.md`, `model-profiles.md`, `planning-config.md`

**`.claude/hooks/`:**
- Purpose: Node.js scripts invoked by Claude Code IDE lifecycle
- Contains: Statusline rendering, update checking, context monitoring
- Entry: Each file is standalone executable (#!/usr/bin/env node)
- Integration: Configured in `settings.json` with hook type and command

**`.claude/settings.json`:**
- Purpose: Declare IDE integration points
- Contains: Hook definitions (SessionStart, PostToolUse), statusline command
- Format: JSON with nested hook arrays and command specifications

## Key File Locations

**Entry Points:**
- ``.claude/get-shit-done/bin/gsd-tools.cjs` - Main CLI, routes all commands
- `.claude/hooks/gsd-statusline.js` - IDE status bar renderer
- `.claude/hooks/gsd-check-update.js` - Update checker (SessionStart hook)
- `.claude/hooks/gsd-context-monitor.js` - Context monitor (PostToolUse hook)

**Configuration:**
- `.claude/settings.json` - IDE hook definitions
- `.claude/package.json` - CommonJS type declaration
- `.claude/gsd-file-manifest.json` - File integrity manifest with SHA256

**Core Logic by Domain:**
- Phase operations: `.claude/get-shit-done/bin/lib/phase.cjs` (911 lines)
- Verification suite: `.claude/get-shit-done/bin/lib/verify.cjs` (842 lines)
- Project initialization: `.claude/get-shit-done/bin/lib/init.cjs` (782 lines)
- State management: `.claude/get-shit-done/bin/lib/state.cjs` (723 lines)
- Atomic commands: `.claude/get-shit-done/bin/lib/commands.cjs` (709 lines)

**Utilities:**
- Shared functions: `.claude/get-shit-done/bin/lib/core.cjs` (497 lines)
- Frontmatter parsing: `.claude/get-shit-done/bin/lib/frontmatter.cjs` (299 lines)
- Model resolution: `.claude/get-shit-done/bin/lib/model-profiles.cjs` (68 lines)

## Naming Conventions

**Files:**
- Commands: `gsd-tools.cjs` (entry point), `lib/{domain}.cjs` (domain modules)
- Hooks: `gsd-{hook-name}.js` (e.g., gsd-statusline.js)
- Workflows: `{command-name}.md` without /gsd: prefix (e.g., `plan-phase.md`)
- Templates: `{doc-type}.md` or `{doc-type}-{variant}.md` (e.g., `summary-minimal.md`)

**Directories:**
- Framework root: `.claude/get-shit-done/` (matches npm package structure)
- Executable code: `bin/` (convention for CLI tools)
- Modules: `lib/` (convention for CommonJS libraries)
- Markdown resources: `templates/`, `workflows/`, `references/`
- IDE integration: `hooks/` (one level up, not in get-shit-done/)

**Functions:**
- Command handlers: `cmd{Domain}{Action}` pattern (e.g., `cmdPhaseAdd`, `cmdStateLoad`, `cmdVerifyPlanStructure`)
- Helpers: Descriptive names without cmd prefix (e.g., `safeReadFile()`, `loadConfig()`, `normalizePhaseName()`)
- Exports: Each module exports only the command functions it implements

## Where to Add New Code

**New CLI Command:**
1. Create command function in appropriate lib file or new lib/{domain}.cjs
2. Function signature: `function cmd{Name}(cwd, args, raw) { ... }`
3. Must call `output(result, raw, rawValue)` to return (calls process.exit)
4. Add command routing in `gsd-tools.cjs` main switch/dispatch
5. Create workflow markdown at `.claude/get-shit-done/workflows/{command-name}.md`
6. Document in gsd-tools.cjs header comments (lines 4-100)

**New Domain Module:**
1. Create `.claude/get-shit-done/bin/lib/{domain}.cjs`
2. Require shared utilities at top: `const { output, error, loadConfig, ... } = require('./core.cjs')`
3. Import parsers as needed: `const { extractFrontmatter } = require('./frontmatter.cjs')`
4. Implement command functions: `function cmd{Domain}{Action}(cwd, args, raw) { ... }`
5. At end: `module.exports = { cmd{Domain}{Action}, ... }`
6. Update gsd-tools.cjs to import: `const { cmd... } = require('./lib/{domain}.cjs')`

**New IDE Hook:**
1. Create `.claude/hooks/gsd-{name}.js` with #!/usr/bin/env node shebang
2. Read stdin if needed: `process.stdin.on('data', chunk => { ... })`
3. Implement hook logic
4. Register in `.claude/settings.json` under hooks.{HookType}
5. Command: `node .claude/hooks/gsd-{name}.js`

**Workflow/Template:**
1. Markdown file at `.claude/get-shit-done/workflows/{command}.md` or `.claude/get-shit-done/templates/{type}.md`
2. Not executable — reference documentation
3. Follow existing formatting and structure
4. For codebase templates: place in `.claude/get-shit-done/templates/codebase/`

**Shared Utilities:**
1. Add to `.claude/get-shit-done/bin/lib/core.cjs` if used by multiple modules
2. Export at end of file
3. Import pattern: `const { helperName } = require('./core.cjs')`

## Special Directories

**`.planning/`:**
- Purpose: User project planning documents and state
- Generated: Automatically by `init` and phase commands
- Committed: No — added to .gitignore in new projects
- Structure: `phases/{N-phase-name}/`, `ROADMAP.md`, `STATE.md`, `config.json`, `todos/`, `codebase/`

**`.claude/cache/`:**
- Purpose: Cached data (update check results)
- Generated: By gsd-check-update.js hook on SessionStart
- Committed: No — transient, should be in .gitignore
- Contents: `gsd-update-check.json` with version info and cache timestamp

**`.claude/todos/`:**
- Purpose: Track action items between sessions (Claude Code integration)
- Generated: By Claude Code IDE when using todo system
- Committed: No — session-specific
- Structure: `{session_id}-agent-{id}.json` files with todo arrays

**`/tmp/` (OS temp):**
- Purpose: Temporary data exchange between IDE hooks and CLI
- Generated: By gsd-statusline.js writing context metrics
- Format: `claude-ctx-{session_id}.json` with context usage data
- Lifetime: Per-session, cleaned up on IDE exit

## Module Dependency Graph

```
gsd-tools.cjs (entry point)
  ├─→ commands.cjs
  │    ├─→ core.cjs
  │    └─→ frontmatter.cjs
  ├─→ phase.cjs
  │    ├─→ core.cjs
  │    ├─→ frontmatter.cjs
  │    └─→ state.cjs
  ├─→ state.cjs
  │    ├─→ core.cjs
  │    └─→ frontmatter.cjs
  ├─→ roadmap.cjs
  │    ├─→ core.cjs
  │    └─→ frontmatter.cjs
  ├─→ verify.cjs
  │    ├─→ core.cjs
  │    └─→ frontmatter.cjs
  ├─→ template.cjs
  │    ├─→ core.cjs
  │    └─→ frontmatter.cjs
  ├─→ milestone.cjs
  │    ├─→ core.cjs
  │    └─→ state.cjs
  ├─→ init.cjs
  │    ├─→ core.cjs
  │    ├─→ phase.cjs
  │    └─→ frontmatter.cjs
  ├─→ config.cjs
  │    └─→ core.cjs
  └─→ model-profiles.cjs (no dependencies)

Hooks (independent executables):
  ├─→ gsd-statusline.js
  │    ├─→ core (via filesystem calls)
  │    └─→ Node.js stdlib
  ├─→ gsd-check-update.js
  └─→ gsd-context-monitor.js
```

---

*Structure analysis: 2026-03-18*
