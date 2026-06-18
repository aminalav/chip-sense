# Data coverage

Auto-generated from `companies.json`, `fab-sites.json`, and `seed-graph.json`.
Regenerate: `npm run data:coverage` · Updated: 2026-06-18

## Summary

| Metric | Count |
| --- | ---: |
| Registry companies | 25 |
| Companies sourced (`sourced: true`) | 25 |
| Essay 1 must-show companies | 12 |
| Fab / site pins | 33 |
| Fab pins with `source_ids` | 33 |
| Source catalog entries | 33 |
| Seed graph `supplies` edges | 10 |
| Supplies edges cited | 10 |
| Seed graph `equips` edges | 18 |
| Equips edges cited | 18 |
| Comtrade trade flows | 8 |
| Seed edges with cited `facts` | 64 |
| Scenarios | 9 (illustrative except baseline copy) |

See `SOURCES.md` for sourcing rules and `COMPANIES.md` for the human company table.

## Company × fabs × supply

| Company | Essay 1 | Sourced | Fab pins | Supplies out (cited?) | Supplies in |
| --- | :---: | :---: | --- | --- | --- |
| TSMC | Y | Y | tsmc-sc, tsmc-az, tsmc-jp | NVIDIA ✓; AMD ✓; Apple ✓; Qualcomm ✓; MediaTek ✓; Broadcom ✓ | — |
| Samsung Electronics (Device Solutions) | Y | Y | samsung-hwaseong, samsung-taylor, samsung-austin, samsung-xian | Qualcomm ✓; NVIDIA ✓ | — |
| SK Hynix | Y | Y | sk-hynix-icheon, sk-hynix-wuxi, sk-hynix-indiana | — | — |
| Micron Technology | Y | Y | micron-taichung, micron-hiroshima, micron-singapore, micron-malaysia | — | — |
| Intel | Y | Y | intel-or, intel-ie, intel-israel, intel-malaysia, intel-chengdu | — | — |
| NVIDIA | Y | Y | — | — | TSMC ✓; Samsung Electronics (Device Solutions) ✓ |
| AMD | Y | Y | — | — | TSMC ✓ |
| Apple | Y | Y | — | — | TSMC ✓ |
| Qualcomm |  | Y | — | — | TSMC ✓; Samsung Electronics (Device Solutions) ✓; GlobalFoundries ✓ |
| Broadcom |  | Y | — | — | TSMC ✓ |
| MediaTek |  | Y | — | — | TSMC ✓; UMC ✓ |
| UMC | Y | Y | umc-singapore, umc-suzhou | MediaTek ✓ | — |
| SMIC | Y | Y | smic-shanghai, smic-beijing | — | — |
| GlobalFoundries |  | Y | gf-dresden, gf-singapore | Qualcomm ✓ | — |
| ASE Technology Holding | Y | Y | ase-kaohsiung, ase-shanghai | — | — |
| Amkor Technology |  | Y | amkor-korea, amkor-philippines | — | — |
| ASML | Y | Y | — | — | — |
| Applied Materials |  | Y | — | — | — |
| Lam Research |  | Y | — | — | — |
| KLA |  | Y | — | — | — |
| Tokyo Electron (TEL) |  | Y | — | — | — |
| Foxconn (Hon Hai) |  | Y | foxconn-zhengzhou, foxconn-shenzhen | — | — |
| YMTC |  | Y | ymtc-wuhan | — | — |
| CXMT (Innotron) |  | Y | cxmt-hefei | — | — |
| Huawei / HiSilicon |  | Y | — | — | — |

## Fab sites (all)

| Fab ID | Operator | City / country | Essay 1 | source_ids |
| --- | --- | --- | :---: | --- |
| `fab-tsmc-sc` | co-tsmc | Tainan Science Park, Taiwan | Y | tsmc-20f-2024 |
| `fab-tsmc-az` | co-tsmc | Phoenix area, United States | Y | tsmc-20f-2024 |
| `fab-tsmc-jp` | co-tsmc | Kumamoto, Japan | Y | tsmc-20f-2024 |
| `fab-samsung-hwaseong` | co-samsung | Hwaseong, South Korea | Y | samsung-ir-2024 |
| `fab-samsung-taylor` | co-samsung | Taylor, United States | Y | samsung-ir-2024 |
| `fab-samsung-austin` | co-samsung | Austin, United States |  | samsung-ir-2024 |
| `fab-samsung-xian` | co-samsung | Xi'an, China | Y | samsung-ir-2024 |
| `fab-sk-hynix-icheon` | co-sk-hynix | Icheon, South Korea | Y | skhynix-annual-2024 |
| `fab-sk-hynix-wuxi` | co-sk-hynix | Wuxi, China | Y | skhynix-annual-2024 |
| `fab-sk-hynix-indiana` | co-sk-hynix | West Lafayette, United States |  | skhynix-annual-2024 |
| `fab-micron-taichung` | co-micron | Taichung, Taiwan | Y | micron-10k-2024 |
| `fab-micron-hiroshima` | co-micron | Hiroshima, Japan | Y | micron-10k-2024 |
| `fab-micron-singapore` | co-micron | Singapore, Singapore |  | micron-10k-2024 |
| `fab-micron-malaysia` | co-micron | Penang, Malaysia |  | micron-10k-2024 |
| `fab-intel-or` | co-intel | Hillsboro, United States | Y | intel-10k-2024 |
| `fab-intel-ie` | co-intel | Leixlip, Ireland | Y | intel-10k-2024 |
| `fab-intel-israel` | co-intel | Kiryat Gat, Israel | Y | intel-10k-2024 |
| `fab-intel-malaysia` | co-intel | Penang, Malaysia |  | intel-10k-2024 |
| `fab-intel-chengdu` | co-intel | Chengdu, China |  | intel-10k-2024 |
| `fab-umc-singapore` | co-umc | Singapore, Singapore | Y | umc-financial-2024 |
| `fab-umc-suzhou` | co-umc | Suzhou, China |  | umc-financial-2024 |
| `fab-smic-shanghai` | co-smic | Shanghai, China | Y | smic-annual-2024 |
| `fab-smic-beijing` | co-smic | Beijing, China |  | smic-annual-2024 |
| `fab-gf-dresden` | co-globalfoundries | Dresden, Germany | Y | gf-sec-2024 |
| `fab-gf-singapore` | co-globalfoundries | Singapore, Singapore |  | gf-sec-2024 |
| `fab-ase-kaohsiung` | co-ase | Kaohsiung, Taiwan | Y | ase-20f-2024 |
| `fab-ase-shanghai` | co-ase | Shanghai, China |  | ase-20f-2024 |
| `fab-amkor-korea` | co-amkor | Gwangju, South Korea |  | amkor-10k-2024 |
| `fab-amkor-philippines` | co-amkor | Muntinlupa, Philippines |  | amkor-10k-2024 |
| `fab-cxmt-hefei` | co-cxmt | Hefei, China |  | cxmt-ipo-2025 |
| `fab-ymtc-wuhan` | co-ymtc | Wuhan, China |  | ymtc-corporate-2024 |
| `fab-foxconn-zhengzhou` | co-foxconn | Zhengzhou, China |  | foxconn-ir-2024 |
| `fab-foxconn-shenzhen` | co-foxconn | Shenzhen, China |  | foxconn-ir-2024 |

