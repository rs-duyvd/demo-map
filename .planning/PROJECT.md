# Demo Map

## What This Is

A Nuxt 4 demo application for evaluating and presenting JavaScript map libraries. It provides a comparison page listing 5 libraries (Leaflet.js, MapLibre GL, Mapbox GL JS, OpenLayers, HERE Maps JS), each with a dedicated demo page showcasing custom markers, marker detail dialogs, lat/lng-based marker placement, and zoom controls. Built both as an internal evaluation tool and a stakeholder presentation tool for the Hanatour production app.

## Core Value

Each map library must be runnable side-by-side in isolation, with identical feature coverage (custom marker, detail dialog, zoom), so the team can fairly compare libraries before adopting one in production.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] List page showing all 5 map libraries as cards with preview image and link to demo
- [ ] Individual demo page for each library (Leaflet.js, MapLibre GL, Mapbox GL JS, OpenLayers, HERE Maps JS)
- [ ] Custom markers rendered at hardcoded lat/lng coordinates on each map
- [ ] Zoom in/out controls on each map
- [ ] Marker detail dialog with rich content (image, description, action links) on marker click
- [ ] HERE Maps JS included using free tier (API key limitation noted in UI)

### Out of Scope

- Real API / backend data integration — hardcoded sample data only for this demo
- Side-by-side split view or tabbed comparison — card-based list page is sufficient
- Mobile app — web-first demo
- Authentication — public demo, no login required
- Production deployment pipeline — this is a demo/evaluation tool

## Context

- Existing codebase is the GSD (Get Shit Done) planning framework tooling — the map demo is a new Nuxt 4 project to be built within this directory
- Target: Hanatour production app integration — demo informs which map library to adopt
- HERE Maps JS requires an API key; free tier will be used with a UI note about limitations
- Mapbox GL JS requires an access token for tiles

## Constraints

- **Tech Stack**: Nuxt 4 (not Nuxt 3) — must use Nuxt 4 project structure
- **Data**: Hardcoded sample markers only — no backend integration in v1
- **Libraries**: All 5 libraries must be included (Leaflet, MapLibre GL, Mapbox GL JS, OpenLayers, HERE Maps)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|-|
| Card-based list page (not split view or tabs) | Simpler to build; each library gets its own focused page | — Pending |
| Nuxt 4 as base framework | User requirement; aligns with production app direction | — Pending |
| Hardcoded sample data for markers | Demo/evaluation focus; avoid backend complexity | — Pending |
| HERE Maps free tier | No paid key available; include with UI disclaimer | — Pending |

---
*Last updated: 2026-03-18 after initialization*
