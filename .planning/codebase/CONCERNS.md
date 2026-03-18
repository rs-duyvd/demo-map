# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Regex-based Markdown Parsing:**
- Issue: Heavy reliance on regular expressions for parsing YAML frontmatter and Markdown structure instead of formal parsers
- Files:
  - `.claude/get-shit-done/bin/lib/frontmatter.cjs` (lines 11-84, manual YAML stack parsing)
  - `.claude/get-shit-done/bin/lib/roadmap.cjs` (lines 24-26, 71-73, phase header extraction)
  - `.claude/get-shit-done/bin/lib/verify.cjs` (line 125, XML task parsing)
  - `.claude/get-shit-done/bin/lib/phase.cjs` (line 114, decimal phase extraction)
- Impact: Fragile to edge cases (nested structures, special characters, inconsistent formatting). Difficult to extend without breaking existing documents. Risk of data corruption on malformed input.
- Fix approach: Consider a dedicated YAML parser (e.g., `js-yaml`) and structured XML/Markdown parsing library to reduce brittle string manipulation.

**Duplicate Function Definitions:**
- Issue: `stateExtractField()` defined twice in `state.cjs` (lines 12-20 and 184-194) with identical logic
- Files: `.claude/get-shit-done/bin/lib/state.cjs`
- Impact: Maintenance burden, inconsistent updates if one is changed without the other
- Fix approach: Remove line 184-194 duplicate and reuse lines 12-20 definition throughout module

**Large Module Files:**
- Issue: Single modules contain multiple command functions (100+ lines each) without clear separation
- Files:
  - `phase.cjs` (911 lines) — 6+ command functions
  - `verify.cjs` (842 lines) — 8+ command functions
  - `init.cjs` (782 lines) — 10+ command functions
  - `state.cjs` (723 lines) — 8+ command functions
  - `commands.cjs` (709 lines) — 15+ command functions
- Impact: Difficult to locate specific logic, harder to test individual commands in isolation, increased cognitive load
- Fix approach: Split into smaller, single-responsibility modules. Example: `phase-crud.cjs`, `phase-query.cjs`, `phase-lifecycle.cjs`

**Broad Try-Catch Blocks:**
- Issue: Many catch blocks suppress all errors without logging or differentiation (lines 156, 180 in init.cjs; lines 47-49, 86 in core.cjs)
- Files:
  - `.claude/get-shit-done/bin/lib/init.cjs` (lines 138-157, 174-180)
  - `.claude/get-shit-done/bin/lib/commands.cjs` (lines 51-76)
  - `.claude/get-shit-done/bin/lib/core.cjs` (lines 44-50)
- Impact: Silent failures mask real errors. Difficult to debug when operations fail without indication. Security issues (failed permission checks) go unnoticed
- Fix approach: Differentiate between expected failures (missing files) and unexpected errors (permission denied, disk full). Log or emit warnings for unexpected errors

**Implicit Exit Behavior:**
- Issue: `output()` and `error()` helpers call `process.exit()` directly, making control flow non-obvious and difficult to test
- Files: `.claude/get-shit-done/bin/lib/core.cjs` (lines 19-40)
- Impact: Cannot compose command logic easily, difficult to use GSD as a library, hard to test without mocking process.exit
- Fix approach: Have functions return result objects instead of calling exit; move exit logic to main CLI entry point only

**File I/O Without Validation:**
- Issue: File operations don't validate permissions, disk space, or file encoding before write operations
- Files:
  - `.claude/get-shit-done/bin/lib/state.cjs` (line 145, writeStateMd without pre-checks)
  - `.claude/get-shit-done/bin/lib/core.cjs` (lines 26-32, tmpfile write without fallback)
  - `.claude/hooks/gsd-statusline.js` (line 46, bridge file write)
- Impact: Silent corruption of state files if disk is full. No recovery mechanism. Bridge files in /tmp can fail on some systems without warning
- Fix approach: Pre-check file permissions, use atomic writes (write to temp then rename), implement rollback on failure

## Known Bugs

**Phase Decimal Calculation Race Condition:**
- Symptoms: Concurrent phase creation may generate duplicate decimal numbers (e.g., both create 1.2)
- Files: `.claude/get-shit-done/bin/lib/phase.cjs` (lines 87-150)
- Trigger: Two parallel agents both calling `phase next-decimal 1` simultaneously
- Cause: Read-check-write pattern without file locking on phases directory
- Workaround: Serialize phase creation via single orchestrator instance
- Fix approach: Use file locks or atomic create-if-not-exists patterns

