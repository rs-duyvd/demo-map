# Roadmap: Demo Map

## Overview

Build a Nuxt 4 comparison demo for five JavaScript map libraries — Leaflet, MapLibre GL, Mapbox GL JS, OpenLayers, and HERE Maps. The project starts with the Nuxt 4 scaffold and shared data layer, then proves the CSR isolation pattern with the simplest libraries first, adds the token-gated and tree-shaken variants next, and finishes with the CDN-only HERE integration. Every demo page delivers the same feature set (custom markers, zoom controls, marker detail dialog) so the team can evaluate libraries side-by-side on equal footing.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation and Shared UI** - Scaffold Nuxt 4 app, configure SSR externals and env, build shared data layer and list page (completed 2026-03-18)
- [ ] **Phase 2: First Map Demos** - Implement Leaflet and MapLibre GL demos, proving the ClientOnly + onMounted/onUnmounted pattern
- [ ] **Phase 3: Token and Bundle Demos** - Implement Mapbox GL JS (access token pattern) and OpenLayers (tree-shaking pattern) demos
- [ ] **Phase 4: HERE Maps Demo** - Implement HERE Maps via sequential CDN script loading; final UI consistency pass

## Phase Details

### Phase 1: Foundation and Shared UI
**Goal**: The Nuxt 4 app runs, the list page is live with all 5 library cards, and all shared code is ready for map integrations to consume
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, LIST-01, LIST-02, LIST-03
**Success Criteria** (what must be TRUE):
  1. `nuxt dev` starts without errors and the app serves on localhost with the correct Nuxt 4 `app/` directory structure
  2. The home page (`/`) displays a grid of 5 library cards, each with a name, description, tech specs, preview image, and a link to its demo route
  3. The `MarkerDialog` component renders correctly when passed a `MarkerData` object (name, image, description, action link visible)
  4. `useMarkerData` returns typed POI data (Vietnam hotel/tour locations) with all `MarkerData` fields populated
  5. `.env` file exists with `NUXT_PUBLIC_MAPBOX_TOKEN` and `NUXT_PUBLIC_HERE_API_KEY` (gitignored); `.env.example` is committed
**Plans**: 3 plans
Plans:
- [x] 01-01-PLAN.md — Scaffold Nuxt 4 app with Tailwind CSS v4 and env vars
- [ ] 01-02-PLAN.md — Create MarkerData type, useMarkerData composable, and MarkerDialog component
- [ ] 01-03-PLAN.md — Build home page with 5 library cards grid

### Phase 2: First Map Demos
**Goal**: Two working demo pages — Leaflet and MapLibre GL — that each render a map with custom markers, zoom controls, and a clickable marker dialog, proving the ClientOnly isolation pattern
**Depends on**: Phase 1
**Requirements**: LEAF-01, LEAF-02, LEAF-03, LEAF-04, LEAF-05, LEAF-06, LEAF-07, MAPLIBRE-01, MAPLIBRE-02, MAPLIBRE-03, MAPLIBRE-04, MAPLIBRE-05, MAPLIBRE-06, MAPLIBRE-07
**Success Criteria** (what must be TRUE):
  1. Navigating to `/leaflet` renders a tile map with custom SVG/HTML markers at Hanatour POI coordinates; clicking a marker opens `MarkerDialog` with full details
  2. Navigating to `/maplibre` renders a WebGL map (OpenFreeMap tiles) with custom HTML markers; clicking a marker opens `MarkerDialog` with full details
  3. Zoom in/out controls are visible and functional on both demo pages
  4. The library name and version badge is displayed on both demo pages
  5. Navigating away from either demo page and back does not throw "Map container already initialized" or WebGL context errors
**Plans**: TBD

### Phase 3: Token and Bundle Demos
**Goal**: Two more working demo pages — Mapbox GL JS and OpenLayers — covering the access token pattern and tree-shaken module imports respectively
**Depends on**: Phase 2
**Requirements**: MAPBOX-01, MAPBOX-02, MAPBOX-03, MAPBOX-04, MAPBOX-05, MAPBOX-06, MAPBOX-07, OL-01, OL-02, OL-03, OL-04, OL-05, OL-06, OL-07
**Success Criteria** (what must be TRUE):
  1. Navigating to `/mapbox` renders a Mapbox GL JS map using the token from `runtimeConfig.public`; custom markers are visible and clicking one opens `MarkerDialog`
  2. Navigating to `/openlayers` renders an OpenLayers map with custom SVG/HTML overlay markers; clicking one opens `MarkerDialog`
  3. Zoom in/out controls are visible and functional on both demo pages
  4. The library name and version badge is displayed on both demo pages
  5. Navigating away and back causes no errors; both map instances are fully cleaned up on unmount
**Plans**: TBD

### Phase 4: HERE Maps Demo
**Goal**: The final demo page — HERE Maps via sequential CDN script injection — is working with markers, zoom, dialog, and a free-tier disclaimer; all five library demos are complete and consistent
**Depends on**: Phase 3
**Requirements**: HERE-01, HERE-02, HERE-03, HERE-04, HERE-05, HERE-06, HERE-07
**Success Criteria** (what must be TRUE):
  1. Navigating to `/here` loads the HERE Maps JS SDK via sequential CDN scripts and renders a map with custom markers at Hanatour POI coordinates
  2. Clicking a HERE map marker opens `MarkerDialog` with full POI details
  3. A visible UI note on the `/here` page explains the free-tier API key limitation
  4. Zoom in/out controls are visible and functional on the HERE demo page
  5. Navigating away from `/here` destroys HERE platform objects without console errors
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Shared UI | 3/3 | Complete   | 2026-03-18 |
| 2. First Map Demos | 0/? | Not started | - |
| 3. Token and Bundle Demos | 0/? | Not started | - |
| 4. HERE Maps Demo | 0/? | Not started | - |
