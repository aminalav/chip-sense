import countries from "@/data/countries.json";
import type { GraphEdge, GraphNode, TrackSlug } from "@/data/graph";
import { COMPANY_RECORDS } from "@/lib/companyRecords";
import { fabSiteForNode } from "@/lib/nodeProfile";
import {
  isCompanySegment,
  SEGMENT_LABEL,
  type CompanySegment,
} from "@/lib/segments";

export type RegistryEntityKind = "company" | "fab" | "presence" | "country";

export interface RegistryEntry {
  nodeId: string;
  label: string;
  kind: RegistryEntityKind;
  segment?: CompanySegment;
  countries: string[];
  countryIds: string[];
  tracks: TrackSlug[];
  searchText: string;
}

const COUNTRY_LABEL_BY_ID = new Map(
  countries.map((c) => [c.id, c.label] as const),
);

const COUNTRY_ID_BY_LABEL = new Map(
  countries.map((c) => [c.label, c.id] as const),
);

export const REGISTRY_KIND_LABEL: Record<RegistryEntityKind, string> = {
  company: "Company",
  fab: "Fab / site",
  presence: "Presence",
  country: "Country",
};

export const REGISTRY_SEGMENT_FILTERS: { value: "all" | CompanySegment; label: string }[] = [
  { value: "all", label: "All segments" },
  ...(Object.keys(SEGMENT_LABEL) as CompanySegment[]).map((segment) => ({
    value: segment,
    label: SEGMENT_LABEL[segment],
  })),
];

export const REGISTRY_KIND_FILTERS: { value: "all" | RegistryEntityKind; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "company", label: "Companies" },
  { value: "fab", label: "Fabs / sites" },
  { value: "presence", label: "Presences" },
  { value: "country", label: "Countries" },
];

function normalizeSearch(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/\s+/g, " ").trim();
}

function addCountry(
  countryIds: Set<string>,
  countryLabels: Set<string>,
  countryId: string,
) {
  countryIds.add(countryId);
  const label = COUNTRY_LABEL_BY_ID.get(countryId);
  if (label) countryLabels.add(label);
}

function countriesForNode(
  node: GraphNode,
  edges: GraphEdge[],
): { countryIds: string[]; countries: string[] } {
  const countryIds = new Set<string>();
  const countryLabels = new Set<string>();

  if (node.kind === "country") {
    addCountry(countryIds, countryLabels, node.id);
  }

  if (node.kind === "company") {
    const record = COMPANY_RECORDS.find((c) => c.id === node.id);
    const hqCountry = record?.hq_country ?? node.meta?.hq_country;
    const operating =
      record?.operating_countries ?? node.meta?.operating_countries ?? [];
    if (hqCountry) {
      const id = COUNTRY_ID_BY_LABEL.get(hqCountry);
      if (id) addCountry(countryIds, countryLabels, id);
    }
    for (const name of operating) {
      const id = COUNTRY_ID_BY_LABEL.get(name);
      if (id) addCountry(countryIds, countryLabels, id);
    }
    for (const edge of edges) {
      if (edge.kind === "hq_in" && edge.source === node.id) {
        addCountry(countryIds, countryLabels, edge.target);
      }
      if (edge.kind === "operates_in" && edge.source === node.id) {
        addCountry(countryIds, countryLabels, edge.target);
      }
    }
  }

  if (node.kind === "fab") {
    const site = fabSiteForNode(node);
    if (site) {
      const id = COUNTRY_ID_BY_LABEL.get(site.country);
      if (id) addCountry(countryIds, countryLabels, id);
    }
    for (const edge of edges) {
      if (edge.kind === "located_in" && edge.source === node.id) {
        addCountry(countryIds, countryLabels, edge.target);
      }
    }
  }

  if (node.kind === "presence") {
    for (const edge of edges) {
      if (
        (edge.kind === "located_in" || edge.kind === "operates_in") &&
        edge.source === node.id
      ) {
        addCountry(countryIds, countryLabels, edge.target);
      }
    }
  }

  return {
    countryIds: [...countryIds],
    countries: [...countryLabels].sort(),
  };
}

function segmentForNode(node: GraphNode): CompanySegment | undefined {
  if (node.kind !== "company") return undefined;
  const raw = COMPANY_RECORDS.find((c) => c.id === node.id)?.segment ?? node.meta?.segment;
  return isCompanySegment(raw) ? raw : undefined;
}

const SEARCHABLE_KINDS = new Set<RegistryEntityKind>([
  "company",
  "fab",
  "presence",
  "country",
]);

export function buildRegistryIndex(
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
): RegistryEntry[] {
  return graphNodes
    .filter((node): node is GraphNode & { kind: RegistryEntityKind } =>
      SEARCHABLE_KINDS.has(node.kind as RegistryEntityKind),
    )
    .map((node) => {
      const { countries: countryLabels, countryIds } = countriesForNode(
        node,
        graphEdges,
      );
      const segment = segmentForNode(node);
      const searchParts = [
        node.label,
        node.id,
        REGISTRY_KIND_LABEL[node.kind as RegistryEntityKind],
        segment ? SEGMENT_LABEL[segment] : "",
        ...countryLabels,
      ];
      return {
        nodeId: node.id,
        label: node.label,
        kind: node.kind as RegistryEntityKind,
        segment,
        countries: countryLabels,
        countryIds,
        tracks: node.tracks,
        searchText: normalizeSearch(searchParts.join(" ")),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function filterRegistryByTrack(
  entries: RegistryEntry[],
  trackLens: TrackSlug | null | undefined,
): RegistryEntry[] {
  if (!trackLens) return entries;
  return entries.filter((entry) => entry.tracks.includes(trackLens));
}

export function searchRegistry(
  entries: RegistryEntry[],
  query: string,
  limit = 12,
): RegistryEntry[] {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];

  const tokens = normalized.split(" ").filter(Boolean);
  const scored = entries
    .map((entry) => {
      let score = 0;
      const label = normalizeSearch(entry.label);
      if (label === normalized) score += 100;
      else if (label.startsWith(normalized)) score += 60;
      else if (label.includes(normalized)) score += 40;

      for (const token of tokens) {
        if (label.includes(token)) score += 12;
        if (entry.searchText.includes(token)) score += 6;
        for (const country of entry.countries) {
          if (normalizeSearch(country).includes(token)) score += 10;
        }
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.label.localeCompare(b.entry.label));

  return scored.slice(0, limit).map(({ entry }) => entry);
}

export function filterRegistryBrowse(
  entries: RegistryEntry[],
  options: {
    countryId?: string | null;
    segment?: "all" | CompanySegment;
    kind?: "all" | RegistryEntityKind;
    trackLens?: TrackSlug | null;
  },
): RegistryEntry[] {
  let result = filterRegistryByTrack(entries, options.trackLens);

  if (options.countryId) {
    result = result.filter((entry) => entry.countryIds.includes(options.countryId!));
  }

  if (options.segment && options.segment !== "all") {
    result = result.filter((entry) => entry.segment === options.segment);
  }

  if (options.kind && options.kind !== "all") {
    result = result.filter((entry) => entry.kind === options.kind);
  }

  return result;
}

export const REGISTRY_COUNTRIES = [...countries]
  .map((c) => ({ id: c.id, label: c.label }))
  .sort((a, b) => a.label.localeCompare(b.label));
