# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- Kebab-case for hook files: `gsd-statusline.js`, `gsd-check-update.js`, `gsd-context-monitor.js`
- Follows pattern `gsd-{purpose}.js` for Claude Code hook scripts

**Functions:**
- camelCase for all function names: `detectConfigDir`, `readFileSync`, `execSync`
- No function declarations preferred; use const declarations or inline functions

**Variables:**
- camelCase for all local variables and module-scoped variables: `homeDir`, `cacheDir`, `cacheFile`, `stdinTimeout`, `tmpDir`, `metricsPath`, `remaining`, `usedPct`
- UPPERCASE for constants: `AUTO_COMPACT_BUFFER_PCT`, `WARNING_THRESHOLD`, `CRITICAL_THRESHOLD`, `STALE_SECONDS`, `DEBOUNCE_CALLS`
- Single underscore prefix for internal/private logic (not observed in codebase)
- Descriptive names preferred over abbreviations (e.g., `remaining_percentage` vs `rem_pct` in JSON)

**Types:**
- No TypeScript used; plain JavaScript with implicit typing
- Object properties use snake_case in JSON data: `display_name`, `remaining_percentage`, `user_pct`, `session_id`, `current_dir`, `context_window`
- Camelcase used in JavaScript variable assignments from JSON: `const remaining = data.context_window?.remaining_percentage`

## Code Style

**Formatting:**
- No formatter configured (no .prettierrc or prettier configuration)
- 2-space indentation observed in all files
- Line length: approximately 80-100 characters
- Semicolons used consistently at end of statements
- No trailing commas in objects/arrays
- Template literals used for string interpolation: `` `${variable}` ``

**Linting:**
- No linter configured (no .eslintrc)
- Code follows loose JavaScript conventions
- Uses `require()` for CommonJS modules (Node.js compatibility)
- Shebang used in executable hook files: `#!/usr/bin/env node`

## Import Organization

**Order:**
1. Node.js built-in modules: `const fs = require('fs')`, `const path = require('path')`, `const os = require('os')`
2. External packages: `const { spawn } = require('child_process')`
3. No local imports (hooks are standalone scripts)

**Path Aliases:**
- Not applicable; no alias configuration exists
- Relative paths used in file operations
- Absolute paths constructed with `path.join()` for cross-platform compatibility

## Error Handling

**Patterns:**
- Try-catch blocks wrap risky operations (file I/O, JSON parsing, child process execution)
- Silent failure approach: catch blocks are often empty `catch (e) {}` or contain only comments
- No error logging to stdout/stderr in catch blocks (preserves process output)
- Early exits used: `process.exit(0)` on error conditions
- Timeout guards used for stdin operations: `setTimeout(() => process.exit(0), 3000)`
- Comments explain why errors are silent: `// Silent fail -- bridge is best-effort, don't break statusline`

**Example from `gsd-statusline.js` (lines 17-50):**
```javascript
try {
  const data = JSON.parse(input);
  // ... process data
} catch (e) {
  // Silent fail - don't break statusline on parse errors
}
```

**Example from `gsd-check-update.js` (lines 54-60):**
```javascript
try {
  if (fs.existsSync(projectVersionFile)) {
    installed = fs.readFileSync(projectVersionFile, 'utf8').trim();
  } else if (fs.existsSync(globalVersionFile)) {
    installed = fs.readFileSync(globalVersionFile, 'utf8').trim();
  }
} catch (e) {}
```

## Logging

**Framework:** `console` not used; logging avoided entirely in hook scripts

**Patterns:**
- No logging output used (would interfere with statusline/hook output)
- Output is reserved for JSON-structured data only: `process.stdout.write(JSON.stringify(output))`
- Errors are silently swallowed to prevent breaking parent process
- Comments explain logging decisions: `// Silent fail -- never block tool execution`

## Comments

**When to Comment:**
- Guard clauses and timeout behavior documented
- Explain why silent failures are necessary
- Document thresholds and constants with rationale
- Complex calculations explained (e.g., context window normalization in `gsd-statusline.js` lines 25-33)
- Process architecture explained (e.g., bridge file mechanism in `gsd-context-monitor.js` lines 7-11)

**JSDoc/TSDoc:**
- Not used; no TypeScript or JSDoc annotations observed
- Inline comments used instead of block comments
- Header comments at top of file explain script purpose: `// Claude Code Statusline - GSD Edition`

**Example from `gsd-statusline.js` (lines 25-33):**
```javascript
// Context window display (shows USED percentage scaled to usable context)
// Claude Code reserves ~16.5% for autocompact buffer, so usable context
// is 83.5% of the total window. We normalize to show 100% at that point.
const AUTO_COMPACT_BUFFER_PCT = 16.5;
```

## Function Design

**Size:**
- Functions generally 5-20 lines
- `detectConfigDir` is 12 lines with clear logic flow
- Inline closures used for subprocess spawning (`gsd-check-update.js` lines 44-75)

**Parameters:**
- Minimal parameters; mostly pure functions or functions operating on module scope
- `detectConfigDir(baseDir)` takes single parameter for flexibility
- Path operations passed directly without wrapper parameters

**Return Values:**
- Early returns used to exit on error conditions
- Functions return values or mutate state (file writes, stdout writes)
- `detectConfigDir` returns string path
- Most critical functions return void and use side effects (file I/O)

## Module Design

**Exports:**
- Hooks are executable scripts (shebang `#!/usr/bin/env node`)
- No explicit exports; entire script is the module
- Scripts use `process.stdin`, `process.stdout` for I/O

**Barrel Files:**
- Not applicable; no barrel/index files used
- Each hook is independent script with no cross-script imports

## Process Architecture Patterns

**STDIN/STDOUT Communication:**
- Hooks receive JSON via stdin: `process.stdin.on('data', chunk => input += chunk)`
- Output as JSON to stdout: `process.stdout.write(JSON.stringify(output))`
- Timeout guard prevents hanging: `setTimeout(() => process.exit(0), 3000)`
- All errors exit silently to prevent hook failures

**Bridge Files:**
- Cross-process communication via JSON files in temp directory
- Path construction: `path.join(os.tmpdir(), \`claude-ctx-${session}.json\`)`
- Files used to share context metrics between statusline and context monitor hooks

**Environment Variables:**
- Checked for overrides: `process.env.CLAUDE_CONFIG_DIR`, `process.env.GEMINI_API_KEY`
- Used to detect runtime (Claude Code vs Gemini): `process.env.GEMINI_API_KEY ? "AfterTool" : "PostToolUse"`
- Respect multi-account setups via `CLAUDE_CONFIG_DIR`

---

*Convention analysis: 2026-03-18*
