---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 03-02-PLAN.md — /openlayers demo page with tree-shaken OpenLayers submodule imports
last_updated: "2026-03-19T02:13:38.517Z"
last_activity: 2026-03-19 — Plan 02-02 complete; MapLibre GL WebGL vector tile demo at /maplibre — both Phase 2 demo pages verified
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 7
  completed_plans: 7
  percent: 56
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-18)

**Core value:** Each map library runs in isolation with identical feature coverage (custom marker, detail dialog, zoom) so the team can fairly compare libraries before adopting one in production.
**Current focus:** Phase 2 — First Map Demos

## Current Position

Phase: 2 of 4 (First Map Demos)
Plan: 2 of 3 in current phase
Status: Executing
Last activity: 2026-03-19 — Plan 02-02 complete; MapLibre GL WebGL vector tile demo at /maplibre — both Phase 2 demo pages verified

Progress: [█████░░░░░] 56%

## Performance Metrics

**Velocity:**
- Total plans completed: 1
- Average duration: 4 min
- Total execution time: 4 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-and-shared-ui | 1 | 4 min | 4 min |

**Recent Trend:**
- Last 5 plans: 4 min
- Trend: -

*Updated after each plan completion*
| Phase 01-foundation-and-shared-ui P02 | 2 | 2 tasks | 3 files |
| Phase 01-foundation-and-shared-ui P03 | 1 | 1 tasks | 1 files |
| Phase 02-first-map-demos P01 | 2 | 2 tasks | 4 files |
| Phase 02-first-map-demos P02 | 2 | 2 tasks | 1 files |
| Phase 03-token-and-bundle-demos P01 | 2 | 2 tasks | 3 files |
| Phase 03-token-and-bundle-demos P02 | 2 | 1 tasks | 1 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Setup]: All 5 map libraries integrated directly (no Vue wrappers) — unmaintained or version-mismatched
- [Setup]: `definePageMeta({ ssr: false })` per demo page; list page remains SSR-enabled
- [Setup]: `shallowRef` (not `ref`) required for all map instances to avoid Vue reactivity traversal
- [01-01]: Use `@tailwindcss/vite` (Tailwind v4 native Vite plugin) not `@nuxtjs/tailwindcss` — confirmed correct for Nuxt 4
- [01-01]: nuxi minimal template used for scaffold; app/app.vue simplified to just `<NuxtPage />`
- [01-01]: Tailwind v4 pattern: `@import 'tailwindcss'` in CSS + `tailwindcss()` in vite.plugins, no config file
- [01-03]: Two-container row approach for grid (3+2 split) with `lg:max-w-[calc(66.666%+12px)] lg:mx-auto` centering row 2
- [01-03]: Card data defined inline in script setup (not useMarkerData) — library metadata is static page content, not POI data
- [Phase 01-02]: [01-02]: Dialog visibility controlled by null/non-null marker prop — no separate visible boolean
- [Phase 01-02]: [01-02]: Action button in MarkerDialog is <a> tag (not <button>) since it navigates to actionUrl
- [Phase 01-02]: [01-02]: No Escape key handler in MarkerDialog per CONTEXT.md — keep it simple
- [Phase 02-01]: Dynamic import in onMounted prevents Leaflet's window access during SSR
- [Phase 02-01]: shallowRef for map instance — Vue proxy traversal on Leaflet internals causes errors
- [Phase 02-01]: L.divIcon with className: '' removes default white box for clean custom SVG markers
- [Phase 02-01]: Leaflet CSS in nuxt.config.ts css array for reliable tile layout regardless of mount timing
- [Phase 02-02]: Static import of maplibre-gl safe on CSR-only pages (ssr: false) — no dynamic import needed unlike Leaflet
- [Phase 02-02]: MapLibre uses [lng, lat] coordinate order (opposite of Leaflet's [lat, lng])
- [Phase 02-02]: OpenFreeMap liberty style (https://tiles.openfreemap.org/styles/liberty) requires no API key
- [Phase 02-02]: Custom HTML markers via createElement + SVG innerHTML give full visual control without sprite configuration
- [Phase 03-01]: mapboxgl.accessToken assigned from runtimeConfig.public.mapboxToken before new Map() call — token must be set before map construction
- [Phase 03-01]: mapbox-gl CSS imported locally in page file (not nuxt.config.ts css array) — consistent with maplibre-gl pattern, tree-shaken per route
- [Phase 03-01]: ol installed alongside mapbox-gl in single npm install command — both needed for Phase 3 demos
- [Phase 03-02]: static imports of ol submodules safe on ssr:false pages; Overlay stopEvent:false critical for marker click handling; setTarget+dispose both required for OL cleanup

### Pending Todos

None.

### Blockers/Concerns

- [Phase 1]: Tailwind v4 + Nuxt 4 integration — RESOLVED: `@tailwindcss/vite` confirmed working, build passes
- [Phase 1]: Nuxt 4 `vite.ssr.noExternal` exact config syntax needs verification against nuxt.com/docs
- [Phase 4]: HERE Maps CDN script URLs may have changed since August 2025; verify at developer.here.com before implementing

## Session Continuity

Last session: 2026-03-19T01:51:46.156Z
Stopped at: Completed 03-02-PLAN.md — /openlayers demo page with tree-shaken OpenLayers submodule imports
Resume file: None
