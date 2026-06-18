# Companies (Chip Sense)

**Canonical data:** `src/data/companies.json` (merged into the map via `loadGraph()`).

**Per-company fields now include:** `segment` (foundry/idm/memory/fabless/equipment/osat/ems — drives pin color via `src/lib/segments.ts`), `founded`, `hq_city`, and a `description` paragraph (specialization + location + short origin history) shown on hover and in the click sidebar. See `MAP.md` for the color legend and `SCENARIOS.md` for connections and writing topics.

## Step 1 checklist

| Criterion | Status |
| --- | --- |
| ~15+ companies filled in | **Done** — 25 companies |
| Specialization in plain English | **Done** |
| HQ country + ≥1 operating country | **Done** |
| Priority 10 sourced (not rough) | **Done** |
| Must-show on essay 1 map marked | **Done** — 12 companies + TW/CN/US/KR + 14 cited fab pins |
| All 25 companies sourced | **Done** — each row has IR/SEC/annual-report link |

**Geography model (comprehensive):**

| Layer | Data | Map |
| --- | --- | --- |
| HQ | `companies.json` → `hq_country` + company `coordinates` | Green **HQ** pin |
| Operating countries | `operating_countries[]` + `operates_in` edges | Highlights country pin (sky ring) |
| Fab / site | `src/data/fab-sites.json` + `operates` / `located_in` | Yellow **Fab** pin |
| Other ops (no fab yet) | Auto `presence` nodes | Blue **Ops** pin near country centroid |

Canonical site list: `src/data/fab-sites.json`. Runtime merge: `src/lib/geography.ts`.

---

## Company directory

