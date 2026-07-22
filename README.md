# Chip Sense

**An interactive research board for the semiconductor supply chain** — companies, fabs, typed relationship arcs, trade flows, and illustrative stress scenarios on a world map.

**Live demo:** [chip-sense-ten.vercel.app](https://chip-sense-ten.vercel.app)

Chip Sense is a static [Next.js](https://nextjs.org/) app with **no backend, database, or auth**. All graph data lives in JSON files, is merged at build/request time, and renders entirely in the browser with [MapLibre GL](https://maplibre.org/) via [react-map-gl](https://visgl.github.io/react-map-gl/).

Use it to explore how equipment vendors, foundries, memory makers, packaging houses, and assemblers connect across geography — and how different *illustrative* scenarios restyle those connections for teaching and writing.

---

## What it does

| Feature | Description |
| --- | --- |
| **Supply chain map** | HQ pins, fab site pins, and colored arcs for foundry supply, equipment, packaging, memory, and assembly |
| **Cited facts** | Click a relationship to see disclosure-backed citations from a curated source catalog |
| **Trade flows** | Optional country-to-country chip trade arcs (UN Comtrade–based values) |
| **Scenarios** | Nine stress-test views (Taiwan disruption, HBM shortage, export controls, …) that change pin/arc styling — not forecasts |
| **Editorial tracks** | Lens pages for memory, CPUs, GPUs, and data centers |
| **Shareable URLs** | Every filter, scenario, and selection syncs to the query string |

**Core supply chain view** (`?essay1=1`) focuses the map on twelve anchor companies and key fabs for teaching and screenshots.

---

## Why it exists

Semiconductor supply chains are discussed constantly in policy and tech journalism, but they are hard to *see*: the same company can be a foundry, a packaging bottleneck, and a trade-flow endpoint at once.

Chip Sense is a **visual reasoning tool**:

1. **Separate structure from stress-testing** — registry facts and graph edges are distinct from scenario styling.
2. **Make relationships typed** — a purple equipment arc and a blue foundry arc mean different things.
3. **Keep citations one click away** — sourced edges link to filings and annual reports, not hand-wavy arrows.
4. **Stay honest about limits** — scenarios restyle the map; they do not simulate fab capacity or lead times numerically.

---

## Architecture (high level)

```mermaid
flowchart TB
  subgraph data [JSON data files]
    seed[seed-graph.json]
    companies[companies.json]
    fabs[fab-sites.json]
    trade[trade-flows.json]
    sources[sources.json]
  end

  subgraph merge [Runtime merge — loadGraph]
    CR[companyRecords.ts]
    GEO[geography.ts]
    seed --> CR --> GEO
    companies --> CR
    fabs --> GEO
  end

  subgraph ui [Client UI]
    RBS[ResearchBoardSection]
    SM[SupplyMap + MapLibre]
    URL[useBoardUrlState]
    RBS --> SM
    RBS --> URL
  end

  subgraph view [View layer]
    MV[mapView.ts]
    SE[scenarioEffects.ts]
    TF[tradeFlows.ts]
  end

  data --> merge
  merge --> view
  view --> ui
```

### Request path

1. **Server pages** call `loadGraph()` and `loadSources()` from JSON in `src/data/`.
2. **`loadGraph()`** merges the seed graph → company registry → geography (fab pins, countries, presence edges).
3. **`ResearchBoardSection`** (client) filters the view with `buildMapView()`, computes scenario styling, and syncs state to the URL.
4. **`SupplyMap`** renders MapLibre markers, relationship arcs, and trade lines. It is dynamically imported with `ssr: false` so MapLibre stays out of the server bundle.

### Three data layers

| Layer | Role |
| --- | --- |
| **Registry** | Sourced company HQ, fab sites, and citation catalog (`companies.json`, `fab-sites.json`, `sources.json`) |
| **Graph** | Nodes, typed edges, and scenario definitions (`seed-graph.json` + runtime merge) |
| **Illustrative** | Scenario assumptions and `affects` styling — map emphasis only, not predictive models |

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the full component map, merge order, and extension points.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, static export-friendly build) |
| UI | React 19, Tailwind CSS 4 |
| Map | MapLibre GL 5 (globe projection), react-map-gl 8, tile-free Natural Earth basemap |
| Data | JSON on disk; Node validation scripts in `scripts/` |
| CI | GitHub Actions — lint, `check:data`, build |

---

## Quick start

```bash
git clone https://github.com/aminalav/chip-sense.git
cd chip-sense
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before changing data:

```bash
npm run check:data   # validates sources, companies, trade flows, scenarios
npm run build
```

---

## Repository layout

```
src/
├── app/              # Routes: / and /track/[slug]
├── components/       # Map, sidebar panels, board shell
├── data/             # JSON datasets + TypeScript types
├── hooks/            # URL state sync
└── lib/              # Graph merge, scenarios, map filters, export
scripts/              # Validators and Comtrade fetch helper
docs/                 # Essay outlines (research writing, not app docs)
```

---

## Documentation

| Doc | For |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Deep dive: data flow, components, merge order |
| [MAP.md](./MAP.md) | Pin colors, layer toggles, URL parameters |
| [SOURCES.md](./SOURCES.md) | Sourcing rules and citation coverage |
| [SCENARIOS.md](./SCENARIOS.md) | Scenario list and assumptions |
| [MAINTAINER.md](./MAINTAINER.md) | Deploy workflow and writing docs (maintainers) |

---

## Example URLs

| View | URL |
| --- | --- |
| Core teaching map | [/?essay1=1&trade=1](https://chip-sense-ten.vercel.app/?essay1=1&trade=1) |
| Taiwan crisis scenario | [/?scenario=taiwan-crisis&node=co-tsmc](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc) |
| GPU track lens | [/track/gpus](https://chip-sense-ten.vercel.app/track/gpus) |
| HBM shortage (memory layer story) | [/?scenario=hbm-shortage&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&node=co-sk-hynix) |

---

## Disclaimer

Chip Sense is an **educational visualization**. Scenario multipliers and styling are illustrative stress tests, not forecasts. Factual claims on the map should be traced through `sources.json` and the selection panel citations. See the in-app disclaimer on every board view.

---

## License

This project’s **source code** is released under the [MIT License](./LICENSE).

That license covers the application code in this repository (TypeScript, React components, scripts, and the structure of the JSON datasets). It does **not** mean the author claims ownership of:

- **Third-party materials** cited in `sources.json` (SEC filings, annual reports, trade statistics, and similar) — those remain under their publishers’ terms.
- **Company names, product names, and trademarks** shown on the map — they belong to their respective owners; the map is for education, not endorsement.
- **Facts about the semiconductor industry** — the board visualizes publicly reported relationships; the MIT license is not a claim of proprietary knowledge about the industry.

Scenario styling and multipliers are illustrative only, not forecasts. See the disclaimer above and [SOURCES.md](./SOURCES.md) for how sourcing works in this repo.
