# Scenarios & writing topics (Chip Sense)

This doc bridges the **map** (scenarios + connections in `src/data/seed-graph.json`) with **writing prompts** — angles to analyze and post about. Each scenario restyles the same graph (chokepoint / stressed / partial-relief / substitution rings and disrupted arcs); the writing prompt is the essay the map is built to support.

> All scenarios are **illustrative stress tests**, not forecasts. Document real sources before publishing any number as factual. Assumptions live in each scenario's `assumptions` block.

**Phase 4 writing workflow:** [docs/writing-cheat-sheet.md](./docs/writing-cheat-sheet.md) · Essay: [docs/essay-1.md](./docs/essay-1.md) · Scenario series: [docs/essay-scenarios.md](./docs/essay-scenarios.md)

---

## Connection types on the map

The map now draws four company-to-company (HQ → HQ) relationship layers, each toggleable:

| Layer | Edge `kind` | Color | What it shows |
| --- | --- | --- | --- |
| Foundry supply | `supplies` | accent (blue) | Foundry → fabless/IDM wafer supply (e.g. TSMC → NVIDIA) |
| Equipment | `equips` | purple | Tool vendor → fab operator (e.g. ASML → TSMC, ASML → SMIC) |
| Packaging / OSAT | `packages` | amber | OSAT → customer advanced packaging (e.g. ASE → NVIDIA) |
| HBM / memory | `memory_supply` | pink | Memory maker → accelerator (e.g. SK hynix → NVIDIA) |
| Assembly / EMS | `assembles` | teal | Systems assembler → brand (e.g. Foxconn → NVIDIA, Apple) |

Plus country → country `trade` arcs (Comtrade) as a separate layer.

Together these trace the full chain: **equipment → wafer (foundry) → memory (HBM) → packaging (OSAT) → assembly (EMS) → end product.**

---

## Active map scenarios (in `seed-graph.json`)

### 1. Baseline
Sourced registry + cited fab pins. The "normal" map. Use it to introduce the four chokepoints (fab, equipment, packaging, memory) before stressing any of them.

### 2. Constrained advanced packaging
**Map:** ASE / Amkor + Taiwan OSAT as chokepoints; TSMC → fabless arcs stressed.
**Writing prompt:** *"The bottleneck moved from the wafer to the package."* Why CoWoS / advanced packaging — not transistors — is the near-term limiter on AI accelerator supply, and who controls it.

### 3. Taiwan Strait disruption
**Map:** Taiwan wafer + packaging largely offline; TSMC → US-fabless arcs disrupted; CHIPS/allied fabs as partial relief; China fabs as limited substitution.
**Writing prompt:** *"What actually breaks if Taiwan goes dark."* Sequence the failure: which products stall first (leading-edge GPUs/CPUs), what partial relief exists, and why "just build fabs elsewhere" is an 18-month-plus answer.

### 4. HBM / memory supply crunch *(new)*
**Map:** SK hynix / Samsung / Micron as chokepoints; memory → NVIDIA/AMD arcs disrupted; NVIDIA & AMD stressed.
**Writing prompt:** *"AI is memory-bound."* How HBM allocation — not wafers — gates accelerator shipments, why HBM is a near-duopoly, and what Micron-as-the-only-US-source means strategically.

### 5. US–China export controls deepen *(new)*
**Map:** SMIC / Huawei / YMTC / CXMT as chokepoints; ASML → SMIC (DUV) arc disrupted; China fabs stressed.
**Writing prompt:** *"The toolchain is the leverage."* How export controls on a handful of equipment makers (ASML, AMAT, Lam, TEL, KLA) cap an entire country's leading edge — and the domestic-toolmaking response.

### 6. Korea memory disruption *(new)*
**Map:** Korea + Samsung + SK hynix as chokepoints; Micron as partial relief; CXMT/YMTC as limited substitution; HBM arcs disrupted.
**Writing prompt:** *"The other Asian single point of failure."* Taiwan dominates logic; Korea dominates memory. What a Korea shock does to DRAM/NAND/HBM simultaneously, and why memory concentration gets less attention than it should.

### 7. Japan toolchain & materials shock *(new)*
**Map:** Tokyo Electron + Japan as chokepoints; TEL → TSMC/Samsung equipment arcs stressed; leading-edge fabs stressed.
**Writing prompt:** *"The inputs nobody maps."* Japan's quiet dominance in photoresist, specialty chemicals and coat/develop tools — and how a single-country materials shock would slow every advanced fab on earth at once.

### 8. Mature-node overcapacity glut *(new)*
**Map:** UMC, GlobalFoundries, SMIC (and their fabs) stressed; leading edge untouched.
**Writing prompt:** *"The other China chip risk isn't the leading edge."* How a flood of subsidized mature-node capacity could collapse margins on the legacy chips that run cars and appliances — a price war, not a shortage.

### 9. US CHIPS buildout matures *(new, resilience)*
**Map:** TSMC Arizona, Samsung Taylor, Intel Oregon, SK hynix Indiana as partial relief; Amkor as substitution buffer; key TSMC → fabless arcs shown as buffered.
**Writing prompt:** *"Did the CHIPS Act actually de-risk anything?"* Score the onshoring bet: which links genuinely gain a domestic buffer (logic, packaging) versus where concentration in Taiwan/Korea persists.

---

## Writer URLs (bookmarkable views)

