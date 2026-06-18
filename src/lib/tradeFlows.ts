import tradeData from "@/data/trade-flows.json";
import type { FeatureCollection, LineString } from "geojson";
import type { GraphNode, TradeFlowRecord, TrackSlug } from "@/data/graph";

interface TradeFlowsFile {
  version: number;
  flows: TradeFlowRecord[];
}

const TRADE_FILE = tradeData as TradeFlowsFile;

export function loadTradeFlows(): TradeFlowRecord[] {
  return TRADE_FILE.flows;
}

const RANK_WIDTH: Record<TradeFlowRecord["rank"], number> = {
  high: 3,
  medium: 2,
  low: 1.25,
};

/** Log-scaled stroke width when Comtrade (or override) value is present. */
export function tradeFlowLineWidth(flow: TradeFlowRecord): number {
  const v = flow.value_usd_millions;
  if (v != null && v > 0) {
    const log = Math.log10(v);
    const min = Math.log10(500);
    const max = Math.log10(50_000);
    const t = Math.min(1, Math.max(0, (log - min) / (max - min)));
    return 1.25 + t * 3.75;
  }
  return RANK_WIDTH[flow.rank];
}

export function tradeFlowsForTrack(
  flows: TradeFlowRecord[],
  track?: TrackSlug,
): TradeFlowRecord[] {
  if (!track) return flows;
  return flows.filter((f) => f.tracks.includes(track));
}

export function tradeFlowsToGeoJSON(
  flows: TradeFlowRecord[],
  countryNodes: GraphNode[],
): FeatureCollection<LineString> {
  const coordsById = new Map(
    countryNodes
      .filter((n) => n.kind === "country" && n.coordinates)
      .map((n) => [n.id, n.coordinates!] as const),
  );

  const features: FeatureCollection<LineString>["features"] = [];

  for (const flow of flows) {
    const from = coordsById.get(flow.exporter_country_id);
    const to = coordsById.get(flow.importer_country_id);
    if (!from || !to) continue;

    features.push({
      type: "Feature",
      properties: {
        id: flow.id,
        rank: flow.rank,
        width: tradeFlowLineWidth(flow),
        hs_label: flow.hs_label,
        year: flow.year,
        value_usd_millions: flow.value_usd_millions,
        cited: flow.source_ids.length > 0,
      },
      geometry: {
        type: "LineString",
        coordinates: [from, to],
      },
    });
  }

  return { type: "FeatureCollection", features };
}
