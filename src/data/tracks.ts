import type { TrackSlug } from "./graph";

export interface TrackDefinition {
  slug: TrackSlug;
  title: string;
  short: string;
  cssVar: string;
  /** Solid color for map / canvas APIs that need a real color string */
  accentHex: string;
  /** HS / WSTS pointers for your research notes */
  researchPointers: string[];
}

export const TRACKS: TrackDefinition[] = [
  {
    slug: "memory",
    title: "Memory",
    short: "DRAM & NAND footprint, packaging, and geography",
    cssVar: "var(--track-memory)",
    accentHex: "#a78bfa",
    researchPointers: [
      "Memory makers (Samsung, SK hynix, Micron) and HBM supply arcs",
      "Packaging/OSAT pins in Taiwan, Korea, and the US",
      "Toggle trade flows for KR↔CN and TW↔US memory-related flows",
    ],
  },
  {
    slug: "cpus",
    title: "CPUs",
    short: "Logic / processor vendors, fabs, and end markets",
    cssVar: "var(--track-cpus)",
    accentHex: "#34d399",
    researchPointers: [
      "Logic vendors (Intel, AMD, Apple, Qualcomm) and foundry supply links",
      "Export-controls scenario: equipment → SMIC and China domestic fabs",
      "Mature-node foundries (UMC, GlobalFoundries, SMIC) on trailing processes",
    ],
  },
  {
    slug: "gpus",
    title: "GPUs",
    short: "Accelerators, foundry capacity, and supply into DC & consumer",
    cssVar: "var(--track-gpus)",
    accentHex: "#f472b6",
    researchPointers: [
      "Accelerators (NVIDIA, AMD) and TSMC foundry + CoWoS packaging arcs",
      "HBM memory_supply layer — SK hynix, Samsung, Micron → NVIDIA/AMD",
      "Constrained-packaging and HBM-shortage scenarios for AI supply stories",
    ],
  },
  {
    slug: "data-centers",
    title: "Data centers",
    short: "Hyperscale demand, accelerators, and power / geography",
    cssVar: "var(--track-data-centers)",
    accentHex: "#38bdf8",
    researchPointers: [
      "Hyperscale supply chain: accelerators, networking ASICs, EMS assembly",
      "Foxconn → NVIDIA server assembly; Broadcom networking silicon",
      "Trade flows for equipment and finished chips into US data-center build-out",
    ],
  },
];

export function getTrack(slug: string): TrackDefinition | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

export function isTrackSlug(s: string): s is TrackSlug {
  return TRACKS.some((t) => t.slug === s);
}
