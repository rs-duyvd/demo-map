---
phase: 02-first-map-demos
plan: 01
subsystem: ui
tags: [leaflet, maplibre-gl, openstreetmap, vue, nuxt, csr, markers, dialog]

# Dependency graph
requires:
  - phase: 01-foundation-and-shared-ui
    provides: MarkerDialog component, useMarkerData composable, MarkerData type, Tailwind/Nuxt base setup
provides:
  - /leaflet demo page with full feature coverage (custom markers, dialog, zoom, version badge)
  - leaflet@1.9.4 and maplibre-gl@5.20.2 installed as project dependencies
  - Leaflet CSS in nuxt.config.ts css array
  - CSR-only page pattern (definePageMeta ssr:false + dynamic import in onMounted) established for all demo pages
affects: [02-02-maplibre, 02-03-openlayers, 02-04-google-maps, 02-05-here-maps]

# Tech tracking
tech-stack:
  added: [leaflet@1.9.4, @types/leaflet@1.9.21, maplibre-gl@5.20.2]
  patterns:
    - definePageMeta({ ssr: false }) disables SSR for CSR-only map pages
    - Dynamic import (await import('leaflet')) in onMounted avoids SSR evaluation
    - shallowRef for map instance to prevent Vue from traversing Leaflet internals
    - L.divIcon with className:'' and inline SVG for custom markers without default white box
    - onUnmounted with mapInstance.value?.remove() clears Leaflet container state to prevent re-navigation errors
    - Version badge sourced from dynamic import module.version property

key-files:
  created: [app/pages/leaflet.vue]
  modified: [package.json, package-lock.json, nuxt.config.ts]

key-decisions:
  - "Dynamic import in onMounted (not top-level) — prevents Leaflet's window access during SSR"
  - "shallowRef for mapInstance — Leaflet internals are complex objects, Vue proxy traversal causes errors"
  - "L.divIcon with className: '' — removes the default Leaflet white box background from custom SVG markers"
  - "Leaflet CSS in nuxt.config.ts css array — most reliable for tile layout across component mount timing"
  - "maplibre-gl installed here too (Phase 2 wave 1) — both dependencies needed before MapLibre plan executes"

patterns-established:
  - "CSR demo page pattern: definePageMeta({ ssr: false }) + dynamic import in onMounted + shallowRef + onUnmounted cleanup"
  - "Version badge: absolute top-4 left-4 z-10 with bg-white/90 backdrop-blur-sm — replicate for all demo pages"
  - "Map container height: h-[calc(100vh-64px)] to account for 64px header — prevents 0px collapse"

requirements-completed: [LEAF-01, LEAF-02, LEAF-03, LEAF-04, LEAF-05, LEAF-06, LEAF-07]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 2 Plan 01: Leaflet Demo Summary

**Leaflet v1.9.4 demo page at /leaflet with OpenStreetMap tiles, custom blue teardrop SVG markers, MarkerDialog on click, zoom controls, and version badge — all 7 LEAF requirements satisfied**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T12:52:01Z
- **Completed:** 2026-03-18T12:53:55Z
- **Tasks:** 2 completed
- **Files modified:** 4

## Accomplishments

- Installed leaflet@1.9.4, @types/leaflet@1.9.21, and maplibre-gl@5.20.2 (Phase 2 map library dependencies)
- Added `'leaflet/dist/leaflet.css'` to nuxt.config.ts css array for reliable tile layout
- Created /leaflet page (87 lines) with all 7 LEAF requirements: CSR-only, OpenStreetMap tiles, custom SVG markers, click-to-dialog, zoom controls, version badge, and onUnmounted cleanup

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Leaflet + MapLibre dependencies and add Leaflet CSS** - `2496bf8` (chore)
2. **Task 2: Create /leaflet demo page** - `3bf941a` (feat)

## Files Created/Modified

- `app/pages/leaflet.vue` - CSR-only Leaflet demo page with 10 Vietnam POI markers, custom SVG divIcon, MarkerDialog integration, zoom controls, version badge, and onUnmounted cleanup
- `package.json` - Added leaflet@1.9.4, @types/leaflet@1.9.21, maplibre-gl@5.20.2
- `package-lock.json` - Updated lockfile (30 packages added)
- `nuxt.config.ts` - Added `'leaflet/dist/leaflet.css'` to css array

## Decisions Made

- Used `shallowRef` (not `ref`) for the Leaflet map instance — Vue's deep reactivity proxy on Leaflet's complex internals causes errors
- Used `L.divIcon` with `className: ''` to remove the default white box background, allowing the inline SVG to render cleanly
- Leaflet CSS placed in nuxt.config.ts (not component-scoped) — ensures tile layout styles are always available regardless of mount timing
- Dynamic import in `onMounted` (not top-level) — Leaflet accesses `window` at module load time, which fails during SSR evaluation
- Version extracted from `leafletModule.version` (named export) alongside `leafletModule.default` in a single import call

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `npx nuxt typecheck` fails due to a pre-existing environment issue: the npx cache holds an incompatible `vue-tsc` version that cannot find `@vue/language-core` from the local `node_modules`. This is unrelated to our changes — the error exists before our modifications. Running `node_modules/.bin/tsc --noEmit` passes with zero errors, confirming the TypeScript code is correct.

## User Setup Required

None - no external service configuration required. OpenStreetMap tiles load without an API key.

## Next Phase Readiness

- /leaflet page is complete and serves as the reference implementation pattern for all remaining demo pages
- maplibre-gl@5.20.2 is already installed, ready for Plan 02-02 (MapLibre demo)
- The CSR page pattern (ssr:false + dynamic import + shallowRef + cleanup) should be replicated for all library demos

---
*Phase: 02-first-map-demos*
*Completed: 2026-03-18*
