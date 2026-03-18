# Requirements: Demo Map

**Defined:** 2026-03-18
**Core Value:** Each map library runs in isolation with identical feature coverage (custom marker, detail dialog, zoom) so the team can fairly compare libraries before adopting one in production.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Project is scaffolded as a Nuxt 4 app with TypeScript and correct `app/` directory structure
- [x] **FOUND-02**: Vite SSR externals configured so map libraries don't crash SSR build
- [x] **FOUND-03**: Tailwind CSS integrated for styling
- [x] **FOUND-04**: `.env` file with `NUXT_PUBLIC_MAPBOX_TOKEN` and `NUXT_PUBLIC_HERE_API_KEY` variables (gitignored)
- [x] **FOUND-05**: Shared `MarkerData` TypeScript type defined (id, name, description, image, lat, lng, actionLabel, actionUrl)
- [x] **FOUND-06**: `useMarkerData` composable returns hardcoded Hanatour POI data (hotels/tour locations in Vietnam)
- [x] **FOUND-07**: Shared `MarkerDialog` Vue component displays marker rich content (image, name, description, action link button)

### List Page

- [x] **LIST-01**: Home page (`/`) displays a grid of library cards — one per map library (5 total)
- [x] **LIST-02**: Each card shows: library name, brief description, tech specs (license, WebGL vs raster, bundle size indicator)
- [x] **LIST-03**: Each card includes a static preview screenshot and a link to its demo page

### Leaflet Demo

- [x] **LEAF-01**: `/leaflet` demo page renders a Leaflet.js map (CSR-only, `ssr: false`)
- [x] **LEAF-02**: Leaflet CSS correctly imported; tile layer renders without layout collapse
- [x] **LEAF-03**: Hanatour POI markers rendered with custom SVG/HTML icon (not default Leaflet pin)
- [x] **LEAF-04**: Clicking a marker opens the shared `MarkerDialog` with full POI details
- [x] **LEAF-05**: Zoom in/out controls visible and functional
- [x] **LEAF-06**: Library name + version badge displayed on the page
- [x] **LEAF-07**: Map instance destroyed on `onUnmounted` (no memory leak on navigation)

### MapLibre GL Demo

- [ ] **MAPLIBRE-01**: `/maplibre` demo page renders a MapLibre GL JS map using OpenFreeMap tile source (CSR-only)
- [ ] **MAPLIBRE-02**: Map instance stored in `shallowRef` (not `ref`)
- [ ] **MAPLIBRE-03**: Hanatour POI markers rendered with custom HTML marker element
- [ ] **MAPLIBRE-04**: Clicking a marker opens the shared `MarkerDialog` with full POI details
- [ ] **MAPLIBRE-05**: Zoom in/out controls visible and functional
- [ ] **MAPLIBRE-06**: Library name + version badge displayed on the page
- [ ] **MAPLIBRE-07**: Map instance removed on `onUnmounted`

### Mapbox GL JS Demo

- [ ] **MAPBOX-01**: `/mapbox` demo page renders a Mapbox GL JS map using Mapbox access token from `runtimeConfig.public` (CSR-only)
- [ ] **MAPBOX-02**: Map instance stored in `shallowRef`
- [ ] **MAPBOX-03**: Hanatour POI markers rendered with custom HTML marker element
- [ ] **MAPBOX-04**: Clicking a marker opens the shared `MarkerDialog` with full POI details
- [ ] **MAPBOX-05**: Zoom in/out controls visible and functional
- [ ] **MAPBOX-06**: Library name + version badge displayed on the page
- [ ] **MAPBOX-07**: Map instance removed on `onUnmounted`

### OpenLayers Demo

- [ ] **OL-01**: `/openlayers` demo page renders an OpenLayers map (CSR-only)
- [ ] **OL-02**: Only required OpenLayers modules imported (tree-shaking enforced)
- [ ] **OL-03**: Hanatour POI markers rendered with custom SVG/HTML overlay
- [ ] **OL-04**: Clicking a marker opens the shared `MarkerDialog` with full POI details
- [ ] **OL-05**: Zoom in/out controls visible and functional
- [ ] **OL-06**: Library name + version badge displayed on the page
- [ ] **OL-07**: Map view destroyed on `onUnmounted`

