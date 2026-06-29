import type { Map as MapLibreMap } from "maplibre-gl";
import type { GraphEdge, GraphNode } from "@/data/graph";
import {
  NODE_ROLE_RING,
  nodeScenarioRole,
  type ScenarioEffects,
} from "@/lib/scenarioEffects";
import { showCountryPin } from "@/lib/mapLabels";
import { isCompanySegment, segmentColor } from "@/lib/segments";

const MAP_BACKGROUND = "#0a0a0f";
const ESSAY_RING_COLOR = "#fbbf24";

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

function activeCountryIds(nodes: GraphNode[], edges: GraphEdge[] | undefined): Set<string> {
  const ids = new Set<string>();
  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const e of edges ?? []) {
    if (e.kind !== "operates_in" && e.kind !== "hq_in") continue;
    if (!nodeIds.has(e.source) && !nodeIds.has(e.target)) continue;
    if (e.target.startsWith("country-")) ids.add(e.target);
  }
  return ids;
}

function pinFill(node: GraphNode): string {
  const rawSegment = node.meta?.segment;
  const segment = isCompanySegment(rawSegment) ? rawSegment : undefined;
  return segmentColor(segment) ?? kindColors[node.kind];
}

function pinRadiusPx(
  node: GraphNode,
  countryActive: boolean,
  essayMustShow: boolean,
  scale: number,
): number {
  let css = 12;
  if (node.kind === "country") css = countryActive ? 16 : 10;
  else if (node.kind === "presence") css = 8;
  else if (essayMustShow) css = 14;
  return (css / 2) * scale;
}

