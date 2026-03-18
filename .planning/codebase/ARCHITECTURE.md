# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Modular CLI-driven state machine with IDE integration hooks

**Key Characteristics:**
- Command-based architecture routing through `.claude/get-shit-done/bin/gsd-tools.cjs`
- Functional decomposition into domain-specific modules (phase, state, roadmap, milestone, template, verify)
- File-based state management using Markdown documents with YAML frontmatter
- Lifecycle hook integration with Claude Code IDE for context awareness and update checking
- No database layer — all state persisted to filesystem in `.planning/` directory

## Layers

**CLI Entry Layer:**
- Purpose: Parse command arguments and route to appropriate handler
- Location: `.claude/get-shit-done/bin/gsd-tools.cjs` (main entry point)
- Contains: Command parsing, error handling, output formatting
- Depends on: Commands, core utilities, domain modules
- Used by: Direct CLI invocation, IDE hooks

**Command/Domain Layer:**
- Purpose: Implement feature-specific operations (phase CRUD, state transitions, roadmap analysis, etc.)
- Locations:
  - `.claude/get-shit-done/bin/lib/commands.cjs` — Atomic operations (slug generation, todo listing, history aggregation)
  - `.claude/get-shit-done/bin/lib/phase.cjs` — Phase lifecycle (create, list, remove, complete, decimal calculation)
  - `.claude/get-shit-done/bin/lib/state.cjs` — STATE.md operations and progression
  - `.claude/get-shit-done/bin/lib/roadmap.cjs` — ROADMAP.md parsing and planning table updates
  - `.claude/get-shit-done/bin/lib/milestone.cjs` — Milestone archival and versioning
  - `.claude/get-shit-done/bin/lib/template.cjs` — Template selection and frontmatter pre-filling
  - `.claude/get-shit-done/bin/lib/verify.cjs` — Verification suite (structure, references, commits, artifacts)
  - `.claude/get-shit-done/bin/lib/config.cjs` — Configuration management and initialization
  - `.claude/get-shit-done/bin/lib/init.cjs` — Project scaffolding and first-time setup
- Contains: Domain-specific logic, file I/O, pattern matching
- Depends on: Core utilities, frontmatter parsing, model profiles
- Used by: CLI entry layer

**Core Utilities Layer:**
- Purpose: Shared helpers for file operations, path normalization, git integration, config loading
- Location: `.claude/get-shit-done/bin/lib/core.cjs`
- Contains: Functions like `safeReadFile()`, `loadConfig()`, `execGit()`, phase lookup, slug generation, timestamp formatting
- Depends on: Node.js stdlib (fs, path, child_process)
- Used by: All command modules

**Parser Layer:**
- Purpose: Extract and manipulate structured data from Markdown frontmatter and body content
- Location: `.claude/get-shit-done/bin/lib/frontmatter.cjs`
- Contains: YAML frontmatter extraction/reconstruction, field validation, schema checking
- Depends on: Core utilities
- Used by: All domain modules that read/write PLAN.md, SUMMARY.md, STATE.md, etc.

**Configuration Layer:**
- Purpose: Load project configuration with defaults and nested field resolution
- Location: `.claude/get-shit-done/bin/lib/core.cjs::loadConfig()` and `.claude/get-shit-done/bin/lib/config.cjs`
- Contains: Config defaults (model_profile, branching_strategy, feature flags), env var resolution
- Depends on: Core utilities, config file I/O
- Used by: All domain modules for runtime behavior customization

**IDE Integration Layer:**
- Purpose: Connect GSD framework to Claude Code IDE lifecycle and display
- Locations:
  - `.claude/hooks/gsd-statusline.js` — Renders status bar with model name, current task, context usage percentage
  - `.claude/hooks/gsd-check-update.js` — Checks for GSD framework updates on session start
  - `.claude/hooks/gsd-context-monitor.js` — Monitors context window after tool use, emits warnings
- Depends on: Core utilities, file I/O, todo system
- Used by: Claude Code IDE via `settings.json` hook configuration

**Model Resolution Layer:**
- Purpose: Map agent types and profiles to specific Claude models
- Location: `.claude/get-shit-done/bin/lib/model-profiles.cjs`
- Contains: MODEL_PROFILES constant with executor, planner, researcher, debugger profiles
- Depends on: None
- Used by: Commands that need to resolve the correct model for a phase operation

## Data Flow

**Phase Initialization Flow:**
1. User invokes `/gsd:add-phase "Feature X"` in Claude Code
2. CLI parses command → calls `cmdPhaseAdd()` in `phase.cjs`
3. Phase module calls `phase next-decimal` to calculate numbering
4. Phase directory created: `.planning/phases/1-feature-x/`
5. ROADMAP.md updated with new phase entry via `cmdRoadmapAnalyze()`
6. Git commit created via `cmdCommit()` in `commands.cjs`
7. STATUS.md and STATE.md updated via `cmdStateUpdate()` in `state.cjs`
8. IDE statusline hook renders updated state

**Plan Execution Flow:**
1. Claude creates `.planning/phases/{N}/PLAN.md` with tasks
2. User triggers `/gsd:execute-phase {N}`
3. CLI verifies phase completeness via `cmdVerifyPhaseCompleteness()`
4. Model resolved via `resolveModelInternal()` based on profile
5. Phase prompt built from templates
6. Execution agent works through tasks
7. Claude creates `.planning/phases/{N}/{N}-01-SUMMARY.md` with results
8. Verifier validates summary against verification schema
9. STATE.md progressed via `state advance-plan`

