# Sources (Chip Sense)

Chip Sense mixes **sourced registry data** (companies, fabs, supply links) with **editorial graph structure** (tracks, categories, scenarios). Run `npm run check:data` before publishing; it runs all validators (`validate:sources`, `validate:companies`, `validate:trade`, `validate:scenarios`).

## Current sourcing status (2026-06)

| Dataset | File(s) | Records | Sourced? | Notes |
| --- | --- | ---: | --- | --- |
| Company registry | `src/data/companies.json`, `COMPANIES.md` | 25 | **Yes** | Each row: `sourced: true`, `source_url` (IR/SEC/annual report). Validated by `validate:companies`. |
| Fab / site pins | `src/data/fab-sites.json` | 33 | **Yes** | Each site: `source_ids[]` → `sources.json`. Merged at runtime in `geography.ts`. |
| Source catalog | `src/data/sources.json` | 33 | **Catalog** | Canonical URLs for citations; not auto-verified against live filings. |
| Supply relationships | `seed-graph.json` (`supplies` edges) | 10 | **Yes** | All cite `source_ids` (TSMC→fabless + Samsung→Qualcomm). |
| Equipment links | `seed-graph.json` (`equips` edges) | 18 | **Yes** | ASML/AMAT/Lam → TSMC, Intel, Samsung (cited). |
| Trade flows (Comtrade) | `trade-flows.json` | 8 | **Yes** | All flows have `value_usd_millions` (Comtrade preview + MOF/Census overrides for Taiwan). Re-fetch: `npm run fetch:trade`. |
| Packaging links | `seed-graph.json` (`packages` edges) | 15 | **Yes** | ASE/Amkor OSAT + TSMC in-house CoWoS; all cite `source_ids`. |
| Memory supply links | `seed-graph.json` (`memory_supply` edges) | 12 | **Yes** | HBM → NVIDIA/AMD; LPDDR → Qualcomm/Apple. |
| Assembly links | `seed-graph.json` (`assembles` edges) | 6 | **Yes** | Foxconn EMS → fabless/system customers. |
| Other graph edges | `seed-graph.json` + runtime geography | ~95+ | **Partial** | Role/category edges cited where added; many `hq_in` still uncited. |
| Scenarios `affects` | `seed-graph.json` → `scenarios[].affects` | 8 | **Declarative** | Explicit node/edge IDs for map styling (illustrative scenarios). |
| Country centroids | `src/data/countries.json` | 18 | Reference | Map pins; not tied to trade statistics. |
| Scenarios | `seed-graph.json` → `scenarios` | 9 | **Illustrative** | Assumptions for UI stress-testing, not forecasts. |
| Essay outline | `docs/essay-1.md` | — | Reference | Points at graph IDs; not primary research. |

**Validator output (typical):** 25 companies sourced · 12 essay-1 must-show companies · 80 cited fact blocks in `seed-graph.json` · 33 fab `source_id` refs.

---

## Canonical files

| Role | Path |
| --- | --- |
| Company HQ, specialization, operating countries | `src/data/companies.json` |
| Human table | `COMPANIES.md` |
| Fab coordinates + per-site citations | `src/data/fab-sites.json` |
| Citation catalog (`id`, `title`, `url`, `publisher`, `notes`) | `src/data/sources.json` |
| Graph nodes/edges/scenarios (seed) | `src/data/seed-graph.json` |
| Map rules + URL params | `MAP.md` |

**Runtime merge:** `loadGraph()` → `applyCompanyRecords()` → `applyGeography()` (`src/lib/graphQueries.ts`, `src/lib/geography.ts`). Fab `operates` / `located_in` edges and company `operates_in` edges are created here; some carry `source_ids` from company or fab records.

---

## What counts as “sourced” in this repo

1. **Registry (`companies.json`)** — `sourced: true` and a primary disclosure URL. Does not mean every `operating_countries[]` entry was manually checked in the latest filing.
2. **Fab (`fab-sites.json`)** — at least one `source_id` per site, usually operator IR/annual report.
3. **Graph claim (`seed-graph.json` edges)** — `facts.<key>.source_ids` must exist in `sources.json`. Validated only for facts **in the seed file** (not every runtime-generated edge).
4. **Scenarios** — explicitly **not** sourced; copy says illustrative.

