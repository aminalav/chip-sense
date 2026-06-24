import type { GraphEdge, GraphNode, TradeFlowRecord } from "@/data/graph";

const COMPANY_ARC_KINDS = [
  "supplies",
  "equips",
  "packages",
  "memory_supply",
  "assembles",
] as const;

export interface MapFocusOptions {
  focusConnections: boolean;
  showSupplyLines: boolean;
  showEquips: boolean;
  showPackaging: boolean;
  showMemory: boolean;
  showAssembly: boolean;
  showTradeFlows: boolean;
  edges: GraphEdge[];
  tradeFlows: TradeFlowRecord[];
  supplyLineCount: number;
  equipsLineCount: number;
  packagingLineCount: number;
  memoryLineCount: number;
  assemblyLineCount: number;
  tradeLineCount: number;
}

function layerOnForKind(
  kind: (typeof COMPANY_ARC_KINDS)[number],
  options: MapFocusOptions,
): boolean {
  switch (kind) {
    case "supplies":
      return options.showSupplyLines;
    case "equips":
      return options.showEquips;
    case "packages":
      return options.showPackaging;
    case "memory_supply":
      return options.showMemory;
    case "assembles":
      return options.showAssembly;
  }
}

/** Pin IDs to keep at full opacity when focus mode is active. */
export function computeFocusedPinIds(
  options: MapFocusOptions,
  nodeById: Map<string, GraphNode>,
): { active: boolean; highlightedIds: Set<string> } {
  if (!options.focusConnections) {
    return { active: false, highlightedIds: new Set() };
  }

  const visibleArcCount =
    (options.showSupplyLines ? 1 : 0) +
    (options.showEquips ? 1 : 0) +
    (options.showPackaging ? 1 : 0) +
    (options.showMemory ? 1 : 0) +
    (options.showAssembly ? 1 : 0) +
    (options.showTradeFlows ? 1 : 0);

  const visibleLineCount =
    options.supplyLineCount +
    options.equipsLineCount +
    options.packagingLineCount +
    options.memoryLineCount +
    options.assemblyLineCount +
    options.tradeLineCount;

  if (visibleArcCount === 0 || visibleLineCount === 0) {
    return { active: false, highlightedIds: new Set() };
  }

  const highlightedIds = new Set<string>();

  for (const edge of options.edges) {
    if (!(COMPANY_ARC_KINDS as readonly string[]).includes(edge.kind)) continue;
    if (!layerOnForKind(edge.kind as (typeof COMPANY_ARC_KINDS)[number], options)) {
      continue;
    }
    const from = nodeById.get(edge.source);
    const to = nodeById.get(edge.target);
    if (from?.kind === "company") highlightedIds.add(edge.source);
    if (to?.kind === "company") highlightedIds.add(edge.target);
  }

  for (const edge of options.edges) {
    if (edge.kind !== "operates") continue;
    if (!highlightedIds.has(edge.source)) continue;
    const target = nodeById.get(edge.target);
    if (target?.kind === "fab") highlightedIds.add(edge.target);
  }

  if (options.showTradeFlows && options.tradeLineCount > 0) {
    for (const flow of options.tradeFlows) {
      highlightedIds.add(flow.exporter_country_id);
      highlightedIds.add(flow.importer_country_id);
    }
  }

  return { active: highlightedIds.size > 0, highlightedIds };
}

export function isPinDimmed(
  nodeId: string,
  focusActive: boolean,
  highlightedIds: Set<string>,
  selectedNodeId: string | null | undefined,
  hoveredNodeId: string | null | undefined,
): boolean {
  if (!focusActive) return false;
  if (nodeId === selectedNodeId || nodeId === hoveredNodeId) return false;
  return !highlightedIds.has(nodeId);
}

/** Count visible company-arc layer toggles (for helper copy). */
export function visibleCompanyArcLayerCount(options: Pick<
  MapFocusOptions,
  "showSupplyLines" | "showEquips" | "showPackaging" | "showMemory" | "showAssembly" | "showTradeFlows"
>): number {
  return (
    (options.showSupplyLines ? 1 : 0) +
    (options.showEquips ? 1 : 0) +
    (options.showPackaging ? 1 : 0) +
    (options.showMemory ? 1 : 0) +
    (options.showAssembly ? 1 : 0) +
    (options.showTradeFlows ? 1 : 0)
  );
}
