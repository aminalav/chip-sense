# Essay 1 — U.S.–China–Taiwan tension and the semiconductor supply chain

## Thesis (draft)

A severe Taiwan Strait disruption would first break **leading-edge logic and advanced packaging** (concentrated in Taiwan), then propagate through **fabless US and allied chip designers** before memory, equipment, and China-domestic alternatives absorb part of the shock.

**Interactive board:** [chip-sense-ten.vercel.app](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc&trade=1)

---

## Writing queue (Phase 4)

Five pieces to draft from the map. Full briefs (layers, trade toggle, screenshot names): [writing-cheat-sheet.md](./writing-cheat-sheet.md).

| # | Working title | Scenario | Board link |
| --- | --- | --- | --- |
| 1 | Four chokepoints on one map | Baseline | [/?essay1=1&trade=1](https://chip-sense-ten.vercel.app/?essay1=1&trade=1) |
| 2 | What breaks if Taiwan goes dark | `taiwan-crisis` | [/?scenario=taiwan-crisis&node=co-tsmc&trade=1](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc&trade=1) |
| 3 | AI is memory-bound (HBM) | `hbm-shortage` | [/?scenario=hbm-shortage&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0) |
| 4 | The bottleneck moved to the package | `constrained-packaging` | [/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0) |
| 5 | The toolchain is the leverage | `export-controls` | [/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0) |

---

## Piece 1 — Intro: the full chain (draft outline)

**Opening move:** Walk the stack left to right on the map — equipment → foundry → memory → packaging → assembly — and name one chokepoint per layer.

**Map setup:** Baseline, essay-1 pins, trade flows on. Export PNG: `chip-sense-01-baseline-chain.png`.

**Chain to cite:**

| Step | Layer | Example edge | Map link |
| --- | --- | --- | --- |
| Tools | Equipment | ASML → TSMC (`e-asml-supplies-tsmc`) | [/?node=co-asml](https://chip-sense-ten.vercel.app/?node=co-asml) |
| Wafers | Foundry | TSMC → NVIDIA (`e-tsmc-supplies-nvidia`) | [/?node=co-tsmc](https://chip-sense-ten.vercel.app/?node=co-tsmc) |
| Memory | HBM / LPDDR | SK hynix → NVIDIA (`e-skhynix-memory-nvidia`) | [/?mem=1&supply=0&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?mem=1&supply=0&equips=0&pkg=0&asm=0&node=co-sk-hynix) |
| Package | CoWoS / OSAT | TSMC → NVIDIA (`e-tsmc-packages-nvidia`) | [/?pkg=1&supply=0&node=co-ase](https://chip-sense-ten.vercel.app/?pkg=1&supply=0&equips=0&mem=0&asm=0&node=co-ase) |
| Systems | EMS | Foxconn → NVIDIA (`e-foxconn-assembles-nvidia`) | [/?asm=1&supply=0&node=co-foxconn](https://chip-sense-ten.vercel.app/?asm=1&supply=0&equips=0&pkg=0&mem=0&node=co-foxconn) |

**Draft paragraph (stub):** *Every AI accelerator on the market crosses at least five geographic chokepoints before it reaches a data center. The board makes that chain visible: Dutch lithography into Taiwanese fabs, Korean memory co-packaged with American GPU designs, Taiwan OSAT and TSMC CoWoS finishing the silicon, and Foxconn-class EMS turning chips into rack-scale systems.*

---

## Piece 2 — Taiwan Strait disruption (this essay's core)

**Map setup:** Scenario **Taiwan Strait disruption**, TSMC selected, trade flows on. GPU track lens for a tighter view: [/track/gpus?scenario=taiwan-crisis&node=co-tsmc](https://chip-sense-ten.vercel.app/track/gpus?scenario=taiwan-crisis&node=co-tsmc). Export PNG: `chip-sense-02-taiwan-crisis.png`.

**Draft paragraph (stub):** *Illustrative scenario styling — not a forecast — models Taiwan wafer output at ~10% and packaging at ~25% of baseline. On the map, cited TSMC → US fabless arcs turn red first; CHIPS fabs in Arizona and Kumamoto show as partial relief, not replacement.*

### Mechanism 1 — Taiwan foundry chokepoint

**Claim:** TSMC (and Taiwan OSAT/packaging) sit on the critical path between US/EU fabless designers and finished leading-edge silicon.

**Map edges (cited in `seed-graph.json`):**

| Supplier | Customer | Edge ID | Source IDs |
| --- | --- | --- | --- |
| TSMC | NVIDIA | `e-tsmc-supplies-nvidia` | `nvidia-10k-2024`, `tsmc-20f-2024` |
| TSMC | AMD | `e-tsmc-supplies-amd` | `amd-10k-2024`, `tsmc-20f-2024` |
| TSMC | Apple | `e-tsmc-supplies-apple` | `apple-10k-2024`, `tsmc-20f-2024` |
| TSMC | Qualcomm | `e-tsmc-supplies-qualcomm` | `qualcomm-10k-2024`, `tsmc-20f-2024` |
| TSMC | MediaTek | `e-tsmc-supplies-mediatek` | `mediatek-annual-2024`, `tsmc-20f-2024` |
| TSMC | Broadcom | `e-tsmc-supplies-broadcom` | `broadcom-10k-2024`, `tsmc-20f-2024` |

**Fab pins to cite:** Tainan cluster (`fab-tsmc-sc`), Arizona Fab 21 (`fab-tsmc-az`), Kumamoto JASM (`fab-tsmc-jp`).

**Board link:** [/?scenario=taiwan-crisis&node=co-tsmc&edge=e-tsmc-supplies-nvidia](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc&edge=e-tsmc-supplies-nvidia)

### Mechanism 2 — China footprint (dual supply base)

**Claim:** China is simultaneously a **manufacturing host** for foreign memory/OSAT/foundry assets and a **domestic substitution lane** (SMIC logic, YMTC/CXMT memory). Tension raises **operational risk** at foreign-owned China fabs and **technology-control risk** for anything shipped in or out.

**Foreign-owned / Taiwan-linked pins on map (`fab-sites.json`):**

| Site ID | Operator | Role in essay |
| --- | --- | --- |
| `fab-samsung-xian` | Samsung | NAND in China; export-control / supply-chain bifurcation |
| `fab-sk-hynix-wuxi` | SK hynix | DRAM packaging/assembly in China |
| `fab-intel-chengdu` | Intel | Mature-node assembly/test (not leading-edge) |
| `fab-umc-suzhou` | UMC | Trailing/mid foundry in China |
| `fab-ase-shanghai` | ASE | OSAT in China |

**Domestic China anchors:**

| Company | Map / registry | Sources |
| --- | --- | --- |
| SMIC | `co-smic`, `fab-smic-shanghai`, `fab-smic-beijing` | `smic-annual-2024` |
| YMTC | `co-ymtc`, `fab-ymtc-wuhan` | `ymtc-corporate-2024` |
| CXMT | `co-cxmt`, `fab-cxmt-hefei` | `cxmt-ipo-2025` |

**Writing angle:** Mechanism 1 hits **Taiwan output**; Mechanism 2 asks whether **China-based capacity** can backfill US/allied designers — or whether controls and distrust cap that substitution. Map: [/?scenario=taiwan-crisis&node=co-smic](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-smic)

### Mechanism 3 — US / allied equipment & reshoring

**Claim:** Even with CHIPS Act fabs coming online, **EUV lithography (ASML)** and **US wafer-fab equipment** (Applied Materials, Lam Research) keep allied greenfield tied to export licenses and Netherlands/US policy. Reshoring shifts **some** trailing and leading-edge **geography** but not the Taiwan share of leading-edge **volume** before the illustrative `taiwan-crisis` scenario horizon.

**Equipment choke (graph nodes):**

| Node | HQ | Essay role | Cited edge |
| --- | --- | --- | --- |
| `co-asml` | Netherlands | EUV monopoly; China export rules | `e-asml-supplies-tsmc` |
| `co-applied-materials` | United States | WFE installed base | `e-amat-supplies-tsmc` |
| `co-lam-research` | United States | Etch / deposition tools | `e-lam-supplies-tsmc` |
| `co-ase` | Taiwan | OSAT / advanced packaging | `e-ase-packages-nvidia` |

**CHIPS / allied fab pins (cited on map):**

| Site ID | Label | Source |
| --- | --- | --- |
| `fab-tsmc-az` | TSMC Arizona (Fab 21) | `tsmc-20f-2024` |
| `fab-samsung-taylor` | Samsung Taylor, Texas | `samsung-ir-2024` |
| `fab-intel-or` | Intel Oregon | `intel-10k-2024` |
| `fab-sk-hynix-indiana` | SK hynix West Lafayette | `skhynix-annual-2024` |

**Equipment links on map:** Toggle **Equipment** on the board — ASML/AMAT/Lam → TSMC, Intel, Samsung (all cited in `seed-graph.json`).

**Trade context:** Country trade arcs from `trade-flows.json`; toggle with `?trade=1`. Taiwan → US chip flow uses Census override — see trade-flow notes in the panel.

**Scenario (app):** [Taiwan Strait disruption](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&trade=1) — styling from `scenarios[].affects` plus sidebar narrative.

---

## Piece 3 — HBM crunch (standalone post outline)

**Thesis:** HBM co-packaging makes memory makers the binding constraint on AI accelerators — not the foundry.

**Map:** [/?scenario=hbm-shortage&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0) · Memory layer only · Trade off · Export: `chip-sense-03-hbm-shortage.png`

**Highlight:** `e-skhynix-memory-nvidia`, `e-micron-memory-nvidia` (disrupted in scenario); Micron as sole US HBM source.

**Draft paragraph (stub):** *When SK hynix, Samsung and Micron are chokepoints and their HBM arcs to NVIDIA turn red, the story is allocation — who gets stacks, not who gets wafers.*

---

## Piece 4 — Packaging bottleneck (standalone post outline)

**Thesis:** CoWoS at TSMC and OSAT at ASE/Amkor — not transistor yield — is the near-term AI supply limiter.

**Map:** [/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0) · Packaging layer only · Export: `chip-sense-04-packaging.png`

**Highlight:** `e-tsmc-packages-nvidia`, `e-ase-packages-nvidia`, `e-amkor-packages-nvidia`.

**Draft paragraph (stub):** *The constrained-packaging scenario stresses TSMC CoWoS arcs alongside ASE and Amkor — the map shows packaging as a parallel chokepoint to the foundry, not an afterthought.*

---

## Piece 5 — Export controls (standalone post outline)

**Thesis:** Policy on five equipment makers caps China's leading edge without bombing a fab.

**Map:** [/?scenario=export-controls&node=co-smic](https://chip-sense-ten.vercel.app/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0) · Equipment layer · Export: `chip-sense-05-export-controls.png`

**Highlight:** `e-asml-supplies-smic` (disrupted); SMIC, Huawei, YMTC, CXMT as chokepoints.

**Draft paragraph (stub):** *Export controls are a scenario about access, not destruction — the ASML → SMIC arc breaks while China fabs stay on the map as stressed nodes.*

---

## Must-show on map

Companies: TSMC, Samsung, SK Hynix, Micron, Intel, NVIDIA, AMD, Apple, ASML, SMIC, UMC, ASE.

Countries: Taiwan, China, United States, South Korea.

**Clean teaching view:** [/?essay1=1](https://chip-sense-ten.vercel.app/?essay1=1)