---

## Cited equipment links (`equips`)

| Edge ID | Route | source_ids |
| --- | --- | --- |
| `e-asml-supplies-tsmc` | ASML → TSMC | `asml-annual-2024`, `tsmc-20f-2024` |
| `e-amat-supplies-tsmc` | Applied Materials → TSMC | `amat-10k-2024`, `tsmc-20f-2024` |
| `e-amat-supplies-intel` | Applied Materials → Intel | `amat-10k-2024`, `intel-10k-2024` |
| `e-lam-supplies-tsmc` | Lam Research → TSMC | `lam-10k-2024`, `tsmc-20f-2024` |
| `e-lam-supplies-samsung` | Lam Research → Samsung | `lam-10k-2024`, `samsung-ir-2024` |
| `e-asml-supplies-intel` | ASML → Intel | `asml-annual-2024`, `intel-10k-2024` |

## Trade flows (`trade-flows.json`)

Eight country-pair flows (HS 8542 / 8486, 2023). Five pulled from the Comtrade public preview API; three Taiwan-involved pairs use documented overrides when Comtrade returns no bilateral rows (`taiwan-mof-trade-2023`, `us-census-foreign-trade`, `taiwan-cbc-bop-2023`). Toggle **Trade flows** on the map (`?trade=1`); line width follows `value_usd_millions`.

### UN Comtrade use posture (free educational resource)

Chip Sense is offered **free of charge** as an open educational visualization. The baked-in trade layer is a **small curated set** (eight flows) for map teaching — not a Comtrade mirror, API, or bulk download.

| Intent | Practice in this repo |
| --- | --- |
| Visualize a few cited country-pair values | `trade-flows.json` + optional map layer |
| Credit the publisher | Catalog id `un-comtrade-plus`; cite UN Comtrade in essays/videos |
| Avoid bulk redistribution | Do not add features that stream or dump large Comtrade extracts |
| Stay free / non-commercial | Aligns with UN Comtrade FAQ examples for public educational visualization |

