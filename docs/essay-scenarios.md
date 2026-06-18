# Essay series — scenario stress tests

Standalone posts built from the board's **illustrative scenarios**. Each scenario restyles the same graph (chokepoint / stressed / relief rings) — it does not simulate capacity from tables. Open the board link, read the sidebar narrative, click highlighted nodes/edges for citations, then draft from the stub below.

**Production board:** [chip-sense-ten.vercel.app](https://chip-sense-ten.vercel.app) · **Writing briefs:** [writing-cheat-sheet.md](./writing-cheat-sheet.md) · **Taiwan essay (long form):** [essay-1.md](./essay-1.md)

> All scenarios are illustrative stress tests, not forecasts.

---

## 1. HBM / memory supply crunch

**Thesis:** HBM allocation — not wafer fab — gates AI accelerator output.

**Board:** [/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0)

**Highlight:** `co-sk-hynix`, `co-samsung`, `co-micron`, `co-nvidia` · edges `e-skhynix-memory-nvidia`, `e-micron-memory-nvidia`

### Draft

Open the [HBM shortage view](https://chip-sense-ten.vercel.app/track/gpus?scenario=hbm-shortage&node=co-sk-hynix) with only the memory layer visible. The story is allocation: SK hynix, Samsung, and Micron ring as chokepoints; their arcs to NVIDIA and AMD turn red; the GPU makers stress orange downstream.

HBM is co-packaged with the accelerator — a foundry can deliver wafers and the chip still does not ship if memory stacks are rationed. Micron is the only US-headquartered HBM source in the trio, which matters for policy conversations that treat “onshoring” as a fab story alone.

The sidebar's ~70% supply-vs-demand knob is an essay dial, not a market forecast. The sourced claim is structural: three memory makers, two Korean, one American, all disclosed as NVIDIA suppliers in filings linked on the arcs.

---

## 2. Constrained advanced packaging

**Thesis:** CoWoS at TSMC and OSAT at ASE/Amkor — not transistor yield — is the near-term AI limiter.

**Board:** [/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0)

**Highlight:** `co-ase`, `co-amkor`, `co-tsmc` · edges `e-tsmc-packages-nvidia`, `e-ase-packages-nvidia`

### Draft

Toggle [packaging only](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&supply=0&equips=0&mem=0&asm=0). Amber arcs show two parallel stories: **TSMC CoWoS** integrating interposers at the foundry, and **OSAT houses** (ASE, Amkor) finishing dies for a wider customer set.

The constrained-packaging scenario rings ASE and Amkor as chokepoints and stresses TSMC CoWoS arcs alongside foundry supply. That matches the industry narrative: you can add wafer capacity and still not add finished AI GPUs if packaging slots are full. CHIPS money went heavily to fabs; packaging onshoring is the slower follow-on — visible as Amkor Arizona and TSMC Arizona pins, but not at Taiwan scale in the scenario horizon.

---

## 3. US–China export controls deepen

**Thesis:** A handful of equipment makers cap China's leading edge without destroying fabs — policy is the shock.

**Board:** [/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0)

**Highlight:** `co-smic`, `co-asml`, `co-huawei` · edge `e-asml-supplies-smic` (disrupted)

### Draft

This scenario models **access tightening**, not physical destruction. SMIC, Huawei, YMTC, and CXMT ring as chokepoints; the [ASML → SMIC](https://chip-sense-ten.vercel.app/?scenario=export-controls&edge=e-asml-supplies-smic) arc breaks red while fabs stay on the map as stressed nodes.

EUV never reached China; the scenario assumes further DUV and service restrictions. The leverage is a short list of tool vendors — ASML, Applied Materials, Lam, Tokyo Electron, KLA — whose purple equipment arcs touch every major fab. Toggle equipment only to see the oligopoly, then filter to the one arc that breaks toward SMIC.

Domestic substitution (CXMT, YMTC) appears as limited cyan buffers — a deliberate contrast to Taiwan-crisis relief styling. The essay move: **toolchain control beats inventory control** for leading-edge logic.

---

## 4. Korea memory disruption

**Thesis:** Korea is the memory mirror of a Taiwan logic shock — DRAM, NAND, and HBM offline together.

**Board:** [/?scenario=korea-memory-shock&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?scenario=korea-memory-shock&node=co-sk-hynix)

**Highlight:** `co-samsung`, `co-sk-hynix`, `co-micron` (relief) · HBM arcs disrupted

### Draft

Taiwan dominates leading-edge logic; Korea dominates memory. A [Korea shock scenario](https://chip-sense-ten.vercel.app/track/memory?scenario=korea-memory-shock&node=co-sk-hynix) pulls DRAM, NAND, and HBM offline at once — Samsung and SK hynix as chokepoints, Micron as partial green relief, China's CXMT/YMTC as limited substitution.

Memory concentration gets less press than TSMC, but the map shows the same single-region risk pattern in pink arcs instead of blue. Click [Micron as relief](https://chip-sense-ten.vercel.app/?scenario=korea-memory-shock&node=co-micron) — the only comparable Western memory footprint, still not a full Korea replacement at HBM scale.

---

## 5. Japan toolchain & materials shock

**Thesis:** Japan's photoresist, chemicals, and Tokyo Electron tools slow every advanced fab at once.

**Board:** [/?scenario=japan-toolchain-shock&node=co-tel&supply=0&pkg=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=japan-toolchain-shock&node=co-tel&supply=0&pkg=0&mem=0&asm=0)

**Highlight:** `co-tel`, `country-jp` · edges `e-tel-supplies-tsmc`, `e-tel-supplies-samsung`

### Draft

Unlike a single fab outage, a Japan materials shock hits **TSMC, Samsung, and Intel in parallel** because they share upstream suppliers. Tokyo Electron and Japan ring as chokepoints; TEL → fab equipment arcs stress orange.

Photoresist and specialty chemicals are not separate nodes on the board yet — the scenario represents them through the TEL toolchain choke. The writing angle: the inputs nobody maps, until every leading-edge fab slows at once.

---

## 6. Mature-node overcapacity glut

**Thesis:** China's mature-node risk is oversupply and margin collapse — not leading-edge catch-up.

**Board:** [/?scenario=mature-node-glut&node=co-umc](https://chip-sense-ten.vercel.app/?scenario=mature-node-glut&node=co-umc)

**Highlight:** `co-umc`, `co-globalfoundries`, `co-smic` · leading edge stays neutral

### Draft

This is a **margin story**, not a shortage. UMC, GlobalFoundries, and SMIC stress orange while NVIDIA and TSMC stay neutral — the map separates trailing-edge autos/industrial chips from AI leading edge.

Subsidized Chinese mature-node capacity plus UMC/GF expansion outpaces demand; prices fall on legacy nodes that run cars and appliances. The sidebar utilization knob is illustrative; the sourced part is who operates those fabs and where the pins sit.

---

## 7. US CHIPS buildout matures

**Thesis:** Onshoring adds partial relief — it does not remove Taiwan/Korea concentration in the scenario horizon.

**Board:** [/?scenario=us-chips-buildout&node=fab-tsmc-az](https://chip-sense-ten.vercel.app/?scenario=us-chips-buildout&node=fab-tsmc-az)

**Highlight:** `fab-tsmc-az`, `fab-samsung-taylor`, `co-amkor` · buffered TSMC → fabless arcs

### Draft

A **resilience** scenario, not a shock: green relief pins for TSMC Arizona, Samsung Taylor, Intel Oregon, SK hynix Indiana; cyan buffer for Amkor; key TSMC → fabless arcs styled as buffered rather than broken.

Score the CHIPS Act honestly: logic and packaging gain some US geography, but the map still centers Taiwan and Korea for leading-edge volume. The ~35% self-sufficiency knob in the sidebar is illustrative — the visual argument is green pins vs red concentration elsewhere.

---

## Publishing checklist

1. Open the board URL; confirm scenario styling and sidebar copy.
2. Click each highlight node/edge; copy citation lines into your draft.
3. Screenshot: **Export arcs (PNG)** for line art, or browser screenshot for pins.
4. Paste the board URL as an interactive figure link in your post.
5. Run `npm run check:data` before citing new numbers from the repo.
