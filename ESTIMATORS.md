# Chip Sense estimators — methodology

Chip Sense **estimate tools** are illustrative what-if calculators for teaching, essays, and YouTube walkthroughs. They are **not** forecasts, OSAT quotes, fab MES plans, or legal/compliance determinations.

Live UI: [/tools](https://chip-sense-ten.vercel.app/tools) · In-app methodology page: [/estimators](https://chip-sense-ten.vercel.app/estimators)

Every tool shares the same rules:

1. **Formulas** are standard teaching identities (documented below).
2. **Default inputs** are curated estimate bands or deliberately blank — each notes its provenance.
3. **User edits** are labeled *Your input* and never claimed as Chip Sense published facts.
4. **Outputs** use `~` / ranges and an amber **Estimate** badge.

Parameter kinds: `cited` · `estimate` · `user`.

---

## Shared identity

\[
\text{output} = f(\text{assumptions})
\]

We never present \(f\) as calibrated to a specific foundry’s confidential process. Sensitivity tables (where present) exist to show **direction under assumptions**.

---

## 1. Yield estimator

**Route:** `/tools/yield`  
**Code:** `src/lib/estimators/yieldModel.ts`

### Formulas

**Poisson die yield**

\[
Y = e^{-A \cdot D}
\]

**Murphy die yield**

\[
Y = \frac{1 - e^{-A \cdot D}}{A \cdot D}
\]

(with \(Y \to 1\) as \(A\cdot D \to 0\))

- \(A\) = die area (cm²)  
- \(D\) = defect density \(D_0\) (defects/cm²)

**Dies per wafer (simplified geometry)**

\[
\mathrm{DPW} \approx \frac{\pi (R - E)^2}{A}
\]

- \(R\) = wafer radius  
- \(E\) = edge exclusion  

**Good dies per wafer** \(\approx \mathrm{DPW} \times Y\)

This DPW ignores scribe lanes, reticle efficiency, and packing — teaching approximation only.

### Default inputs (estimates)

| Parameter | Default | Provenance |
| --- | ---: | --- |
| Die area | 8.0 cm² | Teaching large AI/logic die (~800 mm²) |
| Defect density | 0.15 /cm² | Mid illustrative advanced-logic band |
| Wafer diameter | 300 mm | Industry standard |
| Edge exclusion | 3 mm | Common teaching exclusion |
| Model | Poisson | Classic textbook starting point |

---

## 2. Export control simulator

**Route:** `/tools/export-controls`  
**Code:** `src/lib/estimators/exportModel.ts` + `EXPORT_RULES` in `src/data/estimators/catalog.ts`

### “Formula”

Not continuous physics. A **rule table**:

\[
\text{stressed companies} = \bigcup_{\text{active rules}} \text{rule.targets}
\]

\[
\text{severity score} = \sum_{\text{active rules}} \text{rule.severity}
\]

Severity label is a coarse bin of that score (low / moderate / high) for teaching screenshots.

### Default rules (estimates)

| Rule | Default | Basis |
| --- | --- | --- |
| EUV lithography blocked | On | Public ASML / Dutch–US EUV restriction theme |
| Advanced DUV curtailed | Off | Illustrative tightening scenario |
| US-person service limits | On | Public BIS/EAR service-rule theme |
| Advanced HBM / memory controls | Off | Illustrative |
| EDA / design-software limits | Off | Illustrative |

Effects text and company IDs align with Chip Sense map nodes (e.g. SMIC, Huawei, YMTC). Links open `/?scenario=export-controls&node=…`.

**Not legal advice.** Rules are teaching summaries, not the EAR text.

---

## 3. Fab capacity planner

**Route:** `/tools/fab-capacity`  
**Code:** `src/lib/estimators/capacityModel.ts`

### Formula

\[
\text{good dies/month} \approx WSPM \times U \times \mathrm{DPW} \times Y
\]

- \(WSPM\) = wafer starts per month  
- \(U\) = utilization (0–1)  
- \(\mathrm{DPW}\) = dies per wafer  
- \(Y\) = die yield (0–1)

### Default inputs

| Parameter | Default | Provenance |
| --- | ---: | --- |
| WSPM | **0** (required) | Intentionally blank — enter cited or assumed capacity |
| DPW | 50 | Teaching seed (override from Yield tool) |
| Yield | 0.70 | Teaching default |
| Utilization | 0.85 | Illustrative OEE-like factor |

True fab WSPM is often proprietary. Chip Sense will not invent it.

---

## 4. Packaging cost model

**Route:** `/tools/packaging-cost`  
**Code:** `src/lib/estimators/packagingModel.ts`

### Formula

\[
C_{\text{unit}} = C_{\text{substrate}} + C_{\text{assembly}} + C_{\text{test}}
\]

\[
C_{\text{unit, yield-adj}} = \frac{C_{\text{unit}}}{Y_{\text{pkg}}}
\]

\[
C_{\text{batch}} = N \times C_{\text{unit, yield-adj}}
\]

### Default inputs (estimates)

| Parameter | Default | Provenance |
| --- | ---: | --- |
| Substrate | $400 | Illustrative CoWoS-class band split |
| Assembly | $250 | Illustrative |
| Test | $100 | Illustrative |
| Package yield | 0.92 | Teaching advanced-packaging yield |
| Sanity band | $500–$2000 / GPU package | Wide public trade-press range (estimate only) |

Not ASE/TSMC list prices.

---

## 5. AI cluster demand model

**Route:** `/tools/ai-cluster-demand`  
**Code:** `src/lib/estimators/clusterModel.ts`

### Formulas

\[
\begin{aligned}
\mathrm{GPUs} &= N_{\text{clusters}} \times \mathrm{GPUs/cluster} \\
\mathrm{HBM\ stacks} &= \mathrm{GPUs} \times \mathrm{stacks/GPU} \\
\mathrm{HBM\ TB} &= \mathrm{stacks} \times \mathrm{GB/stack} / 1024 \\
\mathrm{packages} &\approx \mathrm{GPUs} / Y_{\text{pkg}} \\
\mathrm{logic\ wafers} &\approx \mathrm{GPUs} / (\mathrm{DPW} \times Y_{\text{die}})
\end{aligned}
\]

Ignores multi-die packages and HBM wafer demand (call that out in essays).

### Default inputs (estimates)

| Parameter | Default | Provenance |
| --- | ---: | --- |
| Clusters | 1 | User what-if |
| GPUs / cluster | 8 | HGX-class teaching shape |
| HBM stacks / GPU | 6 | Illustrative high-end AI GPU class |
| GB / stack | 16 | Illustrative |
| Package / die yields, DPW | 0.92 / 0.70 / 50 | Same teaching seeds as sibling tools |

---

## Implementation map

| Concern | Path |
| --- | --- |
| Tool catalog + defaults | `src/data/estimators/catalog.ts` |
| Math | `src/lib/estimators/*Model.ts` |
| UI chrome | `src/components/estimators/*` |
| Routes | `src/app/tools/`, `src/app/estimators/` |

---

## Language lock

**Use:** estimate, illustrative, assumption, scenario, sensitivity, what-if  
**Avoid:** forecast, predict, will, accurate, optimal, recommended capacity, compliance decision, market price

Screenshots for essays/YouTube should keep the on-page amber estimate banner visible.