UN Comtrade materials remain subject to [UN Comtrade terms](https://comtradeplus.un.org/LicenseAgreement). If this project’s distribution model ever becomes paid or for-profit, revisit those terms (premium / re-dissemination guidance) before shipping. See also [NOTICE](./NOTICE).

## Cited foundry supply links (seed-graph)

| Edge ID | Relationship | Typical `source_ids` |
| --- | --- | --- |
| `e-tsmc-supplies-nvidia` | TSMC → NVIDIA | `nvidia-10k-2024`, `tsmc-20f-2024` |
| `e-tsmc-supplies-amd` | TSMC → AMD | `amd-10k-2024`, `tsmc-20f-2024` |
| `e-tsmc-supplies-apple` | TSMC → Apple | `apple-10k-2024`, `tsmc-20f-2024` |
| `e-tsmc-supplies-qualcomm` | TSMC → Qualcomm | `qualcomm-10k-2024`, `tsmc-20f-2024` |
| `e-tsmc-supplies-mediatek` | TSMC → MediaTek | `mediatek-annual-2024`, `tsmc-20f-2024` |
| `e-tsmc-supplies-broadcom` | TSMC → Broadcom | `broadcom-10k-2024`, `tsmc-20f-2024` |
| `e-samsung-supplies-qualcomm` | Samsung → Qualcomm | `qualcomm-10k-2024`, `samsung-ir-2024` |

---

## Source catalog IDs (`sources.json`)

Filing / IR (used by companies and fabs):

`tsmc-20f-2024`, `samsung-ir-2024`, `skhynix-annual-2024`, `micron-10k-2024`, `intel-10k-2024`, `nvidia-10k-2024`, `amd-10k-2024`, `apple-10k-2024`, `qualcomm-10k-2024`, `broadcom-10k-2024`, `mediatek-annual-2024`, `umc-financial-2024`, `gf-sec-2024`, `ase-20f-2024`, `amkor-10k-2024`, `asml-annual-2024`, `amat-10k-2024`, `lam-10k-2024`, `kla-10k-2024`, `tel-integrated-2024`, `foxconn-ir-2024`, `smic-annual-2024`, `ymtc-corporate-2024`, `cxmt-ipo-2025`, `huawei-annual-2024`

Reference / future research (in catalog; not required on every edge):

`sec-edgar`, `wikipedia-fab-list`, `un-comtrade-plus`, `natural-earth`, `maplibre-gl`

---

## Map / UI (not supply-chain facts)

| Asset | Source | Used in |
| --- | --- | --- |
| Basemap geometry | [Natural Earth](https://www.naturalearthdata.com/) 1:110m admin-0 countries (public domain), served tile-free from `public/basemap/world-countries.json` | `src/components/SupplyMap.tsx` |
| Map library | [MapLibre GL JS](https://maplibre.org/) via `react-map-gl` (`maplibre-gl` in catalog) | `SupplyMap.tsx` |

Full third-party software notices: [NOTICE](./NOTICE).

---

## Not collected yet (recommended next sources)

- **WSTS / SIA** — product-category revenue (for track narratives)
- **Per-site capacity / node** — only where operator disclosures support it
- **Quantitative scenario impacts** — replace illustrative multipliers with cited ranges

**Already on the board (keep curated, don’t bulk-expand casually):** UN Comtrade–based trade flows (`trade-flows.json`, catalog `un-comtrade-plus`) and cited equipment supply edges (`equips`).

**Fab checklist (verify each site, don’t cite alone):** [Wikipedia list of semiconductor fabrication plants](https://en.wikipedia.org/wiki/List_of_semiconductor_fabrication_plants) (`wikipedia-fab-list`)

---

## How to add or extend citations

### New company

1. Add row to `src/data/companies.json` (`sourced`, `source_url`, `source_label`, countries, specialization).
2. Add matching `co-*` node in `seed-graph.json` with HQ coordinates if mapped.
3. Add entry to `sources.json` if new filing ID needed.
4. Update `COMPANIES.md`.
5. Run `npm run check:data`.

### New fab site

1. Add row to `fab-sites.json` with `source_ids`, `coordinates`, `company_id`.
2. Run `npm run check:data` — geography merge adds edges automatically.

### New equipment link

1. Add `equips` edge in `seed-graph.json` (same `facts` shape as `supplies`).
2. Run `npm run validate:sources`.

### New Comtrade trade flow

1. Add row to `src/data/trade-flows.json` with `exporter_country_id` / `importer_country_id` from `countries.json`.
2. Run `npm run validate:trade`.

### New supply or factual edge

1. Add edge to `seed-graph.json` with:

```json
"facts": {
  "note": {
    "source_ids": ["company-10k-2024", "other-source-id"],
    "source_label": "Short label",
    "notes": "What this edge supports, in one sentence."
  }
}
```

2. Ensure every `source_id` exists in `sources.json`.
3. Run `npm run validate:sources`.

### Suggested citation fields (catalog or fact notes)

- `source_label` — human-readable
- `url` — primary document
- `publisher` — e.g. SEC, company name
- `published_at` / `retrieved_at` — `YYYY-MM-DD` when known
- `notes` — what the source supports (HQ list vs fab address vs customer concentration)

---

## Validation commands

```bash
npm run validate:companies   # 25 companies, priority IDs, source_url
npm run validate:sources     # source_ids on seed-graph edge facts + fab sites
npm run validate:trade       # trade-flows.json
npm run check:data           # all validators
npm run data:coverage        # regenerate DATA_COVERAGE.md
```

---

## Related docs

- `NOTICE` — third-party software and data notices  
- `CITATION.cff` — how to cite this project  
- `docs/youtube-description.md` — video description template  
- `DATA_COVERAGE.md` — auto-generated matrix (companies × fabs × supply); run `npm run data:coverage`  
- `COMPANIES.md` — company table and essay-1 must-show list  
- `MAP.md` — what appears on the global board and URL parameters  
- `docs/essay-1.md` — essay mechanisms mapped to graph IDs (outline, not prose)