**State Progression:**
- Atomic updates via `cmdStateUpdate()` — modifies single field in STATE.md
- Batch updates via `cmdStatePatch()` — multiple fields in one operation
- Field format: both `**Field:** value` (bold) and `Field: value` (plain) supported
- Frontmatter for PLAN/SUMMARY: extracted/validated via `frontmatter.cjs`

**Roadmap Analysis:**
- `roadmap analyze` parses ROADMAP.md, extracts phase sections
- Compares PLAN and SUMMARY counts for each phase
- Updates `progress_table` with completion percentages
- Feeds into `/gsd:stats` for project overview

**IDE Context Bridge:**
- Statusline hook writes context metrics to `/tmp/claude-ctx-{session_id}.json`
- Context monitor hook reads bridge file, emits warnings if context > 80%
- Context reserves 16.5% auto-compact buffer, normalizes display to 100% at usable limit

## Key Abstractions

**Phase:**
- Purpose: Represents a scoped unit of work with number, name, directory, plans, and summaries
- Examples: `1-setup`, `2.1-auth`, `3-database`
- Pattern: Phase directory naming convention `{number}-{slug}`, contains PLAN.md and SUMMARY.md files
- Normalization: `normalizePhaseName()` handles integer, decimal, letter-suffix formats

**Roadmap:**
- Purpose: Central planning document mapping phase descriptions and status
- Examples: `ROADMAP.md` in `.planning/`
- Pattern: Markdown with ## Phase headers and `progress_table` tracking completion counts
- Query: `cmdRoadmapGetPhase()` extracts phase section, `cmdRoadmapAnalyze()` parses full structure

**State:**
- Purpose: Track project-level metadata and progression
- Examples: `STATE.md` in `.planning/` with fields like `current_phase`, `plan_counter`, `completed_phases`
- Pattern: Frontmatter fields at top, sections below, supports both bold and plain field formats
- Mutation: Field-level updates via `stateExtractField()` and in-place replacement

**Plan:**
- Purpose: Detailed breakdown of phase work with tasks, assumptions, and must-haves
- Examples: `PLAN.md` in phase directory, numbered plans like `01-PLAN.md`
- Pattern: Frontmatter (phase, plan, subsystem, tags, provides, affects) + markdown body with ### Task sections
- Verification: `cmdVerifyPlanStructure()` checks for required sections and task format

**Summary:**
- Purpose: Record execution results, decisions, and artifacts for a plan
- Examples: `SUMMARY.md` or `01-SUMMARY.md` in phase directory
- Pattern: Same frontmatter structure as Plan, body contains completion status and decisions
- Selection: `cmdTemplateSelect()` chooses between minimal, standard, complex templates based on task count

**Milestone:**
- Purpose: Version-bound archive of completed phases
- Examples: `milestones/v1.0-phases/` containing archived phase directories
- Pattern: Archival via `cmdMilestoneComplete()`, creates MILESTONES.md index
- Filter: `getMilestonePhaseFilter()` separates shipped vs. current phases

**Todo:**
- Purpose: Track action items between sessions
- Examples: `.planning/todos/pending/{filename}.md` with metadata
- Pattern: Frontmatter with `created`, `title`, `area` fields, body contains task description
- Integration: Read by statusline hook to display current task in IDE

## Entry Points

**CLI Entry Point:**
- Location: `.claude/get-shit-done/bin/gsd-tools.cjs`
- Triggers: User CLI invocation like `node gsd-tools.cjs phase add "Feature"`
- Responsibilities: Parse arguments, dispatch to command module, format and output result

**IDE SessionStart Hook:**
- Location: `.claude/hooks/gsd-check-update.js`
- Triggers: Claude Code IDE session initialization
- Responsibilities: Check for GSD framework updates, cache result, no user-facing blocking

**IDE PostToolUse Hook:**
- Location: `.claude/hooks/gsd-context-monitor.js`
- Triggers: After each Claude Code tool execution
- Responsibilities: Monitor context usage, write bridge file for statusline, emit warnings if needed

**Statusline Hook:**
- Location: `.claude/hooks/gsd-statusline.js`
- Triggers: IDE requests status bar content (continuous during session)
- Responsibilities: Read context metrics, current task, model name, render colored progress bar

## Error Handling

**Strategy:** Function-level error handling with graceful failures in hooks

**Patterns:**
- Try/catch blocks in file operations return null/empty on failure (`safeReadFile()`)
- Command handlers call `error()` helper to exit(1) with stderr message
- Hooks fail silently to prevent disrupting IDE (see `gsd-statusline.js` lines 48-49, 89, 113-114)
- Verification commands use `cmdVerifyPathExists()` to check before operations
- Large JSON payloads written to tmpfiles with `@file:` prefix to avoid buffer overflow

## Cross-Cutting Concerns

**Logging:**
- No persistent logging framework
- Console.error() in hooks for CLI debugging only
- Status messages go to stdout (JSON or raw format)
- Silent failures in IDE hooks to maintain stability

**Validation:**
- Frontmatter schema validation in `frontmatter.cjs` against 'plan', 'summary', 'verification' schemas
- Phase numbering consistency via `comparePhaseNum()` for sort operations
- Reference resolution in `cmdVerifyReferences()` checks @-refs and file paths
- Artifact verification in `cmdVerifyArtifacts()` validates must_haves.artifacts list

**Configuration:**
- Loaded once per command via `loadConfig()` with fallback defaults
- Model profile resolution handles overrides via `model_overrides` section
- Branching strategy templates interpolate phase number and slug
- Nested config structure (sections: git, workflow, planning) with legacy depth→granularity migration

---

*Architecture analysis: 2026-03-18*
