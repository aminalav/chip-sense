# Essay 1 — U.S.–China–Taiwan tension and the semiconductor supply chain

## Thesis (draft)

A severe Taiwan Strait disruption would first break **leading-edge logic and advanced packaging** (concentrated in Taiwan), then propagate through **fabless US and allied chip designers** before memory, equipment, and China-domestic alternatives absorb part of the shock.

## Mechanism 1 — Taiwan foundry chokepoint

**Claim:** TSMC (and Taiwan OSAT/packaging) sit on the critical path between US/EU fabless designers and finished leading-edge silicon.

**Map edges (cited in `seed-graph.json`):**

| Supplier | Customer | Source IDs |
| --- | --- | --- |
| TSMC | NVIDIA | `nvidia-10k-2024`, `tsmc-20f-2024` |
| TSMC | AMD | `amd-10k-2024`, `tsmc-20f-2024` |
| TSMC | Apple | `apple-10k-2024`, `tsmc-20f-2024` |
| TSMC | Qualcomm | `qualcomm-10k-2024`, `tsmc-20f-2024` |
| TSMC | MediaTek | `mediatek-annual-2024`, `tsmc-20f-2024` |
| TSMC | Broadcom | `broadcom-10k-2024`, `tsmc-20f-2024` |

**Fab pins to cite:** Tainan cluster, Arizona (Fab 21), Kumamoto (JASM).

## Mechanism 2 — China footprint (dual supply base)

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
| YMTC | `co-ymtc`, `fab-ymtc-wuhan` (Wuhan East Lake campus) | `ymtc-corporate-2024` |
| CXMT | `co-cxmt`, `fab-cxmt-hefei` | `cxmt-ipo-2025` |

**Writing angle:** Mechanism 1 hits **Taiwan output**; Mechanism 2 asks whether **China-based capacity** can backfill US/allied designers—or whether controls and distrust cap that substitution.

## Mechanism 3 — US / allied equipment & reshoring

**Claim:** Even with CHIPS Act fabs coming online, **EUV lithography (ASML)** and **US wafer-fab equipment** (Applied Materials, Lam Research) keep allied greenfield tied to export licenses and Netherlands/US policy. Reshoring shifts **some** trailing and leading-edge **geography** but not the Taiwan share of leading-edge **volume** before the illustrative `taiwan-crisis` scenario horizon.

**Equipment choke (graph nodes):**

| Node | HQ | Essay role | Cited edge |
| --- | --- | --- | --- |
| `co-asml` | Netherlands | EUV monopoly; China export rules | `e-asml-equipment` |
| `co-applied-materials` | United States | WFE installed base | `e-amat-equipment` |
| `co-lam-research` | United States | Etch / deposition tools | `e-lam-equipment` |
| `co-ase` | Taiwan | OSAT / advanced packaging | `e-ase-osat` |

**CHIPS / allied fab pins (cited on map):**

| Site ID | Label | Source |
| --- | --- | --- |
| `fab-tsmc-az` | TSMC Arizona (Fab 21) | `tsmc-20f-2024` |
| `fab-samsung-taylor` | Samsung Taylor, Texas | `samsung-ir-2024` |
| `fab-intel-or` | Intel Oregon | `intel-10k-2024` |
| `fab-sk-hynix-indiana` | SK hynix West Lafayette (planned) | `skhynix-annual-2024` |
| `fab-micron-*` (US expansion per 10-K) | Micron US projects | `micron-10k-2024` |

**Equipment links on map (`equips` edges):** ASML → TSMC, AMAT → TSMC/Intel, Lam → TSMC/Samsung (cited in `seed-graph.json`). Toggle **Equipment** on the board.

**Trade context:** Country trade arcs from `trade-flows.json` (Comtrade catalog ID); ranks until `value_usd_millions` populated from Comtrade Plus.

**Scenario (app):** Select **Taiwan Strait disruption (illustrative)** — styling driven by `scenarios[].affects` in `seed-graph.json` plus assumption copy in the sidebar.

## Must-show on map

Companies: TSMC, Samsung, SK Hynix, Micron, Intel, NVIDIA, AMD, Apple, ASML, SMIC, UMC, ASE.

Countries: Taiwan, China, United States, South Korea.
