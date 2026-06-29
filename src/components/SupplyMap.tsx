"use client";

import { forwardRef, useCallback, useMemo, useState } from "react";
import MapGL, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import type { FeatureCollection, LineString } from "geojson";
import type { GraphEdge, GraphNode, TradeFlowRecord } from "@/data/graph";
import {
  NODE_ROLE_LABEL,
  NODE_ROLE_RING,
  SCENARIO_PRESENTATION,
  edgeScenarioRole,
  nodeScenarioRole,
  type ScenarioEffects,
} from "@/lib/scenarioEffects";
import { computeScenarioEmphasis, isScenarioPinDimmed } from "@/lib/scenarioEmphasis";
import { ScenarioArcLayers } from "@/components/ScenarioArcLayers";
import { SEGMENT_LABEL, SEGMENT_LEGEND, isCompanySegment, segmentColor } from "@/lib/segments";
import {
  computeFocusedPinIds,
  isPinDimmed,
  visibleCompanyArcLayerCount,
} from "@/lib/mapFocus";
import {
  MAP_ARC_CASING,
  MAP_CLICK_RADIUS_PX,
  MAP_DIMMED_PIN_OPACITY,
  MAP_FRAME_CLASS,
  MAP_HIT_LINE_WIDTH,
  MAP_PIN_HIT_CLASS,
  MARKER_LABEL_CLASS,
  MARKER_TAG_CLASS,
  arcLayerOpacityScale,
  showCountryPin,
  showMarkerLabel,
} from "@/lib/mapLabels";

import type { FilterSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function ArcCasingLayer({
  id,
  sourceId,
  lineWidth,
  filter,
}: {
  id: string;
  sourceId: string;
  lineWidth: number;
  filter?: FilterSpecification;
}) {
  return (
    <Layer
      id={id}
      source={sourceId}
      type="line"
      {...(filter ? { filter } : {})}
      paint={{
        "line-color": MAP_ARC_CASING.color,
        "line-width": lineWidth + MAP_ARC_CASING.widthExtra,
        "line-opacity": MAP_ARC_CASING.opacity,
      }}
    />
  );
}

const SUPPLY_LINES_SOURCE_ID = "supply-lines";
const EQUIPS_LINES_SOURCE_ID = "equips-lines";
const PACKAGING_LINES_SOURCE_ID = "packaging-lines";
const MEMORY_LINES_SOURCE_ID = "memory-lines";
const ASSEMBLY_LINES_SOURCE_ID = "assembly-lines";
const TRADE_LINES_SOURCE_ID = "trade-lines";
const EQUIP_LINE_COLOR = "#c084fc";
const PACKAGING_LINE_COLOR = "#f59e0b";
const MEMORY_LINE_COLOR = "#f472b6";
const ASSEMBLY_LINE_COLOR = "#2dd4bf";
const TRADE_LINE_COLOR = "#818cf8";

const MAP_STYLE = {
  version: 8 as const,
  name: "chip-sense-raster",
  sources: {
    "osm-raster": {
      type: "raster" as const,
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm-raster-layer",
      type: "raster" as const,
      source: "osm-raster",
    },
  ],
};

const kindColors: Record<GraphNode["kind"], string> = {
  company: "#34d399",
  fab: "#fbbf24",
  presence: "#60a5fa",
  country: "#94a3b8",
  product_category: "#a78bfa",
  end_market: "#38bdf8",
};

function mapMarkerLabel(node: GraphNode): string {
  const maxLen = 28;
  const label = node.label.trim();
  if (label.length <= maxLen) return label;
  return `${label.slice(0, maxLen - 1)}…`;
}

function markerTag(kind: GraphNode["kind"]): string {
  switch (kind) {
    case "fab":
      return "Fab";
    case "presence":
      return "Ops";
    case "company":
      return "HQ";
    case "country":
      return "";
    default:
      return "";
  }
}

/**
 * Persistent marker labels are gated by zoom — see mapLabels.ts.
 */
function NodeHoverCard({ node }: { node: GraphNode }) {
  const rawSegment = node.meta?.segment;
  const segment = isCompanySegment(rawSegment) ? rawSegment : undefined;
  const location = node.meta?.hq_city ?? node.meta?.hq_country ?? node.meta?.city;
  const body =
    node.meta?.description ?? node.meta?.specialization ?? node.meta?.notes ?? null;
  return (
    <div className="max-w-[260px] space-y-1 text-left">
      <p className="text-[13px] font-semibold leading-tight text-slate-900">{node.label}</p>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {segment ? SEGMENT_LABEL[segment] : node.kind.replace(/_/g, " ")}
        {node.meta?.founded ? ` · est. ${node.meta.founded}` : ""}
      </p>
      {location ? <p className="text-[11px] text-slate-600">{location}</p> : null}
      {body ? <p className="text-[11px] leading-snug text-slate-700">{body}</p> : null}
      <p className="text-[10px] italic text-slate-400">Click for full profile & connections</p>
    </div>
  );
}

function buildCompanyHqLines(
  edges: GraphEdge[] | undefined,
  kind: "supplies" | "equips" | "packages" | "memory_supply" | "assembles",
  nodeById: globalThis.Map<string, GraphNode>,
  visibleNodeIds: Set<string>,
  essay1Only: boolean,
  effects: ScenarioEffects | null,
): FeatureCollection<LineString> {
  const features: FeatureCollection<LineString>["features"] = [];
  for (const edge of edges ?? []) {
    if (edge.kind !== kind) continue;
    if (essay1Only && (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target))) {
      continue;
    }
    const from = nodeById.get(edge.source);
    const to = nodeById.get(edge.target);
    if (from?.kind !== "company" || to?.kind !== "company") continue;
    if (!from.coordinates || !to.coordinates) continue;
    const cited = edge.facts
      ? Object.values(edge.facts).some((f) => (f.source_ids?.length ?? 0) > 0)
      : false;
    features.push({
      type: "Feature",
      properties: {
        id: edge.id,
        cited,
        scenarioRole: edgeScenarioRole(effects, edge.id),
        from: from.label,
        to: to.label,
      },
      geometry: {
        type: "LineString",
        coordinates: [from.coordinates, to.coordinates],
      },
    });
  }
  return { type: "FeatureCollection", features };
}

