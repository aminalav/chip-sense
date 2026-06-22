import type { GraphEdge } from "@/data/graph";

const EDGE_KIND_LABEL: Partial<Record<GraphEdge["kind"], string>> = {
  supplies: "Foundry supply",
  equips: "Equipment",
  packages: "Packaging",
  memory_supply: "Memory supply",
  assembles: "Assembly",
  operates: "Operates",
  operates_in: "Operating footprint",
  hq_in: "Headquarters",
  located_in: "Located in",
  exposed_to_category: "Category exposure",
  trade: "Trade flow",
};

export function edgeKindLabel(kind: GraphEdge["kind"]): string {
  return EDGE_KIND_LABEL[kind] ?? kind.replace(/_/g, " ");
}

/** Drop duplicate structural edges that share kind + endpoints. */
export function dedupeRelatedEdges(edges: GraphEdge[]): GraphEdge[] {
  const seen = new Set<string>();
  const out: GraphEdge[] = [];
  for (const edge of edges) {
    const key = `${edge.kind}:${edge.source}:${edge.target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(edge);
  }
  return out;
}