**ROADMAP.md Parsing Malformed State:**
- Symptoms: `cmdRoadmapGetPhase()` detects malformed roadmap (phase in summary but missing detail section) but doesn't provide recovery
- Files: `.claude/get-shit-done/bin/lib/roadmap.cjs` (lines 30-48)
- Trigger: Manually editing ROADMAP.md and removing a phase section without removing the checklist entry
- Workaround: Manually rebuild ROADMAP.md from scratch
- Fix approach: Provide auto-repair command or migration script

**State Field Update May Lose Data:**
- Symptoms: If frontmatter field contains newlines or special characters, `cmdStateUpdate()` may truncate or corrupt value
- Files: `.claude/get-shit-done/bin/lib/state.cjs` (lines 154-180)
- Trigger: Setting a field to a multi-line string or value with pipes/special chars
- Cause: Single-line regex replacement doesn't handle multi-line values
- Workaround: Manually edit STATE.md instead of using update command for complex values
- Fix approach: Use multi-line regex patterns or restructure state as JSON instead of Markdown

**Frontmatter Parser Doesn't Handle Quoted Values in Lists:**
- Symptoms: Array items with colons are incorrectly parsed (e.g., `- "key: value"` becomes empty)
- Files: `.claude/get-shit-done/bin/lib/frontmatter.cjs` (lines 60-79)
- Trigger: Using quoted strings with colons in YAML list items
- Cause: Line 62 doesn't properly handle quoted values before trim
- Workaround: Avoid colons in list items
- Fix approach: Use proper YAML tokenizer

## Security Considerations

**Command Execution via Git Bash:**
- Risk: Phase names, slugs, and commit messages are passed to git/shell commands without proper escaping
- Files:
  - `.claude/get-shit-done/bin/lib/core.cjs` (lines 124-135, git commands)
  - `.claude/get-shit-done/bin/lib/commands.cjs` (line 174, find command with shell escaping)
  - `.claude/get-shit-done/bin/lib/init.cjs` (line 174, find piped through grep)
- Current mitigation: Whitelist filtering in `escapeRegex()` but incomplete for shell context
- Recommendations:
  - Use `child_process.execFile()` or `spawnSync()` with separate args array instead of shell string concatenation
  - Validate phase names against strict pattern at input boundary
  - Test with fuzzy phase names containing special characters (e.g., `'; rm -rf /`)

**Environment Variable Leakage in Output:**
- Risk: Process environment variables could be captured in debug output, error messages, or temp files
- Files:
  - `.claude/get-shit-done/bin/lib/core.cjs` (lines 26-32, temp files written with timestamps)
  - `.claude/hooks/gsd-check-update.js` (no explicit env filtering)
  - `.claude/hooks/gsd-context-monitor.js` (line 145, GEMINI_API_KEY check)
- Current mitigation: No explicit filtering or masking
- Recommendations:
  - Audit all error messages for env var inclusion
  - Implement secret masking for known patterns (API_KEY, TOKEN, etc.)
  - Never write unparsed system information to logs

**Insecure Temp File Handling:**
- Risk: Temp files in `/tmp/` are world-readable on Unix systems; context bridge files may contain sensitive workspace data
- Files:
  - `.claude/get-shit-done/bin/lib/core.cjs` (line 27, `gsd-${Date.now()}.json`)
  - `.claude/hooks/gsd-statusline.js` (lines 38-46, `claude-ctx-{session}.json`)
- Current mitigation: No file permissions set, relies on umask
- Recommendations:
  - Use `fs.writeFileSync()` with mode `0o600` to restrict to owner only
  - Include session_id/machine ID in temp file path to reduce collisions
  - Clean up bridge files after use (currently no cleanup mechanism)

**BRAVE_API_KEY Access:**
- Risk: API keys loaded from `~/.gsd/brave_api_key` or `BRAVE_API_KEY` env var without proper validation
- Files:
  - `.claude/get-shit-done/bin/lib/commands.cjs` (line 322, websearch)
  - `.claude/get-shit-done/bin/lib/init.cjs` (line 168)
  - `.claude/get-shit-done/bin/lib/config.cjs` (line 64)