| Company | Specialization | HQ | Operating countries | Sourced | Essay 1 | Source |
| --- | --- | --- | --- | --- | --- | --- |
| TSMC | Pure-play foundry — leading-edge logic, CoWoS packaging | Taiwan | Taiwan; US; Japan | Y | **Y** | [20-F FY2024](https://investor.tsmc.com/english/sec-filings) |
| Samsung (DS) | Memory, foundry, advanced logic | South Korea | South Korea; US; China | Y | **Y** | [IR / reports](https://www.samsung.com/sec/) |
| SK Hynix | DRAM, NAND | South Korea | South Korea; China; US | Y | **Y** | [Annual report](https://www.skhynix.com/eng/) |
| Micron | DRAM, NAND | United States | US; Taiwan; Japan; Singapore; Malaysia; China; India | Y | **Y** | [10-K FY2024](https://investors.micron.com/financial-info/sec-filings) |
| Intel | x86 CPUs, IDM, IFS | United States | US; Ireland; Israel; Malaysia; China; Costa Rica; Poland; Vietnam | Y | **Y** | [10-K FY2024](https://www.intc.com/financial-info/sec-filings) |
| NVIDIA | GPU / AI (fabless) | United States | US; Taiwan; South Korea; India; Israel | Y | **Y** | [10-K FY2024](https://investor.nvidia.com/financial-info/sec-filings/default.aspx) |
| AMD | CPUs, GPUs (fabless) | United States | US; Canada; China; India; Taiwan; Singapore | Y | **Y** | [10-K FY2024](https://ir.amd.com/financial-information/sec-filings) |
| Apple | SoC design (fabless) | United States | US; China; Taiwan; Ireland; Singapore | Y | **Y** | [10-K FY2024](https://investor.apple.com/sec-filings/default.aspx) |
| Qualcomm | Mobile SoC, RF (fabless) | United States | US; Taiwan; South Korea; China; India; Singapore | Y | N | [10-K FY2024](https://investor.qualcomm.com/financial-information/sec-filings) |
| Broadcom | Networking / custom silicon | United States | US; Singapore; Taiwan | Y | N | [10-K FY2024](https://investors.broadcom.com/financial-information/annual-reports) |
| MediaTek | Mobile SoC (fabless) | Taiwan | Taiwan; China; Singapore; India; US | Y | N | [Annual report 2024](https://cdn-www.mediatek.com/posts/2024-English-Annual-Report.pdf) |
| UMC | Mature / mid-node foundry | Taiwan | Taiwan; Singapore; China | Y | **Y** | [Financial statements](https://www.umc.com/en/Download/financial_statements) |
| SMIC | China domestic foundry | China | China | Y | **Y** | [Annual report](https://www.smics.com/en/site/smic_annualreports/index) |
| GlobalFoundries | Mature-node foundry | United States | US; Germany; Singapore | Y | N | [SEC filings](https://investors.gf.com/financial-information/sec-filings) |
| ASE | OSAT, advanced packaging | Taiwan | Taiwan; China; US; Malaysia; South Korea | Y | **Y** | [20-F FY2024](https://www.aseglobal.com/en/investor/financial) |
| Amkor | OSAT | United States | US; South Korea; China; Taiwan; Philippines | Y | N | [10-K FY2024](https://ir.amkor.com/financials/sec-filings) |
| ASML | Lithography equipment | Netherlands | Netherlands; US; Taiwan; South Korea; China; Japan | Y | **Y** | [Annual report](https://www.asml.com/en/investors/annual-report) |
| Applied Materials | Wafer-fab equipment | United States | US; Taiwan; China; South Korea; Japan; Singapore; Israel; Europe | Y | N | [10-K FY2024](https://ir.appliedmaterials.com/financial-information/sec-filings) |
| Lam Research | Etch / deposition equipment | United States | US; Taiwan; South Korea; China; Japan; Europe | Y | N | [10-K FY2024](https://investor.lamresearch.com/annual-reports-and-proxy) |
| KLA | Process control | United States | US; Taiwan; South Korea; China; Japan; Europe | Y | N | [10-K FY2024](https://ir.kla.com/financials/sec-filings) |
| Tokyo Electron | Equipment | Japan | Japan; US; Taiwan; South Korea; China; Europe | Y | N | [Integrated report](https://www.tel.com/ir/library/ar/index.html) |
| Foxconn | EMS / assembly | Taiwan | Taiwan; China; US; India; Mexico; Vietnam | Y | N | [Financial reports](https://www.honhai.com/en-us/investor-relations/financial-reports) |
| YMTC | 3D NAND (China) | China | China | Y | N | [Corporate site](https://www.ymtc.com/en/) |
| CXMT | DRAM (China) | China | China | Y | N | [Corporate / IPO](https://www.cxmt.com/) |
| Huawei | Telecom / mobile SoC | China | China | Y | N | [Annual report 2024](https://www.huawei.com/en/annual-report/2024) |

### Essay 1 map (must-show)

**Companies:** TSMC, Samsung, SK Hynix, Micron, Intel, NVIDIA, AMD, Apple, ASML, SMIC, UMC, ASE.

**Countries:** Taiwan, China, United States, South Korea.

**Fab pins (amber ring):** TSMC (Tainan, Arizona, Kumamoto), Samsung (Hwaseong, Taylor, Xi'an), SK Hynix (Icheon, Wuxi), Micron (Taichung, Hiroshima), Intel (Oregon, Leixlip, Kiryat Gat), UMC Singapore, GF Dresden, SMIC Shanghai.

---

## Geopolitical track notes

- **Taiwan:** TSMC + UMC + ASE + Micron Taichung anchor leading-edge logic, foundry, OSAT, and memory packaging.
- **China:** SMIC, YMTC, CXMT, Samsung Xi'an, SK Hynix Wuxi, Foxconn Zhengzhou — domestic and foreign-owned capacity inside China.
- **US:** CHIPS-related expansions (TSMC Arizona, Samsung Taylor, Intel US, Micron US HQ) vs. export controls on tools to China.
- **Korea:** Samsung + SK Hynix memory and logic base.