## Cited `supplies` edges

| Edge ID | Route | source_ids |
| --- | --- | --- |
| `e-tsmc-supplies-nvidia` | TSMC → NVIDIA | nvidia-10k-2024, tsmc-20f-2024 |
| `e-tsmc-supplies-amd` | TSMC → AMD | amd-10k-2024, tsmc-20f-2024 |
| `e-tsmc-supplies-apple` | TSMC → Apple | apple-10k-2024, tsmc-20f-2024 |
| `e-tsmc-supplies-qualcomm` | TSMC → Qualcomm | qualcomm-10k-2024, tsmc-20f-2024 |
| `e-tsmc-supplies-mediatek` | TSMC → MediaTek | mediatek-annual-2024, tsmc-20f-2024 |
| `e-tsmc-supplies-broadcom` | TSMC → Broadcom | broadcom-10k-2024, tsmc-20f-2024 |
| `e-samsung-supplies-qualcomm` | Samsung Electronics (Device Solutions) → Qualcomm | qualcomm-10k-2024, samsung-ir-2024 |
| `e-samsung-supplies-nvidia` | Samsung Electronics (Device Solutions) → NVIDIA | samsung-ir-2024, nvidia-10k-2024 |
| `e-gf-supplies-qualcomm` | GlobalFoundries → Qualcomm | gf-sec-2024, qualcomm-10k-2024 |
| `e-umc-supplies-mediatek` | UMC → MediaTek | umc-financial-2024, mediatek-annual-2024 |

## Cited `equips` edges

| Edge ID | Route | source_ids |
| --- | --- | --- |
| `e-asml-supplies-tsmc` | ASML → TSMC | asml-annual-2024, tsmc-20f-2024 |
| `e-amat-supplies-tsmc` | Applied Materials → TSMC | amat-10k-2024, tsmc-20f-2024 |
| `e-amat-supplies-intel` | Applied Materials → Intel | amat-10k-2024, intel-10k-2024 |
| `e-lam-supplies-tsmc` | Lam Research → TSMC | lam-10k-2024, tsmc-20f-2024 |
| `e-lam-supplies-samsung` | Lam Research → Samsung Electronics (Device Solutions) | lam-10k-2024, samsung-ir-2024 |
| `e-asml-supplies-intel` | ASML → Intel | asml-annual-2024, intel-10k-2024 |
| `e-asml-supplies-samsung` | ASML → Samsung Electronics (Device Solutions) | asml-annual-2024, samsung-ir-2024 |
| `e-asml-supplies-smic` | ASML → SMIC | asml-annual-2024, smic-annual-2024 |
| `e-amat-supplies-samsung` | Applied Materials → Samsung Electronics (Device Solutions) | amat-10k-2024, samsung-ir-2024 |
| `e-lam-supplies-skhynix` | Lam Research → SK Hynix | lam-10k-2024, skhynix-annual-2024 |
| `e-kla-supplies-tsmc` | KLA → TSMC | kla-10k-2024, tsmc-20f-2024 |
| `e-kla-supplies-samsung` | KLA → Samsung Electronics (Device Solutions) | kla-10k-2024, samsung-ir-2024 |
| `e-tel-supplies-tsmc` | Tokyo Electron (TEL) → TSMC | tel-integrated-2024, tsmc-20f-2024 |
| `e-tel-supplies-samsung` | Tokyo Electron (TEL) → Samsung Electronics (Device Solutions) | tel-integrated-2024, samsung-ir-2024 |
| `e-amat-supplies-skhynix` | Applied Materials → SK Hynix | amat-10k-2024, skhynix-annual-2024 |
| `e-kla-supplies-skhynix` | KLA → SK Hynix | kla-10k-2024, skhynix-annual-2024 |
| `e-lam-supplies-micron` | Lam Research → Micron | lam-10k-2024, micron-10k-2024 |
| `e-asml-supplies-skhynix` | ASML → SK Hynix | asml-annual-2024, skhynix-annual-2024 |
