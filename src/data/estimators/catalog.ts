import type { EstimatorDef, EstimatorId } from "@/lib/estimators/types";
import type { ExportRule } from "@/lib/estimators/exportModel";

export const ESTIMATORS: EstimatorDef[] = [
  {
    id: "yield",
    title: "Yield estimator",
    short: "Die yield and good dies per wafer from area and defect density.",
    accent: "#34d399",
  },
  {
    id: "export-controls",
    title: "Export control simulator",
    short: "Toggle teaching rules and see which supply-chain nodes stress.",
    accent: "#f59e0b",
  },
  {
    id: "fab-capacity",
    title: "Fab capacity planner",
    short: "Convert wafer starts, utilization, and yield into good-die throughput.",
    accent: "#38bdf8",
  },
  {
    id: "packaging-cost",
    title: "Packaging cost model",
    short: "Coarse $/unit build-up for substrate, assembly, test, and yield loss.",
    accent: "#fbbf24",
  },
  {
    id: "ai-cluster-demand",
    title: "AI cluster demand model",
    short: "Map clusters → GPUs → HBM → packages → implied logic wafers.",
    accent: "#f472b6",
  },
];

export function getEstimator(id: string): EstimatorDef | undefined {
  return ESTIMATORS.find((e) => e.id === id);
}

export function isEstimatorId(id: string): id is EstimatorId {
  return ESTIMATORS.some((e) => e.id === id);
}

/** Teaching defaults — all marked estimate unless noted. See ESTIMATORS.md. */
export const YIELD_DEFAULTS = {
  dieAreaCm2: 8.0,
  defectDensityPerCm2: 0.15,
  waferDiameterMm: 300,
  edgeExclusionMm: 3,
  model: "poisson" as const,
  notes: {
    dieAreaCm2:
      "Teaching default for a large logic / AI accelerator die (~800 mm²). Replace with your die size.",
    defectDensityPerCm2:
      "Illustrative advanced-logic defect-density band mid-point. Real D0 is process- and foundry-specific.",
    waferDiameterMm: "Industry-standard 300 mm wafer.",
    edgeExclusionMm: "Typical teaching edge exclusion (~3 mm).",
  },
};

export const CAPACITY_DEFAULTS = {
  waferStartsPerMonth: 0,
  diesPerWafer: 50,
  yieldFraction: 0.7,
  utilization: 0.85,
  notes: {
    waferStartsPerMonth:
      "Left at 0 on purpose — enter a cited or assumed WSPM. Public capacity figures are often missing or outdated.",
    diesPerWafer: "Seed from the Yield estimator good-die geometry, or enter your DPW.",
    yieldFraction: "Teaching default die yield (70%). Override with Yield estimator output.",
    utilization: "Illustrative fab utilization (85%). Not a measured OEE.",
  },
};

export const PACKAGING_DEFAULTS = {
  units: 10_000,
  substrateUsd: 400,
  assemblyUsd: 250,
  testUsd: 100,
  packageYield: 0.92,
  /** Wide illustrative band for “CoWoS-class” AI packages (teaching only). */
  bandLowUsd: 500,
  bandHighUsd: 2000,
  notes: {
    costs:
      "Illustrative CoWoS-class cost bands synthesized from public trade-press ranges — not OSAT quotes.",
    packageYield: "Teaching advanced-packaging yield default.",
  },
};

export const CLUSTER_DEFAULTS = {
  clusters: 1,
  gpusPerCluster: 8,
  hbmStacksPerGpu: 6,
  hbmGbPerStack: 16,
  packageYield: 0.92,
  diesPerWafer: 50,
  dieYield: 0.7,
  notes: {
    gpusPerCluster: "Teaching default resembling an 8-GPU HGX-class board — replace with your SKU.",
    hbmStacksPerGpu: "Illustrative HBM stack count for a high-end AI GPU class.",
    hbmGbPerStack: "Illustrative GB per HBM stack.",
  },
};

export const EXPORT_RULES: ExportRule[] = [
  {
    id: "euv-block",
    label: "EUV lithography blocked",
    description:
      "No EUV tool shipments to restricted destinations (teaching rule mirroring public Dutch/US restrictions).",
    defaultOn: true,
    kind: "estimate",
    sourceLabel: "Theme reference (not EAR text) — public EUV restriction coverage",
    sourceUrl: "https://www.asml.com/",
    stressedCompanyIds: ["co-smic", "co-huawei", "co-ymtc", "co-cxmt"],
    effects: [
      "Leading-edge Chinese logic fabs stay on DUV-limited nodes in this teaching scenario.",
      "Domestic substitution pressure rises for lithography and process modules.",
    ],
    severity: 3,
  },
  {
    id: "duv-curtail",
    label: "Advanced DUV curtailed",
    description: "Immersion DUV sales/service limits tighten for restricted fabs.",
    defaultOn: true,
    kind: "estimate",
    sourceLabel: "Theme reference (not EAR text) — public DUV control discussions",
    sourceUrl: "https://www.bis.doc.gov/",
    stressedCompanyIds: ["co-smic", "co-ymtc", "co-cxmt", "co-asml"],
    effects: [
      "Even mature leading-edge ramps at restricted fabs slow further.",
      "ASML → SMIC-style equipment arcs read as disrupted on the map metaphor.",
    ],
    severity: 3,
  },
  {
    id: "us-person-service",
    label: "US-person service limits",
    description: "US persons restricted from supporting certain semiconductor manufacturing.",
    defaultOn: true,
    kind: "estimate",
    sourceLabel: "Theme reference (not EAR text) — public BIS/EAR service-rule coverage",
    sourceUrl: "https://www.bis.doc.gov/",
    stressedCompanyIds: ["co-smic", "co-ymtc", "co-cxmt", "co-huawei"],
    effects: [
      "Tool uptime and process bring-up at restricted fabs become harder in the teaching model.",
    ],
    severity: 2,
  },
  {
    id: "hbm-restrict",
    label: "Advanced HBM / memory controls",
    description: "Controls on advanced memory shipments into restricted AI supply chains.",
    defaultOn: false,
    kind: "estimate",
    sourceLabel: "Theme reference (not EAR text) — illustrative memory-control scenario",
    sourceUrl: "https://www.bis.doc.gov/",
    stressedCompanyIds: ["co-sk-hynix", "co-samsung", "co-micron", "co-huawei", "co-nvidia"],
    effects: [
      "HBM allocation to restricted end-uses tightens; allied memory makers face compliance load.",
    ],
    severity: 2,
  },
  {
    id: "eda-restrict",
    label: "EDA / design-software limits",
    description: "Advanced EDA tool access restricted for certain design centers.",
    defaultOn: false,
    kind: "estimate",
    sourceLabel: "Theme reference (not EAR text) — illustrative EDA-control scenario",
    sourceUrl: "https://www.bis.doc.gov/",
    stressedCompanyIds: ["co-huawei", "co-smic"],
    effects: [
      "Domestic design flows slow; leading-edge tape-outs become harder in the teaching model.",
    ],
    severity: 2,
  },
];

export const COMPANY_LABELS: Record<string, string> = {
  "co-smic": "SMIC",
  "co-huawei": "Huawei",
  "co-ymtc": "YMTC",
  "co-cxmt": "CXMT",
  "co-asml": "ASML",
  "co-sk-hynix": "SK hynix",
  "co-samsung": "Samsung",
  "co-micron": "Micron",
  "co-nvidia": "NVIDIA",
};
