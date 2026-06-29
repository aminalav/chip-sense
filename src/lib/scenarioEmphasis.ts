import type { GraphEdge } from "@/data/graph";
import type { ScenarioEffects } from "@/lib/scenarioEffects";

export interface ScenarioEmphasis {
  active: boolean;
  highlightedNodeIds: Set<string>;
}

/** Pins (and arc endpoints) to keep at full opacity while a scenario is active. */
export function computeScenarioEmphasis(
  effects: ScenarioEffects | null,
  edges: GraphEdge[],
): ScenarioEmphasis {
  if (!effects) {
    return { active: false, highlightedNodeIds: new Set() };
  }

  const highlightedNodeIds = new Set<string>();

  for (const [nodeId, role] of effects.nodeRoles) {
    if (role !== "neutral") highlightedNodeIds.add(nodeId);
  }

  const edgeById = new Map(edges.map((e) => [e.id, e]));
  for (const [edgeId, role] of effects.edgeRoles) {
    if (role === "neutral") continue;
    const edge = edgeById.get(edgeId);
    if (!edge) continue;
    highlightedNodeIds.add(edge.source);
    highlightedNodeIds.add(edge.target);
  }

  return { active: true, highlightedNodeIds };
}

export function isScenarioPinDimmed(
  nodeId: string,
  emphasis: ScenarioEmphasis,
  selectedNodeId: string | null | undefined,
  hoveredNodeId: string | null | undefined,
): boolean {
  if (!emphasis.active) return false;
  if (nodeId === selectedNodeId || nodeId === hoveredNodeId) return false;
  return !emphasis.highlightedNodeIds.has(nodeId);
}
