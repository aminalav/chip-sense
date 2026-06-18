# Maintainer notes

Workflow and deployment notes for people working on this repo. For a public overview of what Chip Sense is and how it is built, see [README.md](./README.md).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If file watching is unreliable on macOS or network filesystems, polling mode on a fixed port can help:

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

## Deploy

Production demo: **[chip-sense-ten.vercel.app](https://chip-sense-ten.vercel.app)** (auto-deploys from `main`).

Pre-ship gate:

```bash
npm run check:data && npm run build
```

Connect the GitHub repo to [Vercel](https://vercel.com). No environment variables are required for the static board.

## Shareable board URLs

Examples for testing and writing:

- `/?scenario=taiwan-crisis`
- `/?track=gpus&trade=1`
- `/?node=co-tsmc`
- `/?essay1=1`

See [MAP.md](./MAP.md) for the full query-parameter list.

## Writing workflow docs

| Doc | Role |
| --- | --- |
| [docs/writing-cheat-sheet.md](./docs/writing-cheat-sheet.md) | Piece briefs, board URLs, screenshot filenames |
| [docs/essay-1.md](./docs/essay-1.md) | Long-form Taiwan / US–China essay draft |
| [docs/essay-scenarios.md](./docs/essay-scenarios.md) | Scenario-series post outlines |
| [SCENARIOS.md](./SCENARIOS.md) | Scenario list and draft prompts |

## Project layout

```
src/
├── app/         # Next.js App Router pages
├── components/  # React UI (map, panels, board shell)
├── data/        # JSON data + TypeScript types
├── hooks/       # Client hooks (URL state)
└── lib/         # Graph merge, map filters, scenario logic
scripts/         # Data validators + Comtrade fetch
docs/            # Essay outlines + writing cheat sheet
```

## Technical reference

| Doc | Contents |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Full architecture, data layers, merge order |
| [MAP.md](./MAP.md) | Map visibility rules, URL params, pin colors |
| [SOURCES.md](./SOURCES.md) | What counts as sourced vs. illustrative |
| [COMPANIES.md](./COMPANIES.md) | Company registry table |
| [DATA_COVERAGE.md](./DATA_COVERAGE.md) | Coverage metrics (regenerate with `data:coverage`) |

## Out of scope (by design)

- No database, auth, or user accounts
- No quantitative simulation — scenarios *restyle* the graph; they do not model shortages from capacity tables
- No automated test suite; the data validators are the main gate