export const SupplyMap = forwardRef<MapRef, {
  nodes: GraphNode[];
  edges?: GraphEdge[];
  accentHex: string;
  effects?: ScenarioEffects | null;
  essay1Only: boolean;
  showSupplyLines: boolean;
  showEquips: boolean;
  showPackaging: boolean;
  showMemory: boolean;
  showAssembly: boolean;
  showTradeFlows: boolean;
  focusConnections: boolean;
  tradeFlows?: TradeFlowRecord[];
  tradeLines?: FeatureCollection<LineString> | null;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onSelectEdge?: (edgeId: string) => void;
}>(function SupplyMap(
  {
    nodes,
    edges,
    accentHex,
    effects = null,
    essay1Only,
    showSupplyLines,
    showEquips,
    showPackaging,
    showMemory,
    showAssembly,
    showTradeFlows,
    focusConnections,
    tradeFlows = [],
    tradeLines = null,
    selectedNodeId = null,
    onSelectNode,
    onSelectEdge,
  },
  ref,
) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const [mapCursor, setMapCursor] = useState<"grab" | "pointer">("grab");

  const nodeById = useMemo(
    () => new globalThis.Map(nodes.map((n) => [n.id, n] as const)),
    [nodes],
  );

  const allPoints = useMemo(
    () =>
      nodes.filter(
        (n) =>
          n.coordinates &&
          (n.kind === "fab" ||
            n.kind === "company" ||
            n.kind === "country" ||
            n.kind === "presence"),
      ),
    [nodes],
  );

  const points = useMemo(() => {
    if (!essay1Only) return allPoints;
    return allPoints.filter((n) => n.meta?.must_show_essay_1 === true);
  }, [allPoints, essay1Only]);

  const visibleNodeIds = useMemo(() => new Set(points.map((p) => p.id)), [points]);

  const activeCountryIds = useMemo(() => {
    const ids = new Set<string>();
    const nodeIds = new Set(nodes.map((n) => n.id));
    for (const e of edges ?? []) {
      if (e.kind !== "operates_in" && e.kind !== "hq_in") continue;
      if (!nodeIds.has(e.source) && !nodeIds.has(e.target)) continue;
      if (e.target.startsWith("country-")) ids.add(e.target);
    }
    return ids;
  }, [edges, nodes]);

  const initialView = useMemo(() => {
    if (points.length === 0) {
      return { longitude: 150, latitude: 20, zoom: 1.1 };
    }
    // Pacific-centered frame: the chip world spans the Americas to East Asia.
    // Centering on the raw lng/lat centroid lands in the empty Atlantic/Sahara
    // with all pins off-screen, so shift the western hemisphere east of the
    // Atlantic cut into a contiguous [~ -30..330] range before averaging.
    const lngs = points.map((p) => {
      const lng = p.coordinates![0];
      return lng < -30 ? lng + 360 : lng;
    });
    const lats = points.map((p) => p.coordinates![1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const centerLng = (minLng + maxLng) / 2;
    const lngSpan = maxLng - minLng;
    const latSpan = maxLat - minLat;
    const zoom = lngSpan > 180 || latSpan > 100 ? 1.1 : lngSpan > 80 ? 1.6 : 2.4;
    return {
      longitude: centerLng > 180 ? centerLng - 360 : centerLng,
      latitude: (minLat + maxLat) / 2,
      zoom,
    };
  }, [points]);

  const supplyLines = useMemo(
    () => buildCompanyHqLines(edges, "supplies", nodeById, visibleNodeIds, essay1Only, effects),
    [edges, effects, essay1Only, nodeById, visibleNodeIds],
  );

  const equipsLines = useMemo(
    () => buildCompanyHqLines(edges, "equips", nodeById, visibleNodeIds, essay1Only, effects),
    [edges, effects, essay1Only, nodeById, visibleNodeIds],
  );

  const packagingLines = useMemo(
    () => buildCompanyHqLines(edges, "packages", nodeById, visibleNodeIds, essay1Only, effects),
    [edges, effects, essay1Only, nodeById, visibleNodeIds],
  );

  const memoryLines = useMemo(
    () => buildCompanyHqLines(edges, "memory_supply", nodeById, visibleNodeIds, essay1Only, effects),
    [edges, effects, essay1Only, nodeById, visibleNodeIds],
  );

  const assemblyLines = useMemo(
    () => buildCompanyHqLines(edges, "assembles", nodeById, visibleNodeIds, essay1Only, effects),
    [edges, effects, essay1Only, nodeById, visibleNodeIds],
  );

  const supplyLineCount = supplyLines.features.length;
  const equipsLineCount = equipsLines.features.length;
  const packagingLineCount = packagingLines.features.length;
  const memoryLineCount = memoryLines.features.length;
  const assemblyLineCount = assemblyLines.features.length;
  const tradeLineCount = tradeLines?.features.length ?? 0;

  const mapFocus = useMemo(
    () =>
      computeFocusedPinIds(
        {
          focusConnections,
          showSupplyLines,
          showEquips,
          showPackaging,
          showMemory,
          showAssembly,
          showTradeFlows,
          edges: edges ?? [],
          tradeFlows,
          supplyLineCount,
          equipsLineCount,
          packagingLineCount,
          memoryLineCount,
          assemblyLineCount,
          tradeLineCount,
        },
        nodeById,
      ),
    [
      focusConnections,
      showSupplyLines,
      showEquips,
      showPackaging,
      showMemory,
      showAssembly,
      showTradeFlows,
      edges,
      tradeFlows,
      supplyLineCount,
      equipsLineCount,
      packagingLineCount,
      memoryLineCount,
      assemblyLineCount,
      tradeLineCount,
      nodeById,
    ],
  );

  const scenarioEmphasis = useMemo(
    () => computeScenarioEmphasis(effects, edges ?? []),
    [effects, edges],
  );

  const visibleLayerCount = visibleCompanyArcLayerCount({
    showSupplyLines,
    showEquips,
    showPackaging,
    showMemory,
    showAssembly,
    showTradeFlows,
  });

  const arcOpacityScale = arcLayerOpacityScale(visibleLayerCount);

  const tradeCountryIds = useMemo(() => {
    if (!showTradeFlows) return new Set<string>();
    const ids = new Set<string>();
    for (const flow of tradeFlows) {
      ids.add(flow.exporter_country_id);
      ids.add(flow.importer_country_id);
    }
    return ids;
  }, [showTradeFlows, tradeFlows]);

  const hoveredNode = hoveredNodeId ? (nodeById.get(hoveredNodeId) ?? null) : null;

  const hitLayerIds = useMemo(() => {
    const ids: string[] = [];
    if (onSelectEdge && showSupplyLines && supplyLineCount > 0) ids.push("supply-lines-hit");
    if (onSelectEdge && showEquips && equipsLineCount > 0) ids.push("equips-lines-hit");
    if (onSelectEdge && showPackaging && packagingLineCount > 0) ids.push("packaging-lines-hit");
    if (onSelectEdge && showMemory && memoryLineCount > 0) ids.push("memory-lines-hit");
    if (onSelectEdge && showAssembly && assemblyLineCount > 0) ids.push("assembly-lines-hit");
    if (onSelectEdge && showTradeFlows && tradeLineCount > 0) ids.push("trade-lines-hit");
    return ids;
  }, [onSelectEdge, showSupplyLines, supplyLineCount, showEquips, equipsLineCount, showPackaging, packagingLineCount, showMemory, memoryLineCount, showAssembly, assemblyLineCount, showTradeFlows, tradeLineCount]);

  const handleMapClick = useCallback(
    (evt: MapLayerMouseEvent) => {
      if (!onSelectEdge || hitLayerIds.length === 0) return;
      let hit = evt.features?.find((f) => hitLayerIds.includes(f.layer.id));
      if (!hit) {
        const { x, y } = evt.point;
        const box: [[number, number], [number, number]] = [
          [x - MAP_CLICK_RADIUS_PX, y - MAP_CLICK_RADIUS_PX],
          [x + MAP_CLICK_RADIUS_PX, y + MAP_CLICK_RADIUS_PX],
        ];
        hit = evt.target.queryRenderedFeatures(box, { layers: hitLayerIds })[0];
      }
      const id = hit?.properties?.id;
      if (typeof id === "string") onSelectEdge(id);
    },
    [onSelectEdge, hitLayerIds],
  );

  const handleMapMouseMove = useCallback(
    (evt: MapLayerMouseEvent) => {
      if (hitLayerIds.length === 0) {
        setMapCursor("grab");
        return;
      }
      const overLine = evt.features?.some((f) => hitLayerIds.includes(f.layer.id));
      setMapCursor(overLine ? "pointer" : "grab");
    },
    [hitLayerIds],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <details className="relative z-20 shrink-0 rounded-lg bg-black/20 px-3 py-1.5 text-[10px] text-[var(--muted)]">
        <summary className="cursor-pointer select-none text-[11px] font-medium text-[var(--foreground)]/75">
          Map legend
        </summary>
        <div className="mt-2 flex flex-wrap gap-3">
        {SEGMENT_LEGEND.map((seg) => (
          <span key={seg.group}>
            <span
              className="mr-1 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />{" "}
            {seg.label}
          </span>
        ))}
        <span>
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#94a3b8] ring-1 ring-white/40" />{" "}
          Country (highlighted = active footprint)
        </span>
        <span className="text-[var(--muted)]/80">
          (HQ pins ringed; fab pins solid; ops pins smaller — all colored by segment)
        </span>
        <span>
          <span
            className="mr-1 inline-block h-0.5 w-4 border-t-2 border-dashed align-middle"
            style={{ borderColor: accentHex }}
          />{" "}
          foundry supply (HQ → HQ)
        </span>
        <span>
          <span
            className="mr-1 inline-block h-0.5 w-4 border-t-2 border-dashed align-middle"
            style={{ borderColor: EQUIP_LINE_COLOR }}
          />{" "}
          equipment (HQ → HQ)
        </span>
        <span>
          <span
            className="mr-1 inline-block h-0.5 w-4 border-t-2 border-dashed align-middle"
            style={{ borderColor: PACKAGING_LINE_COLOR }}
          />{" "}
          packaging / OSAT (HQ → HQ)
        </span>
        <span>
          <span
            className="mr-1 inline-block h-0.5 w-4 border-t-2 border-dashed align-middle"
            style={{ borderColor: MEMORY_LINE_COLOR }}
          />{" "}
          HBM / memory (HQ → HQ)
        </span>
        <span>
          <span
            className="mr-1 inline-block h-0.5 w-4 border-t-2 border-dashed align-middle"
            style={{ borderColor: ASSEMBLY_LINE_COLOR }}
          />{" "}
          assembly / EMS (HQ → HQ)
        </span>
        <span>
          <span
            className="mr-1 inline-block h-0.5 w-4 align-middle"
            style={{ borderColor: TRADE_LINE_COLOR, borderTopWidth: 2 }}
          />{" "}
          trade (country → country)
        </span>
        {effects ? (
          <>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full ring-2 ring-[#f87171]" />{" "}
              Chokepoint / disrupted
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full ring-2 ring-[#34d399]" />{" "}
              Partial relief
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full ring-2 ring-[#22d3ee]" />{" "}
              Substitution buffer
            </span>
          </>
        ) : null}
        </div>
      </details>
      <div className={`${MAP_FRAME_CLASS} min-h-[min(75vh,880px)]`}>
        <MapGL
          ref={ref}
          initialViewState={initialView}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLE}
          canvasContextAttributes={{ preserveDrawingBuffer: true }}
          cursor={mapCursor}
          interactiveLayerIds={hitLayerIds.length > 0 ? hitLayerIds : undefined}
          onClick={onSelectEdge ? handleMapClick : undefined}
          onMouseMove={onSelectEdge ? handleMapMouseMove : undefined}
          onMouseLeave={onSelectEdge ? () => setMapCursor("grab") : undefined}
          onLoad={(e) => setZoom(e.target.getZoom())}
          onZoomEnd={(e) => setZoom(e.viewState.zoom)}
        >
          <NavigationControl position="top-right" />
          {showSupplyLines && supplyLineCount > 0 && (
            <Source id={SUPPLY_LINES_SOURCE_ID} type="geojson" data={supplyLines}>
              {!effects ? (
                <ArcCasingLayer
                  id="supply-lines-uncited-casing"
                  sourceId={SUPPLY_LINES_SOURCE_ID}
                  lineWidth={1.5}
                  filter={["==", ["get", "cited"], false]}
                />
              ) : null}
              {!effects ? (
                <Layer
                  id="supply-lines-uncited"
                  source={SUPPLY_LINES_SOURCE_ID}
                  type="line"
                  filter={["==", ["get", "cited"], false]}
                  paint={{
                    "line-color": "#94a3b8",
                    "line-width": 1.75,
                    "line-opacity": 0.5 * arcOpacityScale,
                    "line-dasharray": [2, 2],
                  }}
                />
              ) : null}
              {!effects ? (
                <ArcCasingLayer
                  id="supply-lines-cited-casing"
                  sourceId={SUPPLY_LINES_SOURCE_ID}
                  lineWidth={2.75}
                  filter={["==", ["get", "cited"], true]}
                />
              ) : null}
              {!effects ? (
                <Layer
                  id="supply-lines-cited"
                  source={SUPPLY_LINES_SOURCE_ID}
                  type="line"
                  filter={["==", ["get", "cited"], true]}
                  paint={{
                    "line-color": accentHex,
                    "line-width": 2.75,
                    "line-opacity": 0.82 * arcOpacityScale,
                    "line-dasharray": [2, 1.5],
                  }}
                />
              ) : null}
              {effects ? (
                <ScenarioArcLayers
                  sourceId={SUPPLY_LINES_SOURCE_ID}
                  idPrefix="supply-lines"
                  arcOpacityScale={arcOpacityScale}
                />
              ) : null}
              {onSelectEdge ? (
                <Layer
                  id="supply-lines-hit"
                  source={SUPPLY_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": MAP_HIT_LINE_WIDTH,
                    "line-opacity": 0.01,
                  }}
                />
              ) : null}
            </Source>
          )}
          {showEquips && equipsLineCount > 0 && (
            <Source id={EQUIPS_LINES_SOURCE_ID} type="geojson" data={equipsLines}>
              {!effects ? (
                <ArcCasingLayer
                  id="equips-lines-casing"
                  sourceId={EQUIPS_LINES_SOURCE_ID}
                  lineWidth={2.25}
                />
              ) : null}
              {!effects ? (
                <Layer
                  id="equips-lines-main"
                  source={EQUIPS_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": EQUIP_LINE_COLOR,
                    "line-width": 2.25,
                    "line-opacity": 0.78 * arcOpacityScale,
                    "line-dasharray": [3, 2],
                  }}
                />
              ) : null}
              {effects ? (
                <ScenarioArcLayers
                  sourceId={EQUIPS_LINES_SOURCE_ID}
                  idPrefix="equips-lines"
                  arcOpacityScale={arcOpacityScale}
                />
              ) : null}
              {onSelectEdge ? (
                <Layer
                  id="equips-lines-hit"
                  source={EQUIPS_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": MAP_HIT_LINE_WIDTH,
                    "line-opacity": 0.01,
                  }}
                />
              ) : null}
            </Source>
          )}
          {showPackaging && packagingLineCount > 0 && (
            <Source id={PACKAGING_LINES_SOURCE_ID} type="geojson" data={packagingLines}>
              {!effects ? (
                <ArcCasingLayer
                  id="packaging-lines-casing"
                  sourceId={PACKAGING_LINES_SOURCE_ID}
                  lineWidth={2.25}
                />
              ) : null}
              {!effects ? (
                <Layer
                  id="packaging-lines-main"
                  source={PACKAGING_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": PACKAGING_LINE_COLOR,
                    "line-width": 2.25,
                    "line-opacity": 0.78 * arcOpacityScale,
                    "line-dasharray": [1, 1.5],
                  }}
                />
              ) : null}
              {effects ? (
                <ScenarioArcLayers
                  sourceId={PACKAGING_LINES_SOURCE_ID}
                  idPrefix="packaging-lines"
                  arcOpacityScale={arcOpacityScale}
                />
              ) : null}
              {onSelectEdge ? (
                <Layer
                  id="packaging-lines-hit"
                  source={PACKAGING_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": MAP_HIT_LINE_WIDTH,
                    "line-opacity": 0.01,
                  }}
                />
              ) : null}
            </Source>
          )}
          {showMemory && memoryLineCount > 0 && (
            <Source id={MEMORY_LINES_SOURCE_ID} type="geojson" data={memoryLines}>
              {!effects ? (
                <ArcCasingLayer
                  id="memory-lines-casing"
                  sourceId={MEMORY_LINES_SOURCE_ID}
                  lineWidth={2.5}
                />
              ) : null}
              {!effects ? (
                <Layer
                  id="memory-lines-main"
                  source={MEMORY_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": MEMORY_LINE_COLOR,
                    "line-width": 2.5,
                    "line-opacity": 0.82 * arcOpacityScale,
                    "line-dasharray": [4, 2],
                  }}
                />
              ) : null}
              {effects ? (
                <ScenarioArcLayers
                  sourceId={MEMORY_LINES_SOURCE_ID}
                  idPrefix="memory-lines"
                  arcOpacityScale={arcOpacityScale}
                />
              ) : null}
              {onSelectEdge ? (
                <Layer
                  id="memory-lines-hit"
                  source={MEMORY_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": MAP_HIT_LINE_WIDTH,
                    "line-opacity": 0.01,
                  }}
                />
              ) : null}
            </Source>
          )}
          {showAssembly && assemblyLineCount > 0 && (
            <Source id={ASSEMBLY_LINES_SOURCE_ID} type="geojson" data={assemblyLines}>
              {!effects ? (
                <ArcCasingLayer
                  id="assembly-lines-casing"
                  sourceId={ASSEMBLY_LINES_SOURCE_ID}
                  lineWidth={2}
                />
              ) : null}
              {!effects ? (
                <Layer
                  id="assembly-lines-main"
                  source={ASSEMBLY_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": ASSEMBLY_LINE_COLOR,
                    "line-width": 2,
                    "line-opacity": 0.72 * arcOpacityScale,
                    "line-dasharray": [2, 2.5],
                  }}
                />
              ) : null}
              {effects ? (
                <ScenarioArcLayers
                  sourceId={ASSEMBLY_LINES_SOURCE_ID}
                  idPrefix="assembly-lines"
                  arcOpacityScale={arcOpacityScale}
                />
              ) : null}
              {onSelectEdge ? (
                <Layer
                  id="assembly-lines-hit"
                  source={ASSEMBLY_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": MAP_HIT_LINE_WIDTH,
                    "line-opacity": 0.01,
                  }}
                />
              ) : null}
            </Source>
          )}
          {showTradeFlows && tradeLines && tradeLineCount > 0 && (
            <Source id={TRADE_LINES_SOURCE_ID} type="geojson" data={tradeLines}>
              <Layer
                id="trade-lines-casing"
                source={TRADE_LINES_SOURCE_ID}
                type="line"
                paint={{
                  "line-color": MAP_ARC_CASING.color,
                  "line-width": ["+", ["get", "width"], MAP_ARC_CASING.widthExtra],
                  "line-opacity": 0.88,
                }}
              />
              <Layer
                id="trade-lines-main"
                source={TRADE_LINES_SOURCE_ID}
                type="line"
                paint={{
                  "line-color": TRADE_LINE_COLOR,
                  "line-width": ["get", "width"],
                  "line-opacity": 0.62 * arcOpacityScale,
                }}
              />
              {onSelectEdge ? (
                <Layer
                  id="trade-lines-hit"
                  source={TRADE_LINES_SOURCE_ID}
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": 16,
                    "line-opacity": 0.01,
                  }}
                />
              ) : null}
            </Source>
          )}
          {points.map((node) => {
            const [lng, lat] = node.coordinates!;
            const currentZoom = zoom ?? initialView.zoom;
            const rawSegment = node.meta?.segment;
            const segment = isCompanySegment(rawSegment) ? rawSegment : undefined;
            const ring = segmentColor(segment) ?? kindColors[node.kind];
            const scenarioNodeRole = nodeScenarioRole(effects, node.id);
            const scenarioRing = NODE_ROLE_RING[scenarioNodeRole];
            const scenarioHighlighted =
              scenarioEmphasis.active &&
              scenarioEmphasis.highlightedNodeIds.has(node.id);
            const essayMustShow = node.meta?.must_show_essay_1 === true;
            const countryActive =
              node.kind === "country" && activeCountryIds.has(node.id);
            if (!showCountryPin(node, currentZoom, countryActive, tradeCountryIds)) {
              return null;
            }
            const focusHighlighted =
              mapFocus.active && mapFocus.highlightedIds.has(node.id);
            const detail = [
              node.meta?.specialization,
              node.meta?.hq_country && `HQ: ${node.meta.hq_country}`,
              node.meta?.operating_countries?.length
                ? `Ops: ${node.meta.operating_countries.join(", ")}`
                : null,
              node.kind === "presence"
                ? "Operating presence (country-level; add fab pin when sourced)"
                : null,
              node.meta?.sourced ? "Sourced" : null,
              NODE_ROLE_LABEL[scenarioNodeRole]
                ? `Scenario: ${NODE_ROLE_LABEL[scenarioNodeRole]}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ");
            const size =
              node.kind === "country"
                ? countryActive
                  ? "h-4 w-4"
                  : "h-3 w-3"
                : node.kind === "presence"
                  ? "h-2.5 w-2.5"
                  : essayMustShow || focusHighlighted
                    ? "h-4 w-4"
                    : node.kind === "fab"
                      ? "h-3 w-3"
                      : "h-3.5 w-3.5";
            const isSelected = selectedNodeId === node.id;
            const labeled = showMarkerLabel(
              node,
              currentZoom,
              isSelected,
              hoveredNodeId === node.id,
              {
                focusHighlighted,
                essay1Only,
                countryPinVisible:
                  node.kind === "country"
                    ? !effects || scenarioNodeRole !== "neutral"
                    : undefined,
              },
            );
            const focusDimmed = isPinDimmed(
              node.id,
              mapFocus.active,
              mapFocus.highlightedIds,
              selectedNodeId,
              hoveredNodeId,
            );
            const scenarioDimmed = isScenarioPinDimmed(
              node.id,
              scenarioEmphasis,
              selectedNodeId,
              hoveredNodeId,
            );
            const pinOpacity = focusDimmed
              ? MAP_DIMMED_PIN_OPACITY
              : scenarioDimmed
                ? SCENARIO_PRESENTATION.neutralPinOpacity
                : 1;
            const pinScale =
              scenarioNodeRole !== "neutral"
                ? (SCENARIO_PRESENTATION.pinScale[scenarioNodeRole] ?? 1)
                : 1;
            return (
              <Marker key={node.id} longitude={lng} latitude={lat} anchor="bottom">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode?.(node.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() =>
                    setHoveredNodeId((cur) => (cur === node.id ? null : cur))
                  }
                  style={{
                    opacity: pinOpacity,
                    transform: pinScale !== 1 ? `scale(${pinScale})` : undefined,
                  }}
                  className={`flex ${MAP_PIN_HIT_CLASS} max-w-[10rem] cursor-pointer flex-col items-center gap-0.5 border-0 bg-transparent p-0 text-left transition-opacity ${
                    isSelected ? "z-10" : focusHighlighted || scenarioHighlighted ? "z-[5]" : ""
                  }`}
                >
                  <div
                    title={detail ? `${node.label}\n${detail}` : `${node.label} (${node.kind})`}
                    className={`shrink-0 rounded-full border-2 border-[var(--background)] shadow-md ${size} ${isSelected ? "ring-2 ring-white" : ""} ${essayMustShow && !scenarioRing && !isSelected ? "ring-2 ring-amber-400/90" : ""} ${countryActive && !scenarioRing && !isSelected ? "ring-2 ring-sky-400/80" : ""} ${scenarioRing && !isSelected ? "ring-[3px]" : ""}`}
                    style={{
                      backgroundColor: ring,
                      opacity:
                        scenarioNodeRole === "chokepoint"
                          ? 0.65
                          : node.kind === "presence"
                            ? 0.92
                            : 1,
                      ...(scenarioRing ? { boxShadow: `0 0 0 2px ${scenarioRing}` } : {}),
                      ...(!scenarioRing
                        ? {
                            boxShadow: essayMustShow
                              ? `0 0 0 2px ${accentHex}`
                              : countryActive
                                ? `0 0 0 2px #38bdf866`
                                : `0 0 0 1px ${accentHex}66`,
                          }
                        : {}),
                    }}
                  />
                  {labeled && markerTag(node.kind) && (
                    <span className={MARKER_TAG_CLASS}>{markerTag(node.kind)}</span>
                  )}
                  {labeled && (
                    <span title={node.label} className={MARKER_LABEL_CLASS}>
                      {mapMarkerLabel(node)}
                    </span>
                  )}
                </button>
              </Marker>
            );
          })}
          {hoveredNode && hoveredNode.coordinates ? (
            <Popup
              longitude={hoveredNode.coordinates[0]}
              latitude={hoveredNode.coordinates[1]}
              anchor="bottom"
              offset={18}
              closeButton={false}
              closeOnClick={false}
              maxWidth="280px"
              className="chip-sense-popup"
            >
              <NodeHoverCard node={hoveredNode} />
            </Popup>
          ) : null}
        </MapGL>
      </div>
    </div>
  );
});
