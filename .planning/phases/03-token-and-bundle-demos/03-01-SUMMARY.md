---
phase: 03-token-and-bundle-demos
plan: 01
subsystem: ui
tags: [mapbox-gl, mapbox, vue, nuxt, runtimeConfig, WebGL, markers]

# Dependency graph
requires:
  - phase: 02-first-map-demos
    provides: maplibre.vue reference implementation and shared useMarkerData/MarkerDialog patterns
provides:
  - Mapbox GL JS demo page at /mapbox with token-gated access pattern
  - mapbox-gl ^3.20.0 and ol ^10.8.0 packages installed
  - runtimeConfig.public.mapboxToken integration pattern demonstrated
affects: [03-02-openlayers, 04-here-maps]

# Tech tracking
tech-stack:
  added: [mapbox-gl ^3.20.0, ol ^10.8.0]
  patterns:
    - "mapboxgl.accessToken set from useRuntimeConfig().public.mapboxToken before Map construction"
    - "Static import of mapbox-gl safe on CSR-only pages (ssr: false)"
    - "shallowRef for mapInstance prevents Vue proxy traversal of WebGL object graph"

key-files:
  created:
    - app/pages/mapbox.vue
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "mapbox-gl CSS imported locally in page file (not in nuxt.config.ts css array) — matches maplibre-gl pattern"
  - "ol installed in same npm install command as mapbox-gl — both needed for Phase 3"
  - "mapboxgl.accessToken assigned before new Map() call — Mapbox GL requires this ordering"

patterns-established:
  - "Token pattern: useRuntimeConfig().public.mapboxToken as string assigned to mapboxgl.accessToken before map init"
  - "Package install pattern: install all phase libraries at once (mapbox-gl + ol in single npm install)"

requirements-completed: [MAPBOX-01, MAPBOX-02, MAPBOX-03, MAPBOX-04, MAPBOX-05, MAPBOX-06, MAPBOX-07]

# Metrics
duration: 2min
completed: 2026-03-19
---

# Phase 3 Plan 01: Token and Bundle Demos Summary

**Mapbox GL JS /mapbox demo page with access token from runtimeConfig.public.mapboxToken, mirroring maplibre.vue pattern with mapbox-gl ^3.20.0 and ol ^10.8.0 installed**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-19T01:44:32Z
- **Completed:** 2026-03-19T01:46:32Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Installed mapbox-gl ^3.20.0 and ol ^10.8.0 in one npm install command
- Created /mapbox CSR-only page wiring access token from runtimeConfig.public.mapboxToken
- Confirmed npm run build passes — mapbox-gl bundle included, no SSR import errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Install mapbox-gl and ol npm packages** - `73acbd9` (chore)
2. **Task 2: Create /mapbox demo page with access token pattern** - `5067156` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified
- `app/pages/mapbox.vue` - Mapbox GL JS demo with token pattern, custom SVG markers, NavigationControl, MarkerDialog, version badge, WebGL cleanup
- `package.json` - Added mapbox-gl ^3.20.0 and ol ^10.8.0 to dependencies
- `package-lock.json` - Updated with 30 new packages from mapbox-gl and ol

## Decisions Made
- mapbox-gl CSS imported locally in the page file (not added to nuxt.config.ts css array), consistent with how maplibre-gl CSS is handled — local import is tree-shaken per route
- mapboxgl.accessToken assigned before calling new Map() — Mapbox GL JS requires this ordering; if token is set after Map constructor it may fail tile fetches
- ol installed in the same npm install invocation as mapbox-gl since both are needed for Phase 3

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - build passes cleanly, all acceptance criteria met.

## User Setup Required
**External service requires manual configuration.** NUXT_PUBLIC_MAPBOX_TOKEN environment variable must be set before the /mapbox page will load tiles. Without a valid token the page renders but shows an authentication error from Mapbox APIs. Set via:
```
export NUXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

## Next Phase Readiness
- mapbox-gl and ol packages are installed — Phase 3 Plan 02 (OpenLayers) can proceed immediately
- /mapbox page ready for verification once NUXT_PUBLIC_MAPBOX_TOKEN is set
- Token pattern established: useRuntimeConfig().public.mapboxToken is the canonical approach for all token-gated libraries

---
*Phase: 03-token-and-bundle-demos*
*Completed: 2026-03-19*