### HERE Maps Demo

- [ ] **HERE-01**: `/here` demo page loads HERE Maps JS via sequential CDN script injection in `onMounted` (CSR-only)
- [ ] **HERE-02**: UI note displayed indicating free-tier API key limitation
- [ ] **HERE-03**: Hanatour POI markers rendered with custom marker icon
- [ ] **HERE-04**: Clicking a marker opens the shared `MarkerDialog` with full POI details
- [ ] **HERE-05**: Zoom in/out controls visible and functional
- [ ] **HERE-06**: Library name + version badge displayed on the page
- [ ] **HERE-07**: HERE map platform objects destroyed on `onUnmounted`

## v2 Requirements

### Enhancements

- **ENH-01**: Side-by-side split view to compare two libraries simultaneously
- **ENH-02**: Performance metrics panel (FPS, load time) per library
- **ENH-03**: Marker clustering demo
- **ENH-04**: Animated marker or route path demo
- **ENH-05**: Dark mode map tiles

### Data

- **DATA-01**: Real API integration pulling Hanatour locations from backend
- **DATA-02**: User-inputted lat/lng to place custom markers

## Out of Scope

| Feature | Reason |
|---------|--------|
| Vue wrapper libraries (vue2-leaflet, vue-mapbox, etc.) | All unmaintained or version-mismatched; direct integration is simpler |
| Pinia / global state management | Prop-down/emit-up is sufficient; no cross-component state sharing needed |
| Authentication | Public demo tool, no login required |
| Mobile app | Web-first evaluation tool |
| Real backend data | Hardcoded sample data sufficient for library evaluation |
| HERE Maps npm package | CDN-only for interactive maps; npm package is server-side API only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| FOUND-07 | Phase 1 | Complete |
| LIST-01 | Phase 1 | Complete |
| LIST-02 | Phase 1 | Complete |
| LIST-03 | Phase 1 | Complete |
| LEAF-01 | Phase 2 | Complete |
| LEAF-02 | Phase 2 | Complete |
| LEAF-03 | Phase 2 | Complete |
| LEAF-04 | Phase 2 | Complete |
| LEAF-05 | Phase 2 | Complete |
| LEAF-06 | Phase 2 | Complete |
| LEAF-07 | Phase 2 | Complete |
| MAPLIBRE-01 | Phase 2 | Pending |
| MAPLIBRE-02 | Phase 2 | Pending |
| MAPLIBRE-03 | Phase 2 | Pending |
| MAPLIBRE-04 | Phase 2 | Pending |
| MAPLIBRE-05 | Phase 2 | Pending |
| MAPLIBRE-06 | Phase 2 | Pending |
| MAPLIBRE-07 | Phase 2 | Pending |
| MAPBOX-01 | Phase 3 | Pending |
| MAPBOX-02 | Phase 3 | Pending |
| MAPBOX-03 | Phase 3 | Pending |
| MAPBOX-04 | Phase 3 | Pending |
| MAPBOX-05 | Phase 3 | Pending |
| MAPBOX-06 | Phase 3 | Pending |
| MAPBOX-07 | Phase 3 | Pending |
| OL-01 | Phase 3 | Pending |
| OL-02 | Phase 3 | Pending |
| OL-03 | Phase 3 | Pending |
| OL-04 | Phase 3 | Pending |
| OL-05 | Phase 3 | Pending |
| OL-06 | Phase 3 | Pending |
| OL-07 | Phase 3 | Pending |
| HERE-01 | Phase 4 | Pending |
| HERE-02 | Phase 4 | Pending |
| HERE-03 | Phase 4 | Pending |
| HERE-04 | Phase 4 | Pending |
| HERE-05 | Phase 4 | Pending |
| HERE-06 | Phase 4 | Pending |
| HERE-07 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 42 total
- Mapped to phases: 42
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-18*
*Last updated: 2026-03-18 — traceability updated to reflect 4-phase roadmap (coarse granularity)*
