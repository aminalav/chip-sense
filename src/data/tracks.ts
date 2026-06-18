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
      "WSTS product category: Memory (verify year definitions)",
      "UN Comtrade HS subheadings for memory ICs (verify codes per year)",
    ],
  },
  {
    slug: "cpus",
    title: "CPUs",
    short: "Logic / processor vendors, fabs, and end markets",
    cssVar: "var(--track-cpus)",
    accentHex: "#34d399",
    researchPointers: [
      "x86 / Arm revenue segments in 10-K geographic splits",
      "Leading-edge fab operator disclosures",
    ],
  },
  {
    slug: "gpus",
    title: "GPUs",
    short: "Accelerators, foundry capacity, and supply into DC & consumer",
    cssVar: "var(--track-gpus)",
    accentHex: "#f472b6",
    researchPointers: [
      "Datacenter vs gaming segment reporting (NVIDIA, AMD)",
      "CoWoS / advanced packaging news flow (cite dated articles)",
    ],
  },
  {
    slug: "data-centers",
    title: "Data centers",
    short: "Hyperscale demand, accelerators, and power / geography",
    cssVar: "var(--track-data-centers)",
    accentHex: "#38bdf8",
    researchPointers: [
      "Cloud capex calls (operator IR)",
      "GPU / accelerator attach to cloud growth (your model)",
    ],
  },
];

export function getTrack(slug: string): TrackDefinition | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

export function isTrackSlug(s: string): s is TrackSlug {
  return TRACKS.some((t) => t.slug === s);
}