- Current mitigation: Env var check, file existence check
- Recommendations:
  - Never log or output the full API key
  - Validate key format before use
  - Consider reading from secure storage instead of plaintext file

## Performance Bottlenecks

**Full Directory Scans on Every Phase Operation:**
- Problem: Many commands call `fs.readdirSync()` on `.planning/phases/` multiple times per operation
- Files:
  - `.claude/get-shit-done/bin/lib/roadmap.cjs` (lines 136-150, analyzes all phases every time)
  - `.claude/get-shit-done/bin/lib/phase.cjs` (lines 26-28, 106-108)
  - `.claude/get-shit-done/bin/lib/verify.cjs` (lines 414-428, re-reads roadmap for each verify)
- Cause: No caching layer or index of phases
- Improvement path: Build a phases manifest file (`.planning/phases.json`) updated on phase add/remove, load once per command

**Regex Global Flag in Loops:**
- Problem: Multiple regex operations with `exec()` in loops (e.g., roadmap.cjs line 110, verify.cjs line 128) re-compile pattern each iteration
- Files: `.claude/get-shit-done/bin/lib/roadmap.cjs`, `.claude/get-shit-done/bin/lib/verify.cjs`
- Impact: Noticeable slowdown on large ROADMAP.md or projects with 50+ phases
- Improvement path: Pre-compile patterns outside loops

**No Incremental State Updates:**
- Problem: `cmdStatePatch()` (state.cjs line 121) reads entire STATE.md, modifies each field, writes whole file
- Files: `.claude/get-shit-done/bin/lib/state.cjs`
- Impact: On large projects with frequent state updates, this becomes a bottleneck
- Improvement path: Implement atomic field-level updates via JSON format instead of Markdown

## Fragile Areas

**Phase Numbering System:**
- Files: `.claude/get-shit-done/bin/lib/core.cjs` (lines 152-190, comparePhaseNum) and `.claude/get-shit-done/bin/lib/phase.cjs` (lines 87-150)
- Why fragile: Supports integer (1), decimal (1.2), letter suffix (1A), and hybrid (1A.2) formats. Comparison logic must handle all permutations. Missing test coverage for edge cases.
- Safe modification:
  1. Add comprehensive test file covering all phase number formats
  2. Use version comparison library (semantic-release pattern) instead of custom logic
  3. Add type validation at phase creation boundary
- Test coverage: No test files exist for phase comparison or normalization logic

**Frontmatter YAML Parsing:**
- Files: `.claude/get-shit-done/bin/lib/frontmatter.cjs` (lines 11-84)
- Why fragile: Manual stack-based YAML parser that doesn't follow official YAML spec. Assumptions about indentation, quotes, and nested structures.
- Safe modification:
  1. Never assume indentation levels without validation
  2. Add unit tests for each parsing case (lists, nested objects, quoted values)
  3. Consider migrating to `js-yaml` for official spec compliance
- Test coverage: No standalone test file; testing only via integration (phase creation)

**Git Command Invocation:**
- Files: `.claude/get-shit-done/bin/lib/core.cjs` (lines 124-135)
- Why fragile: String concatenation for shell commands, minimal escaping, depends on git version/config
- Safe modification:
  1. Always use `spawnSync()` with args array, never execSync with string
  2. Validate git config is sensible before operations
  3. Test with different git configurations (submodules, worktrees, custom hooks)
- Test coverage: No isolated tests for git integration

**State.md Field Replacement:**
- Files: `.claude/get-shit-done/bin/lib/state.cjs` (lines 154-180, 196-205)
- Why fragile: Regex replace assumes fields appear once and don't span lines. Breaks on multi-line values or adjacent fields with similar names
- Safe modification:
  1. Add state migration to JSON format for safer key-value operations
  2. If staying with Markdown, parse entire structure, modify, then serialize
  3. Add validation that replacement actually occurred before writing
- Test coverage: No tests for state update with edge cases (multi-line values, special chars)

## Scaling Limits

**Phases Directory Enumeration:**
- Current capacity: Up to ~1000 phases before directory listing becomes slow
- Limit: Beyond 500 phases, `fs.readdirSync()` starts to degrade performance (filesystem dependent)
- Scaling path: Implement phase index/manifest file (`.planning/phases.json`) instead of directory scan

