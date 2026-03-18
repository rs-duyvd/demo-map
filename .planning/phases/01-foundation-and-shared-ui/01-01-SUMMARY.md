---
phase: 01-foundation-and-shared-ui
plan: 01
subsystem: infra
tags: [nuxt4, tailwindcss, typescript, vite, env]

# Dependency graph
requires: []
provides:
  - Nuxt 4 app scaffolded with app/ directory structure
  - Tailwind CSS v4 configured via @tailwindcss/vite plugin
  - runtimeConfig.public with mapboxToken and hereApiKey
  - .env (gitignored) and .env.example (committed)
  - TypeScript configured via tsconfig.json referencing .nuxt/
affects: [all subsequent phases — all plans build on this Nuxt 4 foundation]

# Tech tracking
tech-stack:
  added:
    - nuxt@^4.4.2
    - vue@^3.5.30
    - vue-router@^5.0.3
    - "@tailwindcss/vite (devDependency)"
  patterns:
    - Tailwind CSS v4 imported via @import 'tailwindcss' in app/assets/app.css (no tailwind.config.ts)
    - @tailwindcss/vite added to vite.plugins in nuxt.config.ts (NOT @nuxtjs/tailwindcss)
    - runtimeConfig.public keys map from NUXT_PUBLIC_* env vars automatically
    - All app code lives under app/ directory (Nuxt 4 convention)

key-files:
  created:
    - package.json
    - package-lock.json
    - nuxt.config.ts
    - tsconfig.json
    - app/app.vue
    - app/assets/app.css
    - .gitignore
    - .env.example
    - public/favicon.ico
    - public/robots.txt
    - README.md
  modified: []

key-decisions:
  - "Use @tailwindcss/vite (Tailwind v4 native Vite plugin) not @nuxtjs/tailwindcss — correct approach for Nuxt 4"
  - "nuxi minimal template used for scaffold; app/app.vue simplified to just NuxtPage"
  - "nuxi init run non-interactively using --template minimal flag with stdin newline"

patterns-established:
  - "Tailwind v4: @import 'tailwindcss' in CSS file + tailwindcss() in vite.plugins — no config file needed"
  - "Env var pattern: NUXT_PUBLIC_MAPBOX_TOKEN -> runtimeConfig.public.mapboxToken (Nuxt auto-mapping)"
  - "app/ directory convention: all Vue/page/asset code lives under app/ in Nuxt 4"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03, FOUND-04]

# Metrics
duration: 4min
completed: 2026-03-18
---

# Phase 1 Plan 1: Nuxt 4 Foundation Scaffold Summary

**Nuxt 4 app scaffolded from scratch with Tailwind CSS v4 via @tailwindcss/vite plugin, TypeScript config, and environment variable wiring for Mapbox and HERE API tokens**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-18T08:25:33Z
- **Completed:** 2026-03-18T08:29:37Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Nuxt 4 minimal project scaffolded with correct app/ directory structure
- Tailwind CSS v4 integrated via @tailwindcss/vite plugin (no tailwind.config.ts required)
- runtimeConfig.public configured with mapboxToken and hereApiKey for NUXT_PUBLIC_* env var auto-mapping
- .env gitignored, .env.example committed with placeholder values
- Build verified: `nuxt build` completes without errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize Nuxt 4 project with TypeScript and install dependencies** - `6f695b1` (feat)
2. **Task 2: Configure Tailwind CSS v4, nuxt.config.ts, and environment variables** - `a014915` (feat)

## Files Created/Modified
- `package.json` - Nuxt 4 + vue + vue-router dependencies, @tailwindcss/vite devDependency
- `nuxt.config.ts` - Tailwind vite plugin, css array, runtimeConfig.public for map tokens
- `tsconfig.json` - References .nuxt/tsconfig.app.json and related files
- `app/app.vue` - Simplified to `<NuxtPage />` only
- `app/assets/app.css` - Tailwind CSS v4 entry point with `@import 'tailwindcss'`
- `.gitignore` - Covers node_modules, .nuxt, .output, .env, .planning/
- `.env.example` - Placeholder values for NUXT_PUBLIC_MAPBOX_TOKEN and NUXT_PUBLIC_HERE_API_KEY

## Decisions Made
- Used `@tailwindcss/vite` (Tailwind v4 native Vite plugin) instead of `@nuxtjs/tailwindcss` — confirmed correct approach for Nuxt 4 as per CONTEXT.md
- nuxi minimal template selected for scaffold — provides clean app/ directory structure
- `app/app.vue` simplified from nuxi default (NuxtRouteAnnouncer + NuxtWelcome) to just `<NuxtPage />` as required

## Deviations from Plan

None - plan executed exactly as written.

The only minor issue was that `npx nuxi@latest init` prompts interactively; worked around by passing `--template minimal` flag. Not a deviation — expected behavior for nuxi.

## Issues Encountered
- nuxi init is interactive by default; resolved by passing `--template minimal` and piping a newline to skip the "Initialize git repository?" prompt. Build completed cleanly after.

## User Setup Required
**External API tokens require configuration.** Update `.env` with real values before running map demos:
- `NUXT_PUBLIC_MAPBOX_TOKEN` — Get from mapbox.com/account
- `NUXT_PUBLIC_HERE_API_KEY` — Get from developer.here.com

For this plan (01-01) the placeholder values are sufficient since no map rendering happens in Phase 1.

## Next Phase Readiness
- Nuxt 4 dev server ready — `npm run dev` starts without errors
- Tailwind CSS v4 configured and importable
- runtimeConfig.public wired for map tokens
- app/ directory structure in place for pages, components, composables
- Phase 2 can begin adding demo pages with `definePageMeta({ ssr: false })`

## Self-Check: PASSED

- package.json: FOUND
- nuxt.config.ts: FOUND
- tsconfig.json: FOUND
- app/app.vue: FOUND
- app/assets/app.css: FOUND
- .env.example: FOUND
- .env: FOUND (gitignored)
- Commit 6f695b1: FOUND
- Commit a014915: FOUND

---
*Phase: 01-foundation-and-shared-ui*
*Completed: 2026-03-18*
