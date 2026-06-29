import type { GraphEdge, GraphNode, Scenario } from "@/data/graph";

export type NodeScenarioRole =
  | "neutral"
  | "chokepoint"
  | "partial_relief"
  | "substitution_buffer"
  | "stressed";

export type EdgeScenarioRole = "neutral" | "disrupted" | "stressed" | "buffered";

export interface ScenarioImpactRow {
  id: string;
  label: string;
  role: NodeScenarioRole | EdgeScenarioRole;
  detail?: string;
}

export interface ScenarioEffects {
  scenarioId: string;
  nodeRoles: Map<string, NodeScenarioRole>;
  edgeRoles: Map<string, EdgeScenarioRole>;
  narrative: { title: string; bullets: string[] };
  impacts: ScenarioImpactRow[];
  assumptionLines: string[];
}

const TAIWAN_COUNTRY_ID = "country-tw";
const CHINA_COUNTRY_ID = "country-cn";

const TAIWAN_FAB_IDS = new Set([
  "fab-tsmc-sc",
  "fab-micron-taichung",
  "fab-ase-kaohsiung",
]);

const PARTIAL_RELIEF_FAB_IDS = new Set([
  "fab-tsmc-az",
  "fab-tsmc-jp",
  "fab-samsung-taylor",
  "fab-sk-hynix-indiana",
  "fab-intel-or",
]);

const PACKAGING_FAB_IDS = new Set([
  "fab-ase-kaohsiung",
  "fab-ase-shanghai",
  "fab-amkor-korea",
  "fab-amkor-philippines",
]);

const PACKAGING_COMPANY_IDS = new Set(["co-ase", "co-amkor"]);

const CHINA_SUBSTITUTION_IDS = new Set([
  "co-smic",
  "co-ymtc",
  "co-cxmt",
  "fab-smic-shanghai",
  "fab-smic-beijing",
  "fab-ymtc-wuhan",
]);

const FABLESS_CUSTOMER_IDS = new Set([
  "co-nvidia",
  "co-amd",
  "co-apple",
  "co-qualcomm",
  "co-mediatek",
  "co-broadcom",
]);

function numAssumption(
  assumptions: Scenario["assumptions"],
  key: string,
): number | undefined {
  const v = assumptions[key];
  return typeof v === "number" ? v : undefined;
}

function locatedCountryId(
  nodeId: string,
  edges: GraphEdge[],
): string | undefined {
  for (const e of edges) {
    if (e.kind !== "located_in" || e.source !== nodeId) continue;
    if (e.target.startsWith("country-")) return e.target;
  }
  return undefined;
}

function isTaiwanAnchored(node: GraphNode, edges: GraphEdge[]): boolean {
  if (node.id === TAIWAN_COUNTRY_ID) return true;
  if (node.meta?.country_iso === "TW") return true;
  if (node.meta?.hq_country === "Taiwan") return true;
  if (TAIWAN_FAB_IDS.has(node.id)) return true;
  return locatedCountryId(node.id, edges) === TAIWAN_COUNTRY_ID;
}

function isChinaAnchored(node: GraphNode, edges: GraphEdge[]): boolean {
  if (node.id === CHINA_COUNTRY_ID) return true;
  if (node.meta?.country_iso === "CN") return true;
  if (node.meta?.hq_country === "China") return true;
  if (CHINA_SUBSTITUTION_IDS.has(node.id)) return true;
  return locatedCountryId(node.id, edges) === CHINA_COUNTRY_ID;
}

function buildImpacts(
  nodeRoles: Map<string, NodeScenarioRole>,
  edgeRoles: Map<string, EdgeScenarioRole>,
  nodes: GraphNode[],
  edges: GraphEdge[],
): ScenarioImpactRow[] {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const rows: ScenarioImpactRow[] = [];

  for (const [id, role] of nodeRoles) {
    if (role === "neutral") continue;
    const node = nodeById.get(id);
    rows.push({
      id,
      label: node?.label ?? id,
      role,
      detail: node?.kind,
    });
  }

  for (const [id, role] of edgeRoles) {
    if (role === "neutral") continue;
    const edge = edges.find((e) => e.id === id);
    if (!edge) continue;
    const a = nodeById.get(edge.source)?.label ?? edge.source;
    const b = nodeById.get(edge.target)?.label ?? edge.target;
    rows.push({
      id,
      label: `${a} → ${b}`,
      role,
      detail: edge.kind,
    });
  }

  const order: Record<string, number> = {
    chokepoint: 0,
    disrupted: 1,
    stressed: 2,
    partial_relief: 3,
    substitution_buffer: 4,
    buffered: 5,
  };
  return rows.sort(
    (x, y) => (order[x.role] ?? 9) - (order[y.role] ?? 9) || x.label.localeCompare(y.label),
  );
}

