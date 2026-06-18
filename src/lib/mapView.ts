import type { GraphEdge, GraphNode, TrackSlug } from "@/data/graph";
import { COMPANY_RECORDS } from "@/lib/companyRecords";

const MAP_NODE_KINDS = new Set<GraphNode["kind"]>(["company", "fab", "country", "presence"]);

const REGISTRY_COMPANY_IDS = new Set(COMPANY_RECORDS.map((c) => c.id));

export interface MapViewOptions {
  /** Editorial track lens; omit for global board */
  track?: TrackSlug;
  /** Only nodes flagged must_show_essay_1 */
  essay1Only?: boolean;
  /** Country-level ops pins (blue); off by default on global board */
  includePresence?: boolean;
  /** Hide seed-only companies not in companies.json */
  registryOnly?: boolean;
}

export function nodesForMap(nodes: GraphNode[], options: MapViewOptions = {}): GraphNode[] {
  const {
    track,
    essay1Only = false,
    includePresence = false,
    registryOnly = true,
  } = options;

  return nodes.filter((n) => {
    if (!n.coordinates || !MAP_NODE_KINDS.has(n.kind)) return false;
    if (n.kind === "presence" && !includePresence) return false;
    if (track && !n.tracks.includes(track)) return false;
    if (essay1Only && n.meta?.must_show_essay_1 !== true) return false;
    if (n.kind === "company" && registryOnly && !REGISTRY_COMPANY_IDS.has(n.id)) {
      return false;
    }
    return true;
  });
}

export function edgesForMap(
  edges: GraphEdge[],
  visibleNodeIds: Set<string>,
  options: MapViewOptions = {},
): GraphEdge[] {
  const { track } = options;
  return edges.filter((e) => {
    if (track && !e.tracks.includes(track)) return false;
    return visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target);
  });
}

export function buildMapView(
  graph: { nodes: GraphNode[]; edges: GraphEdge[] },
  options: MapViewOptions = {},
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes = nodesForMap(graph.nodes, options);
  const visibleNodeIds = new Set(nodes.map((n) => n.id));
  const filteredEdges = edgesForMap(graph.edges, visibleNodeIds, options);
  return { nodes, edges: filteredEdges };
}
