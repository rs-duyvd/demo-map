# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Claude Code IDE:**
- Anthropic's Claude Code - AI code editor integration point
  - SDK/Client: Native hooks via settings.json
  - Integration: Via `.claude/settings.json` hooks configuration
  - Endpoints: SessionStart, PostToolUse lifecycle events

**GSD Framework Remote:**
- GSD Update Service - Version checking and updates
  - Service: Remote version endpoint (checked by `gsd-check-update.js`)
  - Cache: `.claude/cache/gsd-update-check.json`
  - Frequency: Run on SessionStart hook

## Data Storage

**Databases:**
- None - No database integration

**File Storage:**
- Local filesystem only
  - Project documents: `.planning/codebase/` directory
  - State files: `.claude/` directory
  - Temporary metrics: OS temp directory (e.g., `/tmp/`)

**Caching:**
- Local filesystem-based caching:
  - GSD update check cache: `~/.claude/cache/gsd-update-check.json`
  - Context metrics bridge: `{OS_TEMP}/claude-ctx-{session_id}.json`

## Authentication & Identity

**Auth Provider:**
- None - Framework operates within Claude Code IDE context
- Session identification via Claude Code session_id parameter
- No external authentication required

## Monitoring & Observability

**Error Tracking:**
- None - Errors handled silently to prevent disrupting IDE statusline
- Graceful failures in hooks: see `gsd-statusline.js` (lines 48-49, 89, 113-114)

**Logs:**
- Console output only
- Status line display via `.claude/hooks/gsd-statusline.js`:
  - Model name
  - Current task from todo system
  - Context window usage percentage (with color-coded progress bar)
  - GSD update availability status

**Context Monitoring:**
- Real-time context window tracking in `gsd-context-monitor.js`
- Metrics written to temp bridge file for context-aware warnings
- Context buffer management: 16.5% auto-compact reserve (see `gsd-statusline.js` lines 25-32)

## CI/CD & Deployment

**Hosting:**
- Not applicable - Framework is local development tool

**CI Pipeline:**
- Not applicable - No CI/CD integration

**Integration Point:**
- Runs within Claude Code IDE only
- Lifecycle hooks: SessionStart, PostToolUse

## Environment Configuration

**Required env vars:**
- `CLAUDE_CONFIG_DIR` (optional) - Custom configuration directory
  - Default: `~/.claude/`
  - Used by: `gsd-statusline.js` (line 72), todo monitoring system

**No secrets required:**
- No API keys, tokens, or credentials stored
- Framework is client-side only

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Integration Architecture

**IDE Hooks System:**
- Defined in: `.claude/settings.json`
- Invocation:
  - `SessionStart` - Triggers `gsd-check-update.js` on IDE session initialization
  - `PostToolUse` - Triggers `gsd-context-monitor.js` after each Claude Code tool execution

**Context Bridge:**
- File-based IPC mechanism via temporary files
- Path: `{OS_TEMP}/claude-ctx-{session_id}.json`
- Data: session_id, remaining_percentage, used_pct, timestamp
- Purpose: Allow context-monitor hook to inject warnings without parsing statusline output

**Todo System Integration:**
- Reads todo files from: `{CLAUDE_CONFIG_DIR}/todos/`
- Filename pattern: `{session_id}-agent-*.json`
- Extracts current task for display in statusline

---

*Integration audit: 2026-03-18*
