# Chip Sense

A **Next.js 15 research board** for visualizing the semiconductor supply chain — companies, fabs, relationship arcs, trade flows, and illustrative stress scenarios on an interactive [MapLibre](https://maplibre.org/) world map.

Data is **file-based** (JSON in `src/data/`): no database, no API backend, no auth. The graph is assembled at runtime and rendered fully client-side. The production build is static.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If file watching is flaky on your setup:

```bash
WATCHPACK_POLLING=true npm run dev -- --hostname 127.0.0.1 --port 3002
```

**Requirements:** Node.js 20+.

## Scripts

| Command | Role |
| --- | --- |
| `npm run dev` | Local dev server (Turbopack) |
| `npm run build` | Production build (static) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run check:data` | Run all JSON data validators |
| `npm run data:coverage` | Regenerate `DATA_COVERAGE.md` |
| `npm run fetch:trade` | Refresh Comtrade trade values |

Run **`npm run check:data`** before committing data changes.

## How it works

1. Server pages call `loadGraph()` and `loadSources()`.
2. `loadGraph()` merges the seed graph → company registry → geography (fabs, countries, presence pins).
3. `ResearchBoardSection` (client) filters the view, computes scenario styling, and syncs filters to the URL.
4. `SupplyMap` renders MapLibre markers, arcs, and trade lines. It's dynamically imported with `ssr: false`, so MapLibre stays out of the initial bundle.

Shareable URLs: `/?scenario=taiwan-crisis`, `/?track=gpus&trade=1`, `/?node=co-tsmc`.

## Project layout

```
src/
├── app/         # Next.js App Router pages
├── components/  # React UI (map, panels, board shell)
├── data/        # JSON data + TypeScript types
├── hooks/       # Client hooks (URL state)
└── lib/         # Graph merge, map filters, scenario logic
scripts/         # Data validators + Comtrade fetch
docs/            # Essay outline
```

## Documentation

| Doc | Contents |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Full architecture, data layers, merge order |
| [MAP.md](./MAP.md) | Map visibility rules, URL params, pin colors |
| [SOURCES.md](./SOURCES.md) | What counts as sourced vs. illustrative |
| [SCENARIOS.md](./SCENARIOS.md) | Scenario list and writing prompts |
| [COMPANIES.md](./COMPANIES.md) | Company registry table |
| [DATA_COVERAGE.md](./DATA_COVERAGE.md) | Coverage metrics (regenerate with `data:coverage`) |

## Not in scope

- No database, auth, or user accounts
- No quantitative simulation — scenarios *restyle* the graph; they do not model shortages from capacity tables
- No automated test suite; the data validators are the main gate
