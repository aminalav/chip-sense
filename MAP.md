# Map visibility rules

The **global board** at `/` and **track lenses** (`/?track=…` or `/track/[slug]`) use the same graph; only filters change.

## What appears by default

| Layer | Source | Shown by default? |
| --- | --- | --- |
| Companies (HQ) | `companies.json` → merged into graph | Yes (registry only) |
| Fab sites | `fab-sites.json` → merged at runtime | Yes |
| Countries | `countries.json` + seed graph | Yes (if coordinates) |
| Ops / presence pins | Generated when a company operates in a country without a fab pin | **No** — enable “Show ops pins” |
| Product categories / end markets | Seed graph | No (no map coordinates) |

## Pin colors (by company segment)

Company, fab, and ops pins are colored by **segment** (`segment` field in `companies.json`, mapped in `src/lib/segments.ts`). Countries stay neutral gray.

| Color | Group | Segments |
| --- | --- | --- |
| 🔴 Red | Manufacturer | foundry, IDM, memory |
| 🔵 Blue | Fabless | fabless (chip design) |
| 🟢 Green | Equipment / tooling | equipment |
| 🟠 Amber | OSAT / packaging | osat |
| 🟣 Purple | EMS / assembly | ems |

Shape cues are unchanged: HQ pins are ringed, fab pins solid, ops pins smaller, core supply chain view pins get an amber ring (`?essay1=1`), active countries get a sky ring, and scenario styling adds chokepoint/stress rings on top.

## Interaction

- **Hover** a pin → popup with name, segment, location, founding year, and a short profile paragraph.
- **Click** a pin → full profile (paragraph + specialization + HQ + operating countries + source) and connected edges in the sidebar.
- **Click** a connection arc → edge facts + citations in the sidebar.

## Connection arcs (company HQ → HQ)

| Toggle | Edge `kind` | Color |
| --- | --- | --- |
| Foundry supply | `supplies` | accent (blue) |
| Equipment | `equips` | purple |
| Packaging | `packages` | amber |
| HBM / memory | `memory_supply` | pink |
| Assembly | `assembles` | teal |
| Trade flows | (Comtrade) | indigo (country → country) |

See `SCENARIOS.md` for the relationship list and writing prompts.

## Shareable URL parameters

| Param | Example | Meaning |
| --- | --- | --- |
| `track` | `gpus` | Home board only — editorial lens (track pages use `/track/gpus`) |
| `scenario` | `taiwan-crisis` | Non-baseline scenario (`hbm-shortage`, `export-controls`, `korea-memory-shock`, `constrained-packaging`) |
| `essay1` | `1` | Core supply chain view (teaching filter) |
| `ops` | `1` | Show country-level ops pins |
| `supply` | `0` | Hide foundry supply arcs |
| `equips` | `0` | Hide equipment arcs |
| `pkg` | `0` | Hide packaging / OSAT arcs |
| `mem` | `0` | Hide HBM / memory arcs |
| `asm` | `0` | Hide assembly / EMS arcs |
| `trade` | `1` | Show Comtrade country trade arcs |
| `focus` | `1` | Dim pins not connected to visible arcs (see How to read this map) |
| `node` | `co-tsmc` | Selected pin (sidebar detail) |
| `edge` | `e-tsmc-supplies-nvidia` | Selected edge (sidebar detail) |

Example: `/?scenario=hbm-shortage&node=co-sk-hynix`

## Map toggles (UI)

- **Core supply chain view** — teaching filter (`essay1=1`): twelve anchor companies, key fabs, and essay countries (TW/CN/US/KR via `companyRecords.ts`). Amber ring on core pins.
- **Focus on visible connections** — (`focus=1`) dims pins that are not endpoints of visible arcs, fab sites for those companies, or trade-flow countries.
- **Supply links** — `supplies` edges between company HQs (cited edges use track/global accent).
- **Scenario** — Non-baseline scenarios restyle pins and supply arcs (`scenarioEffects.ts`); assumptions live in `seed-graph.json` → `scenarios`.
- **Track lens** — Filters nodes and edges whose `tracks` array includes that slug.

## Adding a new site

1. Add row to `fab-sites.json` with `source_ids`.
2. Run `npm run check:data`.
3. Geography merge creates `operates` + `located_in` edges automatically.

## Adding a supply relationship

1. Add `supplies` edge in `seed-graph.json` with `facts.note.source_ids`.
2. Run `npm run validate:sources`.
