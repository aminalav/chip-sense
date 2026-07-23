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
};

export function edgeKindLabel(kind: GraphEdge["kind"]): string {
  return EDGE_KIND_LABEL[kind] ?? kind.replace(/_/g, " ");
}

/** Verb phrase from supplier (source) to customer (target) for each supply-chain edge kind. */
const EDGE_KIND_VERB: Partial<Record<GraphEdge["kind"], string>> = {
  supplies: "fabricates wafers for",
  equips: "supplies equipment to",
  packages: "packages chips for",
  memory_supply: "supplies memory to",
  assembles: "assembles products for",
};

/**
 * Plain-language, directional description of an edge, e.g. "ASE packages chips for NVIDIA."
 * Falls back to "A → B" for structural edges without a supply-chain verb.
 */
export function edgeRelationshipSentence(
  kind: GraphEdge["kind"],
  fromLabel: string,
  toLabel: string,
): string {
  const verb = EDGE_KIND_VERB[kind];
  return verb ? `${fromLabel} ${verb} ${toLabel}.` : `${fromLabel} → ${toLabel}`;
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