function shouldLabelPin(
  node: GraphNode,
  zoom: number,
  selectedNodeId: string | null | undefined,
  labelAll: boolean,
  countryActive: boolean,
  tradeCountryIds: Set<string>,
  effects: ScenarioEffects | null,
): boolean {
  if (selectedNodeId === node.id) return true;
  if (node.kind === "country") {
    if (!showCountryPin(node, zoom, countryActive, tradeCountryIds)) return false;
    if (effects && nodeScenarioRole(effects, node.id) === "neutral") return false;
    return true;
  }
  if (labelAll) return true;
  switch (node.kind) {
    case "company":
      return zoom >= 2.6;
    case "fab":
      return zoom >= 4;
    case "presence":
      return zoom >= 4.5;
    default:
      return zoom >= 4;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawPin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  options: {
    borderWidth: number;
    essayRing?: string;
    scenarioRing?: string;
    selected?: boolean;
    opacity?: number;
  },
) {
  const { borderWidth, essayRing, scenarioRing, selected, opacity = 1 } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  if (scenarioRing) {
    ctx.beginPath();
    ctx.arc(x, y, radius + borderWidth + 2, 0, Math.PI * 2);
    ctx.strokeStyle = scenarioRing;
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (essayRing) {
    ctx.beginPath();
    ctx.arc(x, y, radius + borderWidth + 2, 0, Math.PI * 2);
    ctx.strokeStyle = essayRing;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (selected) {
    ctx.beginPath();
    ctx.arc(x, y, radius + borderWidth + 3, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = MAP_BACKGROUND;
  ctx.lineWidth = borderWidth;
  ctx.stroke();

  ctx.restore();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  scale: number,
) {
  const fontSize = 10 * scale;
  ctx.font = `500 ${fontSize}px system-ui, -apple-system, sans-serif`;
  const paddingX = 6 * scale;
  const paddingY = 2 * scale;
  const textWidth = ctx.measureText(text).width;
  const boxW = textWidth + paddingX * 2;
  const boxH = fontSize + paddingY * 2;
  const boxX = x - boxW / 2;
  const boxY = y;

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  roundRect(ctx, boxX, boxY, boxW, boxH, 3 * scale);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, boxY + boxH / 2);
}

export interface ExportMapOptions {
  map: MapLibreMap;
  nodes: GraphNode[];
  edges?: GraphEdge[];
  effects?: ScenarioEffects | null;
  selectedNodeId?: string | null;
  /** Label every non-country pin (good for teaching / small views). */
  labelAllPins?: boolean;
}

/** Composite map canvas + projected pin markers into a PNG data URL. */
export function exportMapWithPins({
  map,
  nodes,
  edges,
  effects = null,
  selectedNodeId = null,
  labelAllPins,
}: ExportMapOptions): string {
  map.triggerRepaint();
  const mapCanvas = map.getCanvas();
  const scale = mapCanvas.width / mapCanvas.clientWidth;
  const zoom = map.getZoom();
  const points = nodes.filter((n) => n.coordinates != null);
  const countries = activeCountryIds(nodes, edges);
  const labelAll = labelAllPins ?? points.length <= 30;

  const out = document.createElement("canvas");
  out.width = mapCanvas.width;
  out.height = mapCanvas.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Could not create export canvas");

  ctx.drawImage(mapCanvas, 0, 0);

  type PinDraw = {
    x: number;
    y: number;
    node: GraphNode;
    radius: number;
    fill: string;
    opacity: number;
    essayRing?: string;
    scenarioRing?: string;
    selected: boolean;
    label?: string;
    labelY: number;
  };

  const pinDraws: PinDraw[] = [];

  for (const node of points) {
    const [lng, lat] = node.coordinates!;
    const projected = map.project([lng, lat]);
    const x = projected.x * scale;
    const y = projected.y * scale;
    const essayMustShow = node.meta?.must_show_essay_1 === true;
    const countryActive = node.kind === "country" && countries.has(node.id);
    const scenarioRole = nodeScenarioRole(effects, node.id);
    const scenarioRing = NODE_ROLE_RING[scenarioRole];
    const radius = pinRadiusPx(node, countryActive, essayMustShow, scale);
    const pinCenterY = y - radius - 4 * scale;
    const fill = pinFill(node);
    const opacity =
      scenarioRole === "chokepoint" ? 0.65 : node.kind === "presence" ? 0.92 : 1;

    const showLabel = shouldLabelPin(
      node,
      zoom,
      selectedNodeId,
      labelAll,
      countryActive,
      new Set<string>(),
      effects,
    );
    const labelY = pinCenterY + radius + 6 * scale;

    pinDraws.push({
      x,
      y: pinCenterY,
      node,
      radius,
      fill,
      opacity,
      essayRing:
        essayMustShow && !scenarioRing && selectedNodeId !== node.id
          ? ESSAY_RING_COLOR
          : undefined,
      scenarioRing: scenarioRing && selectedNodeId !== node.id ? scenarioRing : undefined,
      selected: selectedNodeId === node.id,
      label: showLabel ? mapMarkerLabel(node) : undefined,
      labelY,
    });
  }

  // Labels below pins, then pins on top (matches on-screen stacking).
  for (const pin of pinDraws) {
    if (pin.label) {
      drawLabel(ctx, pin.label, pin.x, pin.labelY, scale);
    }
  }

  const borderWidth = Math.max(2, 2 * scale);
  for (const pin of pinDraws) {
    drawPin(ctx, pin.x, pin.y, pin.radius, pin.fill, {
      borderWidth,
      essayRing: pin.essayRing,
      scenarioRing: pin.scenarioRing,
      selected: pin.selected,
      opacity: pin.opacity,
    });
  }

  return out.toDataURL("image/png");
}

/** Wait for tiles/layers to finish, then export. */
export function exportMapWhenReady(
  options: ExportMapOptions,
  onReady: (dataUrl: string) => void,
  onError?: (err: unknown) => void,
) {
  const { map } = options;
  const run = () => {
    try {
      onReady(exportMapWithPins(options));
    } catch (err) {
      onError?.(err);
    }
  };

  const afterIdle = () => {
    map.once("idle", run);
    map.triggerRepaint();
  };

  if (map.loaded()) {
    afterIdle();
  } else {
    map.once("load", afterIdle);
  }
}