**ROADMAP.md Size:**
- Current capacity: Up to ~10,000 lines before regex operations slow down
- Limit: Single Markdown file parsing with 50+ regex operations per command becomes linear in document size
- Scaling path: Split ROADMAP.md into version-specific files (ROADMAP-v1.md, ROADMAP-v2.md) or move to JSON format

**State.md Complexity:**
- Current capacity: Up to ~500 fields before field lookup becomes slow
- Limit: Each `cmdStateUpdate()` performs 2-3 regex matches on entire file content
- Scaling path: Migrate STATE.md to JSON with schema, or implement lazy parsing

**Temp File Accumulation:**
- Current capacity: Unlimited, but `/tmp` has fixed size
- Limit: Large payloads (>50KB) trigger temp file writes; no cleanup mechanism exists
- Scaling path: Implement temp file cleanup on CLI startup, or use piping instead of temp files for large outputs

## Dependencies at Risk

**No External Package Dependencies:**
- Risk: None (GSD uses only Node.js built-ins) — this is good
- Impact: Self-contained and portable
- Note: Websearch feature (commands.cjs line 321) is async but never called in current codebase

## Missing Critical Features

**No Locking Mechanism for Concurrent Operations:**
- Problem: Multiple agents can execute simultaneously, leading to race conditions on file writes
- Blocks: Parallel phase creation, concurrent state updates, simultaneous roadmap edits
- Workaround: Run GSD commands sequentially via single orchestrator
- Recommendation: Implement file lock mechanism (use `proper-lockfile` or directory lock pattern)

**No Transaction/Rollback Support:**
- Problem: Failed operations (e.g., partial commit) leave state inconsistent
- Blocks: Can't recover from mid-operation interruption (e.g., agent killed mid-write)
- Workaround: Manual repair of `.planning/` files
- Recommendation: Implement atomic operations with rollback

**No Validation Schema for Markdown Documents:**
- Problem: PLAN.md and SUMMARY.md frontmatter structure has no formal schema
- Blocks: Impossible to enforce consistent structure across phases
- Workaround: Manual verification
- Recommendation: Define JSON Schema for frontmatter, validate on write

**No Changelog/Audit Log:**
- Problem: No record of who changed what and when in planning documents
- Blocks: Can't track decision history, can't revert to previous state, can't debug issues
- Workaround: Git history (if .planning/ is committed)
- Recommendation: Implement write-ahead log or store revisions in `.planning/history/`

## Test Coverage Gaps

**Phase Numbering Edge Cases:**
- What's not tested: Hybrid formats (1A.2.3), letter transitions (1Z → 2A), renumbering on phase delete
- Files: `.claude/get-shit-done/bin/lib/phase.cjs`, `.claude/get-shit-done/bin/lib/core.cjs`
- Risk: Silent numbering corruption if format assumptions break
- Priority: High

**Concurrent Operations:**
- What's not tested: Two agents calling phase operations simultaneously, state update races, roadmap edit conflicts
- Files: All files in lib/
- Risk: Data loss or corruption on parallel execution
- Priority: High

**YAML Frontmatter Parsing:**
- What's not tested: Quoted values, special characters, nested arrays, deeply nested objects
- Files: `.claude/get-shit-done/bin/lib/frontmatter.cjs`
- Risk: Silent data loss when parsing complex frontmatter
- Priority: Medium

**Git Integration:**
- What's not tested: Shallow repos, repos with submodules, detached HEAD state, custom git hooks
- Files: `.claude/get-shit-done/bin/lib/core.cjs`
- Risk: Unpredictable behavior in non-standard git setups
- Priority: Medium

**Shell Command Injection:**
- What's not tested: Phase names with shell metacharacters, commit messages with quotes, directory names with spaces
- Files: `.claude/get-shit-done/bin/lib/core.cjs`, `.claude/get-shit-done/bin/lib/commands.cjs`
- Risk: Command injection vulnerability or unexpected behavior
- Priority: High

**File System Edge Cases:**
- What's not tested: File permissions denied, disk full errors, symlinks, case-sensitive vs case-insensitive filesystems
- Files: All files with fs operations
- Risk: Unhandled exceptions leading to crashed operations
- Priority: Medium

**Malformed ROADMAP.md Recovery:**
- What's not tested: Missing phase sections, duplicate phase numbers, invalid success criteria format
- Files: `.claude/get-shit-done/bin/lib/roadmap.cjs`
- Risk: Commands fail silently or produce incorrect results
- Priority: Medium

---

*Concerns audit: 2026-03-18*
