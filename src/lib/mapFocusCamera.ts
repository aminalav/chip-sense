import type { GraphEdge, GraphNode, TradeFlowRecord } from "@/data/graph";

export interface MapFocusTarget {
  longitude: number;
  latitude: number;
  zoom?: number;
  pulseNodeId?: string;
}

function midpoint(a: [number, number], b: [number, number]): [number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export function computeMapFocusTarget(
  selectedNode: GraphNode | null,
  selectedEdge: GraphEdge | null,
  selectedTradeFlow: TradeFlowRecord | null | undefined,
  nodeById: Map<string, GraphNode>,
): MapFocusTarget | null {
  if (selectedNode?.coordinates) {
    return {
      longitude: selectedNode.coordinates[0],
      latitude: selectedNode.coordinates[1],
      zoom: 3.4,
      pulseNodeId: selectedNode.id,
    };
  }

  if (selectedEdge) {
    const from = nodeById.get(selectedEdge.source);
    const to = nodeById.get(selectedEdge.target);
    if (from?.coordinates && to?.coordinates) {
      const [longitude, latitude] = midpoint(from.coordinates, to.coordinates);
      return { longitude, latitude, zoom: 2.8 };
    }
  }

  if (selectedTradeFlow) {
    const from = nodeById.get(selectedTradeFlow.exporter_country_id);
    const to = nodeById.get(selectedTradeFlow.importer_country_id);
    if (from?.coordinates && to?.coordinates) {
      const [longitude, latitude] = midpoint(from.coordinates, to.coordinates);
      return { longitude, latitude, zoom: 2.4 };
    }
  }

  return null;
}
