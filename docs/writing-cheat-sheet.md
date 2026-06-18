# Writing cheat sheet (Phase 4)

One-page reference for drafting from the board. Production base URL: **https://chip-sense-ten.vercel.app** (local dev: `http://127.0.0.1:3002`).

**Before publishing:** run `npm run check:data`. Export a map PNG from the board header (**Export map PNG**) for each piece. All scenario multipliers remain illustrative — cite `sources.json` for factual claims.

---

## Piece 1 — Intro: four chokepoints on one map

| Field | Value |
| --- | --- |
| **Thesis** | The supply chain is a stack of bottlenecks — equipment, foundry, memory, packaging, assembly — each with its own geography. |
| **Scenario** | Baseline |
| **Track** | — (global board) |
| **Trade flows** | **On** (`trade=1`) |
| **Layers** | All on (default) |
| **Highlight nodes** | `co-tsmc`, `co-asml`, `co-sk-hynix`, `co-ase`, `co-foxconn` |
| **Highlight edges** | `e-asml-supplies-tsmc`, `e-tsmc-supplies-nvidia`, `e-skhynix-memory-nvidia`, `e-tsmc-packages-nvidia`, `e-foxconn-assembles-nvidia` |
| **Board URL** | [/?essay1=1&trade=1](https://chip-sense-ten.vercel.app/?essay1=1&trade=1) |
| **Screenshot** | `chip-sense-01-baseline-chain.png` |

---

## Piece 2 — Taiwan Strait: what breaks first

| Field | Value |
| --- | --- |
| **Thesis** | A Taiwan shock stalls leading-edge GPUs/CPUs first; CHIPS fabs are partial relief, not a replacement within 18 months. |
| **Scenario** | `taiwan-crisis` |
| **Track** | GPUs — [/track/gpus?scenario=taiwan-crisis&node=co-tsmc](https://chip-sense-ten.vercel.app/track/gpus?scenario=taiwan-crisis&node=co-tsmc) |
| **Trade flows** | **On** — shows TW↔US chip trade context |
| **Layers** | Supply + equips (default); add memory/packaging to show propagation |
| **Highlight nodes** | `co-tsmc`, `co-nvidia`, `fab-tsmc-sc`, `fab-tsmc-az` |
| **Highlight edges** | `e-tsmc-supplies-nvidia` (disrupted), `e-asml-supplies-tsmc` (stressed) |
| **Board URL** | [/?scenario=taiwan-crisis&node=co-tsmc&trade=1](https://chip-sense-ten.vercel.app/?scenario=taiwan-crisis&node=co-tsmc&trade=1) |
| **Screenshot** | `chip-sense-02-taiwan-crisis.png` |
| **Essay tie-in** | [essay-1.md](./essay-1.md) Mechanisms 1 & 3 |

---

## Piece 3 — HBM crunch: AI is memory-bound

| Field | Value |
| --- | --- |
| **Thesis** | HBM allocation — not wafer fab — gates AI accelerator output; Micron is the sole US-based HBM source. |
| **Scenario** | `hbm-shortage` |
| **Track** | GPUs — [/track/gpus?scenario=hbm-shortage&node=co-sk-hynix](https://chip-sense-ten.vercel.app/track/gpus?scenario=hbm-shortage&node=co-sk-hynix) |
| **Trade flows** | **Off** (story is company arcs, not country trade) |
| **Layers** | Memory on; hide assembly (`asm=0`) to reduce clutter |
| **Highlight nodes** | `co-sk-hynix`, `co-samsung`, `co-micron`, `co-nvidia` |
| **Highlight edges** | `e-skhynix-memory-nvidia`, `e-micron-memory-nvidia`, `e-samsung-memory-nvidia` (disrupted) |
| **Board URL** | [/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=hbm-shortage&node=co-sk-hynix&supply=0&equips=0&pkg=0&asm=0) |
| **Screenshot** | `chip-sense-03-hbm-shortage.png` |

---

## Piece 4 — Packaging bottleneck: CoWoS and OSAT

| Field | Value |
| --- | --- |
| **Thesis** | The near-term AI limiter moved from the transistor to the package — TSMC CoWoS and Taiwan OSAT (ASE/Amkor) sit on the critical path. |
| **Scenario** | `constrained-packaging` |
| **Track** | GPUs — [/track/gpus?scenario=constrained-packaging](https://chip-sense-ten.vercel.app/track/gpus?scenario=constrained-packaging) |
| **Trade flows** | **Off** |
| **Layers** | **Packaging only** — `supply=0&equips=0&mem=0&asm=0` |
| **Highlight nodes** | `co-ase`, `co-amkor`, `co-tsmc` |
| **Highlight edges** | `e-tsmc-packages-nvidia`, `e-ase-packages-nvidia`, `e-amkor-packages-nvidia` (stressed / chokepoint styling) |
| **Board URL** | [/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=constrained-packaging&node=co-ase&supply=0&equips=0&mem=0&asm=0) |
| **Screenshot** | `chip-sense-04-packaging.png` |

---

## Piece 5 — Export controls: toolchain as leverage

| Field | Value |
| --- | --- |
| **Thesis** | A handful of equipment makers (ASML, AMAT, Lam, TEL, KLA) cap China's leading edge without any physical disruption — policy is the shock. |
| **Scenario** | `export-controls` |
| **Track** | CPUs — [/track/cpus?scenario=export-controls&node=co-smic](https://chip-sense-ten.vercel.app/track/cpus?scenario=export-controls&node=co-smic) |
| **Trade flows** | **Off** (optional: `trade=1` for US→CN equipment arc) |
| **Layers** | Equipment on; hide packaging/memory/assembly |
| **Highlight nodes** | `co-smic`, `co-asml`, `co-huawei` |
| **Highlight edges** | `e-asml-supplies-smic` (disrupted) |
| **Board URL** | [/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=export-controls&node=co-smic&supply=0&pkg=0&mem=0&asm=0) |
| **Screenshot** | `chip-sense-05-export-controls.png` |

---

## Optional follow-on pieces (not in the first five)

| Scenario | Thesis (one line) | Quick URL |
| --- | --- | --- |
| `korea-memory-shock` | Korea is the memory mirror of a Taiwan logic shock | [/?scenario=korea-memory-shock&node=co-sk-hynix](https://chip-sense-ten.vercel.app/?scenario=korea-memory-shock&node=co-sk-hynix) |
| `japan-toolchain-shock` | Japan's materials/toolchain slows every fab at once | [/?scenario=japan-toolchain-shock&node=co-tel&supply=0&pkg=0&mem=0&asm=0](https://chip-sense-ten.vercel.app/?scenario=japan-toolchain-shock&node=co-tel&supply=0&pkg=0&mem=0&asm=0) |
| `us-chips-buildout` | CHIPS Act partial relief — score what actually de-risked | [/?scenario=us-chips-buildout&node=fab-tsmc-az](https://chip-sense-ten.vercel.app/?scenario=us-chips-buildout&node=fab-tsmc-az) |
| `mature-node-glut` | China's mature-node risk is oversupply, not leading edge | [/?scenario=mature-node-glut&node=co-umc](https://chip-sense-ten.vercel.app/?scenario=mature-node-glut&node=co-umc) |

---

## Draft workflow

1. Open the **Board URL** for the piece; confirm scenario styling and sidebar narrative.
2. Click each **highlight node/edge** — copy citation text from the selection panel into your draft.
3. Toggle **trade flows** per the table above.
4. **Export map PNG**; save with the suggested filename.
5. Paste the board URL into your post as an interactive figure link.
6. Cross-check numbers against `sources.json` before publishing — never treat scenario multipliers as forecasts.