function applyScenarioAffects(
  scenario: Scenario,
  nodeRoles: Map<string, NodeScenarioRole>,
  edgeRoles: Map<string, EdgeScenarioRole>,
): void {
  const a = scenario.affects;
  if (!a) return;

  for (const id of a.chokepoint_node_ids ?? []) nodeRoles.set(id, "chokepoint");
  for (const id of a.partial_relief_node_ids ?? []) nodeRoles.set(id, "partial_relief");
  for (const id of a.substitution_buffer_node_ids ?? []) {
    nodeRoles.set(id, "substitution_buffer");
  }
  for (const id of a.stressed_node_ids ?? []) nodeRoles.set(id, "stressed");
  for (const id of a.disrupted_edge_ids ?? []) edgeRoles.set(id, "disrupted");
  for (const id of a.stressed_edge_ids ?? []) edgeRoles.set(id, "stressed");
  for (const id of a.buffered_edge_ids ?? []) edgeRoles.set(id, "buffered");
}

function assumptionLines(scenario: Scenario): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(scenario.assumptions)) {
    if (key === "notes" || typeof value === "boolean") continue;
    if (typeof value === "number") {
      const pct =
        key.includes("multiplier") ||
        key.includes("rate") ||
        key.includes("ratio") ||
        key.includes("sufficiency") ||
        key.includes("utilization")
          ? `${Math.round(value * 100)}% of baseline`
          : String(value);
      lines.push(`${key.replace(/_/g, " ")}: ${pct}`);
    } else if (typeof value === "string") {
      lines.push(`${key.replace(/_/g, " ")}: ${value}`);
    }
  }
  return lines;
}

function computeTaiwanCrisis(
  scenario: Scenario,
  nodes: GraphNode[],
  edges: GraphEdge[],
): ScenarioEffects {
  const nodeRoles = new Map<string, NodeScenarioRole>();
  const edgeRoles = new Map<string, EdgeScenarioRole>();

  const waferMult = numAssumption(scenario.assumptions, "taiwan_wafer_capacity_multiplier") ?? 0.1;
  const pkgMult =
    numAssumption(scenario.assumptions, "taiwan_packaging_capacity_multiplier") ?? 0.25;
  const subRate =
    numAssumption(scenario.assumptions, "china_domestic_substitution_rate") ?? 0.15;
  const fablessDelay =
    numAssumption(scenario.assumptions, "us_fabless_leading_edge_delay_months") ?? 18;

  for (const node of nodes) {
    if (isTaiwanAnchored(node, edges)) {
      nodeRoles.set(node.id, "chokepoint");
    } else if (PARTIAL_RELIEF_FAB_IDS.has(node.id)) {
      nodeRoles.set(node.id, "partial_relief");
    } else if (
      subRate > 0 &&
      (CHINA_SUBSTITUTION_IDS.has(node.id) || (isChinaAnchored(node, edges) && node.kind === "fab"))
    ) {
      nodeRoles.set(node.id, "substitution_buffer");
    }
  }

  for (const edge of edges) {
    if (edge.kind === "supplies" && edge.source === "co-tsmc" && FABLESS_CUSTOMER_IDS.has(edge.target)) {
      edgeRoles.set(edge.id, "disrupted");
    }
    if (edge.kind === "equips" && edge.target === "co-tsmc") {
      edgeRoles.set(edge.id, "stressed");
    }
  }

  applyScenarioAffects(scenario, nodeRoles, edgeRoles);

  return {
    scenarioId: scenario.id,
    nodeRoles,
    edgeRoles,
    assumptionLines: assumptionLines(scenario),
    narrative: {
      title: "Taiwan Strait disruption — map interpretation",
      bullets: [
        `Taiwan wafer output modeled at ~${Math.round(waferMult * 100)}% of baseline; packaging at ~${Math.round(pkgMult * 100)}%.`,
        `Cited TSMC → US fabless supply links shown as disrupted (connection arcs).`,
        `CHIPS / allied fab pins (Arizona, Kumamoto, Taylor, etc.) marked as partial relief—not full Taiwan replacement.`,
        `China domestic memory/foundry pins absorb up to ~${Math.round(subRate * 100)}% substitution in this illustrative model.`,
        `US fabless leading-edge recovery horizon: ~${fablessDelay} months in assumptions (not computed from fab data).`,
      ],
    },
    impacts: buildImpacts(nodeRoles, edgeRoles, nodes, edges),
  };
}

