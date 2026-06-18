import type { GraphEdge, SourceRecord } from "@/data/graph";
import sourceRecords from "@/data/sources.json";

export function loadSources(): SourceRecord[] {
  return sourceRecords as SourceRecord[];
}

export function sourceIdsFromEdges(edges: GraphEdge[]): string[] {
  const ids = new Set<string>();
  for (const edge of edges) {
    if (!edge.facts) continue;
    for (const fact of Object.values(edge.facts)) {
      for (const sourceId of fact.source_ids ?? []) {
        ids.add(sourceId);
      }
    }
  }
  return [...ids].sort();
}

/** Source IDs cited by visible map edges and (optionally) active trade flows. */
export function collectBoardSourceIds(
  edges: GraphEdge[],
  tradeFlows?: { source_ids?: string[] }[],
  includeTrade = false,
): string[] {
  const ids = new Set(sourceIdsFromEdges(edges));
  if (includeTrade && tradeFlows) {
    for (const flow of tradeFlows) {
      for (const sourceId of flow.source_ids ?? []) {
        ids.add(sourceId);
      }
    }
  }
  return [...ids].sort();
}
