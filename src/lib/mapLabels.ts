import type { GraphNode } from "@/data/graph";

export interface MarkerLabelOptions {
  /** Pin is highlighted in focus-on-connections mode */
  focusHighlighted?: boolean;
  /** Core supply chain view is on */
  essay1Only?: boolean;
  /** Country pin passed showCountryPin (active footprint, trade, or zoom) */
  countryPinVisible?: boolean;
}

/**
 * When to show persistent name labels on pins (hover/selection always wins).
 */
export function showMarkerLabel(
  node: GraphNode,
  zoom: number,
  isSelected: boolean,
  isHovered: boolean,
  options: MarkerLabelOptions = {},
): boolean {
  if (isSelected || isHovered) return true;
  if (options.focusHighlighted) return true;
  if (options.essay1Only && node.meta?.must_show_essay_1 === true) return zoom >= 1.6;
  switch (node.kind) {
    case "company":
      return zoom >= 2.1;
    case "fab":
      return zoom >= 3.2;
    case "presence":
      return zoom >= 3.8;
    case "country":
      return options.countryPinVisible === true;
    default:
      return zoom >= 3.2;
  }
}

/** Hide inert country dots at world zoom — they add noise without trade context. */
export function showCountryPin(
  node: GraphNode,
  zoom: number,
  countryActive: boolean,
  tradeCountryIds: Set<string>,
): boolean {
  if (node.kind !== "country") return true;
  if (countryActive) return true;
  if (tradeCountryIds.has(node.id)) return true;
  return zoom >= 2.8;
}

/** Scale arc opacity when many layers are on at once. */
export function arcLayerOpacityScale(visibleLayerCount: number): number {
  if (visibleLayerCount <= 1) return 1;
  if (visibleLayerCount === 2) return 0.88;
  if (visibleLayerCount === 3) return 0.78;
  return 0.68;
}

export const MAP_ARC_CASING = {
  color: "#070a0f",
  widthExtra: 2.75,
  opacity: 0.92,
} as const;

/** Shared map canvas sizing — keep SupplyMap and loading placeholder in sync. */
export const MAP_FRAME_CLASS =
  "chip-sense-map-frame relative z-0 w-full min-h-[480px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-[var(--card)] ring-1 ring-white/5";

/** Invisible line layer width for arc picking (screen pixels). */
export const MAP_HIT_LINE_WIDTH = 24;

/** Extra pixel radius when a map click misses the default query box. */
export const MAP_CLICK_RADIUS_PX = 10;

/** Minimum DOM hit target for pin buttons (Tailwind spacing scale). */
export const MAP_PIN_HIT_CLASS = "min-h-10 min-w-10 justify-end";

export const MAP_DIMMED_PIN_OPACITY = 0.22;

export const MARKER_LABEL_CLASS =
  "rounded bg-black/90 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-tight text-white shadow-md ring-1 ring-white/25";

export const MARKER_TAG_CLASS =
  "rounded bg-black/85 px-1 text-[9px] font-medium text-white/95 ring-1 ring-white/15";