function computeConstrainedPackaging(
  scenario: Scenario,
  nodes: GraphNode[],
  edges: GraphEdge[],
): ScenarioEffects {
  const nodeRoles = new Map<string, NodeScenarioRole>();
  const edgeRoles = new Map<string, EdgeScenarioRole>();
  const pkgMult =
    numAssumption(scenario.assumptions, "advanced_packaging_capacity_multiplier") ?? 0.85;

  for (const node of nodes) {
    if (PACKAGING_FAB_IDS.has(node.id) || PACKAGING_COMPANY_IDS.has(node.id)) {
      nodeRoles.set(node.id, "chokepoint");
    }
    if (node.id === "co-tsmc" || TAIWAN_FAB_IDS.has(node.id)) {
      nodeRoles.set(node.id, "stressed");
    }
  }

  for (const edge of edges) {
    if (edge.kind === "supplies" && (edge.source === "co-tsmc" || FABLESS_CUSTOMER_IDS.has(edge.target))) {
      edgeRoles.set(edge.id, "stressed");
    }
  }

  applyScenarioAffects(scenario, nodeRoles, edgeRoles);

  return {
    scenarioId: scenario.id,
    nodeRoles,
    edgeRoles,
    assumptionLines: assumptionLines(scenario),
    narrative: {
      title: "Constrained advanced packaging — map interpretation",
      bullets: [
        `Advanced packaging / OSAT capacity at ~${Math.round(pkgMult * 100)}% of baseline.`,
        `ASE and Amkor fab pins highlighted as chokepoints; Taiwan OSAT included.`,
        `TSMC → fabless supply arcs stressed (secondary to packaging, not fully offline).`,
      ],
    },
    impacts: buildImpacts(nodeRoles, edgeRoles, nodes, edges),
  };
}

export function computeScenarioEffects(
  scenario: Scenario | undefined,
  nodes: GraphNode[],
  edges: GraphEdge[],
): ScenarioEffects | null {
  if (!scenario || scenario.id === "baseline") return null;

  if (scenario.id === "taiwan-crisis") {
    return computeTaiwanCrisis(scenario, nodes, edges);
  }
  if (scenario.id === "constrained-packaging") {
    return computeConstrainedPackaging(scenario, nodes, edges);
  }

  const nodeRoles = new Map<string, NodeScenarioRole>();
  const edgeRoles = new Map<string, EdgeScenarioRole>();
  applyScenarioAffects(scenario, nodeRoles, edgeRoles);
  return {
    scenarioId: scenario.id,
    nodeRoles,
    edgeRoles,
    assumptionLines: assumptionLines(scenario),
    narrative: scenario.narrative ?? {
      title: scenario.label,
      bullets: [scenario.description],
    },
    impacts: buildImpacts(nodeRoles, edgeRoles, nodes, edges),
  };
}

export function nodeScenarioRole(
  effects: ScenarioEffects | null,
  nodeId: string,
): NodeScenarioRole {
  if (!effects) return "neutral";
  return effects.nodeRoles.get(nodeId) ?? "neutral";
}

export function edgeScenarioRole(
  effects: ScenarioEffects | null,
  edgeId: string,
): EdgeScenarioRole {
  if (!effects) return "neutral";
  return effects.edgeRoles.get(edgeId) ?? "neutral";
}

export const NODE_ROLE_RING: Record<NodeScenarioRole, string | undefined> = {
  neutral: undefined,
  chokepoint: "#f87171",
  partial_relief: "#34d399",
  substitution_buffer: "#22d3ee",
  stressed: "#fb923c",
};

export const NODE_ROLE_LABEL: Record<NodeScenarioRole, string | undefined> = {
  neutral: undefined,
  chokepoint: "Chokepoint",
  partial_relief: "Partial relief",
  substitution_buffer: "Substitution buffer",
  stressed: "Stressed",
};

export const EDGE_ROLE_COLOR: Record<EdgeScenarioRole, string | undefined> = {
  neutral: undefined,
  disrupted: "#f87171",
  stressed: "#fb923c",
  buffered: "#22d3ee",
};

/** Map paint tuning when a non-baseline scenario is active. */
export const SCENARIO_PRESENTATION = {
  neutralPinOpacity: 0.28,
  edgeWidth: {
    neutral: 1.1,
    disrupted: 4,
    stressed: 3.25,
    buffered: 2.75,
  },
  edgeOpacity: {
    neutral: 0.14,
    disrupted: 0.95,
    stressed: 0.88,
    buffered: 0.84,
  },
  pinScale: {
    chokepoint: 1.45,
    partial_relief: 1.3,
    substitution_buffer: 1.28,
    stressed: 1.22,
  } satisfies Partial<Record<NodeScenarioRole, number>>,
  pinRingExtra: 1,
} as const;
