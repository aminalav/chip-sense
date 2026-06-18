import type { SupplyGraph } from "@/data/graph";
import seed from "@/data/seed-graph.json";
import { applyCompanyRecords } from "@/lib/companyRecords";
import { applyGeography } from "@/lib/geography";

export function loadGraph(): SupplyGraph {
  const graph = seed as SupplyGraph;
  return applyGeography({
    ...graph,
    nodes: applyCompanyRecords(graph.nodes),
  });
}
