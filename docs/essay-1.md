# Essay 1 — U.S.–China–Taiwan tension and the semiconductor supply chain

## Thesis (draft)

A severe Taiwan Strait disruption would first break **leading-edge logic and advanced packaging** (concentrated in Taiwan), then propagate through **fabless US and allied chip designers** before memory, equipment, and China-domestic alternatives absorb part of the shock.

**Interactive board:** [chip-sense-ten.vercel.app](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc&trade=1)

---

## Writing queue (Phase 4)

Five pieces to draft from the map. Full briefs (layers, trade toggle, screenshot names): [writing-cheat-sheet.md](./writing-cheat-sheet.md).

**Status:** Briefs complete · **Draft prose below** (edit in place, then export map screenshots per cheat sheet).

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

### Draft (ready to edit)

Open the [baseline teaching view with trade flows](https://chip-sense-ten.vercel.app/?essay1=1&trade=1). The map is not a corporate org chart — each colored arc is a *typed* supply relationship with filing citations behind it. Equipment (purple) is tools sold into fabs. Foundry supply (blue) is wafer output sold to fabless designers. Memory (pink) is DRAM/HBM sold into accelerators and handsets. Packaging (amber) is OSAT or in-house CoWoS finishing the die. Assembly (teal) is EMS building finished systems.

Walk one product through the stack. Start at [ASML → TSMC](https://chip-sense-ten.vercel.app/?node=co-asml&edge=e-asml-supplies-tsmc): EUV lithography gates every leading-edge node TSMC runs. Follow [TSMC → NVIDIA](https://chip-sense-ten.vercel.app/?node=co-tsmc&edge=e-tsmc-supplies-nvidia) for the wafer itself — NVIDIA designs, TSMC fabricates, per both companies' SEC filings. The GPU is useless without [SK hynix → NVIDIA](https://chip-sense-ten.vercel.app/?scenario=baseline&mem=1&supply=0&equips=0&pkg=0&asm=0&node=co-sk-hynix) HBM stacks co-packaged on the die. TSMC also [packages for NVIDIA](https://chip-sense-ten.vercel.app/?pkg=1&supply=0&equips=0&mem=0&asm=0&node=co-tsmc) through CoWoS — a second chokepoint at the same company. Finally [Foxconn → NVIDIA](https://chip-sense-ten.vercel.app/?asm=1&supply=0&equips=0&pkg=0&mem=0&node=co-foxconn) turns silicon into AI servers.

The point of the intro piece is geographic: **each layer has its own country concentration**. Netherlands for lithography, Taiwan for foundry and much packaging, Korea for memory, Taiwan/Philippines/US for OSAT, China/Vietnam for EMS — before the chip ever reaches a US data center. Trade arcs (indigo country lines) show the macro flows; company arcs show who actually sells to whom.

---

## Piece 2 — Taiwan Strait disruption (this essay's core)

**Map setup:** Scenario **Taiwan Strait disruption**, TSMC selected, trade flows on. GPU track lens for a tighter view: [/track/gpus?scenario=taiwan-crisis&node=co-tsmc](https://chip-sense-ten.vercel.app/track/gpus?scenario=taiwan-crisis&node=co-tsmc). Export PNG: `chip-sense-02-taiwan-crisis.png`.

**Draft paragraph (stub):** *Illustrative scenario styling — not a forecast — models Taiwan wafer output at ~10% and packaging at ~25% of baseline. On the map, cited TSMC → US fabless arcs turn red first; CHIPS fabs in Arizona and Kumamoto show as partial relief, not replacement.*

### Draft — opening

Select [Taiwan Strait disruption](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc&trade=1) on the board. The sidebar states plainly that this is an illustrative stress test, not a forecast — but it forces a useful question: **if Taiwan's output collapses, what actually stalls first?** On the map, the answer is visible before any spreadsheet: cited TSMC → US fabless arcs turn red (disrupted), Taiwan fab pins ring as chokepoints, and CHIPS-era fabs in Arizona, Kumamoto, and Taylor appear as green partial-relief pins — not replacements.

The scenario assumes Taiwan wafer output at roughly 10% of baseline and packaging at 25%. Those multipliers are essay knobs, not sourced predictions. What *is* sourced is the dependency structure: NVIDIA, Apple, AMD, Qualcomm, MediaTek, and Broadcom all disclose TSMC as a foundry partner ([see edges in Mechanism 1](#mechanism-1--taiwan-foundry-chokepoint)). The shock propagates through those arcs first.

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

**Draft:** Click the [TSMC → NVIDIA supply arc](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&edge=e-tsmc-supplies-nvidia) in the scenario. The edge panel cites both companies' filings — this is not inferred contact, it is disclosed supplier relationship. Repeat for Apple, AMD, and the other fabless customers in the table. Leading-edge GPUs and phone SoCs stall together because they share the same foundry geography, not because they share a product market.

Zoom to fab pins: [Tainan (`fab-tsmc-sc`)](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=fab-tsmc-sc) is the southern Taiwan cluster where much leading-edge volume lives. Compare to [Arizona Fab 21](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=fab-tsmc-az) — partial relief styling, same operator, different scale and ramp timeline. The essay claim: **geography shifts slowly; concentration breaks fast.**

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

**Draft:** Taiwan and China are not interchangeable on the map. Foreign-owned China fabs — [Samsung Xi'an NAND](https://chip-sense-ten.vercel.app/?node=fab-samsung-xian), [SK hynix Wuxi](https://chip-sense-ten.vercel.app/?node=fab-sk-hynix-wuxi), [ASE Shanghai](https://chip-sense-ten.vercel.app/?node=fab-ase-shanghai) — are manufacturing *inside* China, subject to operational and geopolitical risk, not a drop-in substitute for Taiwan leading-edge logic. Domestic champions (SMIC, YMTC, CXMT) appear as cyan substitution-buffer styling in the Taiwan scenario — limited trailing/mid capability under export controls, not a NVIDIA-grade backfill. The dual nature of China on the map — host and competitor — is the second axis of the essay.

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

**Draft — closing:** Reshoring changes the map at the margins. [TSMC Arizona](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=fab-tsmc-az), [Samsung Taylor](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=fab-samsung-taylor), and [Intel Oregon](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=fab-intel-or) are real pins with real citations — but the scenario's ~18-month fabless recovery horizon in the assumptions is a reminder that **building a fab is not the same as replacing Taiwan's share of leading-edge volume**. Equipment dependence persists: [ASML → TSMC](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&edge=e-asml-supplies-tsmc) arcs stress orange even when fabs exist, because tools and licenses follow their own chokepoints. Toggle [trade flows](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&trade=1) to ground the macro: Taiwan → US chip trade is one of the largest bilateral flows on the board — the economic backdrop to the security story.

---

## Piece 3 — HBM crunch (standalone post outline)

**Thesis:** HBM co-packaging makes memory makers the binding constraint on AI accelerators — not the foundry.

**Map:** [/?scenario=hbm-shortage&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0) · Memory layer only · Trade off · Export: `chip-sense-03-hbm-shortage.png`

**Highlight:** `e-skhynix-memory-nvidia`, `e-micron-memory-nvidia` (disrupted in scenario); Micron as sole US HBM source.

**Draft paragraph (stub):** *When SK hynix, Samsung and Micron are chokepoints and their HBM arcs to NVIDIA turn red, the story is allocation — who gets stacks, not who gets wafers.*

### Draft (standalone post)

Open [HBM shortage on the GPU track](https://chip-sense-ten.vercel.app/track/gpus?scenario=hbm-shortage&node=co-sk-hynix). Hide foundry and equipment layers so only pink memory arcs remain — the map tells a different story than a Taiwan crisis: **the GPU die can exist and still not ship** if HBM stacks are rationed.

Only three companies supply HBM at scale: SK hynix, Samsung, and Micron ([memory_supply edges to NVIDIA and AMD](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&mem=1&supply=0&equips=0&pkg=0&asm=0)). Click [SK hynix → NVIDIA](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&edge=e-skhynix-memory-nvidia) — the panel cites both annual filings. HBM is co-packaged with the accelerator; memory yield and stack capacity cap shipments downstream of TSMC. Micron is the sole US-headquartered source in that trio — a strategic fact visible as a pin in Idaho, Hiroshima, and Taichung, not just a trade statistic.

The scenario marks memory makers as chokepoints and turns HBM arcs red. NVIDIA and AMD pins stress orange as downstream victims. The illustrative ~70% supply-vs-demand knob in the sidebar is not a market forecast; it names the direction of the bind. **The writing move:** when AI headlines talk about "fab capacity," ask whether the binding constraint is wafer, package, or memory — and use the layer toggles to show each answer.

---

## Piece 4 — Packaging bottleneck (standalone post outline)

**Thesis:** CoWoS at TSMC and OSAT at ASE/Amkor — not transistor yield — is the near-term AI supply limiter.

**Map:** [/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0) · Packaging layer only · Export: `chip-sense-04-packaging.png`

**Highlight:** `e-tsmc-packages-nvidia`, `e-ase-packages-nvidia`, `e-amkor-packages-nvidia`.

**Draft paragraph (stub):** *The constrained-packaging scenario stresses TSMC CoWoS arcs alongside ASE and Amkor — the map shows packaging as a parallel chokepoint to the foundry, not an afterthought.*

### Draft (standalone post)

Open [constrained packaging — packaging layer only](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0). Amber arcs are OSAT and in-house advanced packaging — a layer that barely existed in supply-chain discourse five years ago and now gates AI accelerator output.

Two packaging stories appear at once. **TSMC CoWoS** ([TSMC → NVIDIA packaging arc](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&edge=e-tsmc-packages-nvidia)) integrates interposers and HBM stacks at the foundry — the bottleneck NVIDIA earnings calls keep circling. **OSAT houses** ([ASE → NVIDIA](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&edge=e-ase-packages-nvidia), [Amkor → NVIDIA](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&edge=e-amkor-packages-nvidia)) handle assembly and test for a wider set of customers. In the scenario, ASE and Amkor fab pins ring red as chokepoints; TSMC CoWoS arcs stress orange alongside foundry supply.

The essay line: **you can add wafer capacity and still not add finished AI GPUs** if CoWoS and OSAT slots are full. CHIPS money went heavily to fabs; packaging onshoring (Amkor Arizona, TSMC Arizona's packaging footprint) is the slower follow-on. The map makes that asymmetry visible by toggling one layer.

---

## Piece 5 — Export controls (standalone post outline)

**Thesis:** Policy on five equipment makers caps China's leading edge without bombing a fab.

**Map:** [/?scenario=export-controls&node=co-smic](https://chip-sense-ten.vercel.app/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0) · Equipment layer · Export: `chip-sense-05-export-controls.png`

**Highlight:** `e-asml-supplies-smic` (disrupted); SMIC, Huawei, YMTC, CXMT as chokepoints.

**Draft paragraph (stub):** *Export controls are a scenario about access, not destruction — the ASML → SMIC arc breaks while China fabs stay on the map as stressed nodes.*

### Draft (standalone post)

Open [export controls on the CPU track](https://chip-sense-ten.vercel.app/track/cpus?scenario=export-controls&node=co-smic). This scenario models **policy tightening**, not bombs or earthquakes. SMIC, Huawei, YMTC, and CXMT ring as chokepoints; fabs stress orange; the telling edge is [ASML → SMIC](https://chip-sense-ten.vercel.app/?scenario=export-controls&edge=e-asml-supplies-smic) in red — disrupted tool access, not destroyed capacity.

EUV was never licensed to China; the scenario assumes further curtailment of advanced DUV and service. China's leading edge is capped by a **short list of foreign equipment makers** — ASML, Applied Materials, Lam, Tokyo Electron, KLA — whose HQ pins sit in the Netherlands, US, and Japan. Toggle equipment only (`supply=0&pkg=0&mem=0&asm=0`) to see purple arcs fanning into every major fab, then filter to the one that breaks toward SMIC.

The writing move is leverage, not inventory: Washington and allies do not need to block every chip — they need to block the tools that print the nodes. Huawei's HiSilicon arm appears as a chokepoint node for the design-side story; YMTC and CXMT anchor the memory-side ceiling. Domestic substitution stays cyan and limited — a deliberate contrast to the Taiwan scenario's substitution buffers.

---

## Must-show on map

Companies: TSMC, Samsung, SK Hynix, Micron, Intel, NVIDIA, AMD, Apple, ASML, SMIC, UMC, ASE.

Countries: Taiwan, China, United States, South Korea.

**Clean teaching view:** [/?essay1=1](https://chip-sense-ten.vercel.app/?essay1=1)
