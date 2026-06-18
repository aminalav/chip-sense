/** Node and edge types for supply-chain graph (solo research / portfolio). */

export type NodeKind =
  | "company"
  | "fab"
  | "presence"
  | "country"
  | "product_category"
  | "end_market";

export type EdgeKind =
  | "operates"
  | "located_in"
  | "hq_in"
  | "operates_in"
  | "supplies"
  | "equips"
  | "packages"
  | "memory_supply"
  | "assembles"
  | "serves_market"
  | "exposed_to_category";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  /** Which editorial tracks surface this node */
  tracks: TrackSlug[];
  meta?: {
    ticker?: string;
    country_iso?: string;
    city?: string;
    notes?: string;
    /** WSTS-style or custom bucket label */
    category_label?: string;
    /** Plain-English product / role (companies) */
    specialization?: string;
    /** Industry segment used for map color coordination (companies) */
    segment?: string;
    /** Paragraph profile: specialization, location, short origin history */
    description?: string;
    /** Founding year (companies) */
    founded?: string;
    /** HQ city / location string (companies) */
    hq_city?: string;
    hq_country?: string;
    operating_countries?: string[];
    sourced?: boolean;
    must_show_essay_1?: boolean;
    source_label?: string;
    source_url?: string;
  };
  /** WGS84 for fabs / HQs when mapped */
  coordinates?: [number, number];
}

export interface GraphEdge {
  id: string;
  kind: EdgeKind;
  source: string;
  target: string;
  tracks: TrackSlug[];
  /** Historical facts: year-keyed values you cite in writing */
  facts?: Record<
    string,
    {
      source_ids?: string[];
      source_url?: string;
      source_label?: string;
      notes?: string;
    }
  >;
}

export type TrackSlug = "memory" | "cpus" | "gpus" | "data-centers";

/** Optional explicit map styling overrides (merged on top of computed scenario rules). */
export interface ScenarioAffects {
  chokepoint_node_ids?: string[];
  partial_relief_node_ids?: string[];
  substitution_buffer_node_ids?: string[];
  stressed_node_ids?: string[];
  disrupted_edge_ids?: string[];
  stressed_edge_ids?: string[];
  buffered_edge_ids?: string[];
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  /** Multipliers or overrides applied in UI layer later; document assumptions in copy */
  assumptions: Record<string, string | number | boolean>;
  affects?: ScenarioAffects;
  /** Optional grounded reader narrative; used by the generic scenario engine when present. */
  narrative?: { title: string; bullets: string[] };
}

export type TradeFlowRank = "high" | "medium" | "low";

export interface TradeFlowRecord {
  id: string;
  exporter_country_id: string;
  importer_country_id: string;
  hs_label: string;
  year: number;
  /** Set when pulled from Comtrade; null = rank-only visualization until verified */
  value_usd_millions: number | null;
  rank: TradeFlowRank;
  source_ids: string[];
  notes?: string;
  tracks: TrackSlug[];
}

export interface SourceRecord {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  published_at?: string;
  retrieved_at?: string;
  notes?: string;
}

export interface SupplyGraph {
  version: 1;
  updated: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  scenarios: Scenario[];
}