Paste these straight into a draft. Base URL: `https://chip-sense-ten.vercel.app`. All work as relative paths in local dev too. Layer flags: `supply` / `equips` / `pkg` / `mem` / `asm` (set `=0` to hide), `trade=1` for country arcs, `node=` to preselect, `essay1=1` for the clean teaching pins.

| Scenario | View | URL |
| --- | --- | --- |
| Baseline | Clean teaching pins | `/?essay1=1` |
| Baseline | Full board | `/` |
| Constrained packaging | ASE as chokepoint | `/?scenario=constrained-packaging&node=co-ase` |
| Constrained packaging | Packaging layer only | `/?scenario=constrained-packaging&supply=0&equips=0&mem=0&asm=0` |
| Constrained packaging | GPU track lens | `/track/gpus?scenario=constrained-packaging` |
| Taiwan Strait disruption | TSMC selected | `/?scenario=taiwan-crisis&node=co-tsmc` |
| Taiwan Strait disruption | With trade arcs | `/?scenario=taiwan-crisis&trade=1` |
| Taiwan Strait disruption | GPU track lens | `/track/gpus?scenario=taiwan-crisis` |
| HBM / memory crunch | SK hynix selected | `/?scenario=hbm-shortage&node=co-sk-hynix` |
| HBM / memory crunch | NVIDIA (downstream) | `/?scenario=hbm-shortage&node=co-nvidia` |
| HBM / memory crunch | GPU track lens | `/track/gpus?scenario=hbm-shortage` |
| Export controls deepen | SMIC selected | `/?scenario=export-controls&node=co-smic` |
| Export controls deepen | Huawei selected | `/?scenario=export-controls&node=co-huawei` |
| Export controls deepen | CPU track lens | `/track/cpus?scenario=export-controls` |
| Korea memory disruption | SK hynix selected | `/?scenario=korea-memory-shock&node=co-sk-hynix` |
| Korea memory disruption | Micron (relief) | `/?scenario=korea-memory-shock&node=co-micron` |
| Korea memory disruption | Memory track lens | `/track/memory?scenario=korea-memory-shock` |
| Japan toolchain shock | Tokyo Electron selected | `/?scenario=japan-toolchain-shock&node=co-tel` |
| Japan toolchain shock | Equipment layer only | `/?scenario=japan-toolchain-shock&supply=0&pkg=0&mem=0&asm=0` |
| Japan toolchain shock | CPU track lens | `/track/cpus?scenario=japan-toolchain-shock` |
| Mature-node glut | UMC selected | `/?scenario=mature-node-glut&node=co-umc` |
| Mature-node glut | GlobalFoundries selected | `/?scenario=mature-node-glut&node=co-globalfoundries` |
| US CHIPS buildout | TSMC Arizona pin | `/?scenario=us-chips-buildout&node=fab-tsmc-az` |
| US CHIPS buildout | Amkor (buffer) | `/?scenario=us-chips-buildout&node=co-amkor` |
| US CHIPS buildout | GPU track lens | `/track/gpus?scenario=us-chips-buildout` |

---

## Connection-driven writing topics (no new scenario required)

These come straight from the relationship arcs already on the map:

1. **The fabless ↔ foundry dependency** — Why the most valuable design houses (NVIDIA, Apple, AMD) own no fabs, and how that concentrates risk in Taiwan.
2. **ASML's EUV monopoly** — One Dutch company gates the leading edge for everyone, and is the single most powerful node in export-control policy.
3. **The "quiet" equipment oligopoly** — ASML + AMAT + Lam + KLA + TEL. Map how few firms touch every fab on earth.
4. **DUV-to-SMIC** — What China *can* still buy, and how it stretches mature tools toward advanced results.
5. **HBM as the new oil** — The SK hynix → NVIDIA arc as the defining supply relationship of the AI era.
6. **Advanced packaging onshoring** — Amkor + TSMC Arizona: can the US package what it fabs?
7. **Mature-node overcapacity** — UMC, GlobalFoundries, SMIC and the coming glut in trailing-edge chips (autos, industrial).
8. **Memory as a cycle business** — Why Micron survived decades of boom/bust and what HBM does to the cycle.
9. **The assembly layer (Foxconn)** — Where chips become systems: the EMS giants, AI-server assembly, and the China → India/Vietnam/Mexico shift.
10. **The full chain in one view** — Walk equipment → wafer → memory → packaging → assembly and show how each layer has its own chokepoint and its own geography.

---

## Adding a new scenario

1. Add an object to `scenarios[]` in `src/data/seed-graph.json` with `id`, `label`, `description`, `assumptions`, and an `affects` block referencing real node/edge ids. Optionally add a `narrative` block (`{ title, bullets[] }`) with 2–4 grounded reader sentences — keep illustrative numbers labeled as such.
2. Affects keys: `chokepoint_node_ids`, `stressed_node_ids`, `partial_relief_node_ids`, `substitution_buffer_node_ids`, `disrupted_edge_ids`, `stressed_edge_ids`, `buffered_edge_ids`.
3. The generic engine in `src/lib/scenarioEffects.ts` styles the map and builds the impact list automatically, using your `narrative` block in the panel when present (otherwise it falls back to the description); `taiwan-crisis` and `constrained-packaging` also have bespoke computed logic.
4. Run `npm run check:data`.
5. Share via URL: `/?scenario=hbm-shortage` (add `pkg=0` / `mem=0` to hide layers, `node=co-sk-hynix` to preselect).
