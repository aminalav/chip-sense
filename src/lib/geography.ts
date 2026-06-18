import countries from "@/data/countries.json";
import fabSites from "@/data/fab-sites.json";
import type { GraphEdge, GraphNode, SupplyGraph, TrackSlug } from "@/data/graph";
import { COMPANY_SOURCE_IDS } from "@/lib/companySourceIds";
import { COMPANY_RECORDS } from "@/lib/companyRecords";

const ALL_TRACKS: TrackSlug[] = ["memory", "cpus", "gpus", "data-centers"];

const COUNTRY_NAME_TO_ID: Record<string, string> = {
  Taiwan: "country-tw",
  "United States": "country-us",
  "South Korea": "country-kr",
  China: "country-cn",
  Japan: "country-jp",
  Netherlands: "country-nl",
  Singapore: "country-sg",
  Germany: "country-de",
  Ireland: "country-ie",
  Israel: "country-il",
  Malaysia: "country-my",
  India: "country-in",
  Canada: "country-ca",
  "Costa Rica": "country-cr",
  Poland: "country-pl",
  Vietnam: "country-vn",
  Mexico: "country-mx",
  Philippines: "country-ph",
  /** Equipment vendors often cite regional sales; map to Germany as EU industrial proxy */
  Europe: "country-de",
};

interface FabSiteRecord {
  id: string;
  company_id: string;
  label: string;
  city: string;
  country: string;
  coordinates: [number, number];
  source_ids?: string[];
  must_show_essay_1?: boolean;
}

const FAB_SITES = fabSites as FabSiteRecord[];

const SEGMENT_BY_COMPANY = new Map(
  COMPANY_RECORDS.map((c) => [c.id, c.segment]),
);

function companyTracks(companyId: string): TrackSlug[] {
  const trackMap: Record<string, TrackSlug[]> = {
    "co-tsmc": ["cpus", "gpus", "data-centers"],
    "co-samsung": ["memory", "cpus", "gpus"],
    "co-sk-hynix": ["memory"],
    "co-micron": ["memory"],
    "co-intel": ["cpus", "data-centers"],
    "co-nvidia": ["gpus", "data-centers"],
    "co-amd": ["cpus", "gpus"],
    "co-apple": ["cpus", "gpus"],
    "co-qualcomm": ["cpus", "gpus"],
    "co-broadcom": ["gpus", "data-centers"],
    "co-mediatek": ["cpus"],
    "co-umc": ["cpus"],
    "co-smic": ["cpus", "memory"],
    "co-globalfoundries": ["cpus"],
    "co-ase": ["memory", "gpus", "data-centers"],
    "co-amkor": ["memory", "gpus", "data-centers"],
    "co-asml": ["cpus", "gpus", "data-centers"],
    "co-applied-materials": ["cpus", "gpus", "data-centers"],
    "co-lam-research": ["cpus", "gpus", "data-centers"],
    "co-kla": ["cpus", "gpus", "data-centers"],
    "co-tel": ["cpus", "gpus", "data-centers"],
    "co-foxconn": ["cpus", "data-centers"],
    "co-ymtc": ["memory"],
    "co-cxmt": ["memory"],
    "co-huawei": ["cpus", "gpus"],
  };
  return trackMap[companyId] ?? ALL_TRACKS;
}

function presenceOffset(
  base: [number, number],
  companyId: string,
  slot: number,
): [number, number] {
  const hash = companyId.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const angle = ((hash + slot * 47) % 360) * (Math.PI / 180);
  const radius = 1.2 + (slot % 4) * 0.35;
  return [
    base[0] + radius * Math.cos(angle),
    base[1] + radius * 0.55 * Math.sin(angle),
  ];
}

function mergeCountryNodes(nodes: GraphNode[]): GraphNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (const c of countries) {
    if (byId.has(c.id)) continue;
    byId.set(c.id, {
      id: c.id,
      kind: "country",
      label: c.label,
      tracks: ALL_TRACKS,
      meta: {
        country_iso: c.iso,
        description: (c as { description?: string }).description,
      },
      coordinates: c.coordinates as [number, number],
    });
  }
  return [...byId.values()];
}

function mergeFabSites(
  nodes: GraphNode[],
  edges: GraphEdge[],
): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  fabCountriesByCompany: Map<string, Set<string>>;
} {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edgeById = new Map(edges.map((e) => [e.id, e]));
  const fabCountriesByCompany = new Map<string, Set<string>>();

  for (const site of FAB_SITES) {
    const countryId = COUNTRY_NAME_TO_ID[site.country];
    if (!countryId) continue;

    const tracks = companyTracks(site.company_id);
    const existing = nodeById.get(site.id);
    const iso = countries.find((c) => c.id === countryId)?.iso;
    const operator = COMPANY_RECORDS.find((c) => c.id === site.company_id);
    const fabNode: GraphNode = {
      id: site.id,
      kind: "fab",
      label: site.label,
      tracks: existing
        ? [...new Set([...existing.tracks, ...tracks])]
        : tracks,
      meta: {
        ...existing?.meta,
        segment: SEGMENT_BY_COMPANY.get(site.company_id) ?? existing?.meta?.segment,
        city: site.city,
        country_iso: iso,
        specialization: operator?.specialization,
        description: operator
          ? `${site.label} — operated by ${operator.name}. ${operator.specialization}.`
          : `${site.label} — semiconductor fab or packaging site in ${site.city}, ${site.country}.`,
        must_show_essay_1: site.must_show_essay_1 ?? existing?.meta?.must_show_essay_1,
      },
      coordinates: site.coordinates,
    };
    nodeById.set(site.id, fabNode);

    const opId = `e-${site.company_id}-${site.id}-operates`;
    if (!edgeById.has(opId)) {
      edgeById.set(opId, {
        id: opId,
        kind: "operates",
        source: site.company_id,
        target: site.id,
        tracks,
        facts: site.source_ids?.length
          ? {
              footprint: {
                source_ids: site.source_ids,
                notes: `${site.label} per operator filing.`,
              },
            }
          : undefined,
      });
    }

    const locId = `e-${site.id}-${countryId}-located`;
    if (!edgeById.has(locId)) {
      edgeById.set(locId, {
        id: locId,
        kind: "located_in",
        source: site.id,
        target: countryId,
        tracks,
      });
    }

    if (!fabCountriesByCompany.has(site.company_id)) {
      fabCountriesByCompany.set(site.company_id, new Set());
    }
    fabCountriesByCompany.get(site.company_id)!.add(countryId);
  }

  return {
    nodes: [...nodeById.values()],
    edges: [...edgeById.values()],
    fabCountriesByCompany,
  };
}

function addOperatingFootprint(
  nodes: GraphNode[],
  edges: GraphEdge[],
  fabCountriesByCompany: Map<string, Set<string>>,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edgeById = new Map(edges.map((e) => [e.id, e]));
  const countryCoords = new Map(
    countries.map((c) => [c.id, c.coordinates as [number, number]]),
  );

  let presenceSlot = 0;

  for (const company of COMPANY_RECORDS) {
    const tracks = companyTracks(company.id);
    const hqCountryId = COUNTRY_NAME_TO_ID[company.hq_country];
    const fabCountries = fabCountriesByCompany.get(company.id) ?? new Set<string>();

    if (hqCountryId) {
      const hqEdgeId = `e-${company.id}-hq-${hqCountryId}`;
      if (!edgeById.has(hqEdgeId)) {
        edgeById.set(hqEdgeId, {
          id: hqEdgeId,
          kind: "hq_in",
          source: company.id,
          target: hqCountryId,
          tracks,
        });
      }
    }

    for (const countryName of company.operating_countries) {
      const countryId = COUNTRY_NAME_TO_ID[countryName];
      if (!countryId) continue;

      const opInId = `e-${company.id}-operates-in-${countryId}`;
      const sourceId = COMPANY_SOURCE_IDS[company.id];
      if (!edgeById.has(opInId)) {
        edgeById.set(opInId, {
          id: opInId,
          kind: "operates_in",
          source: company.id,
          target: countryId,
          tracks,
          facts: sourceId
            ? {
                footprint: {
                  source_ids: [sourceId],
                  source_url: company.source_url,
                  source_label: company.source_label,
                  notes: `Operating footprint: ${countryName} per company filing.`,
                },
              }
            : undefined,
        });
      }

      if (fabCountries.has(countryId)) continue;
      if (countryName === company.hq_country) continue;

      const presenceId = `presence-${company.id}-${countryId}`;
      if (!nodeById.has(presenceId)) {
        const base = countryCoords.get(countryId);
        if (!base) continue;
        presenceSlot += 1;
        nodeById.set(presenceId, {
          id: presenceId,
          kind: "presence",
          label: `${company.name} — ${countryName}`,
          tracks,
          meta: {
            segment: company.segment,
            specialization: company.specialization,
            description: company.description,
            hq_country: company.hq_country,
            operating_countries: [countryName],
            notes: `Operating presence in ${countryName} (no dedicated fab pin on map). Sales, assembly, design, or back-office footprint per company filing.`,
            source_label: company.source_label,
            source_url: company.source_url,
          },
          coordinates: presenceOffset(base, company.id, presenceSlot),
        });
      }

      const presEdgeId = `e-${company.id}-${presenceId}-presence`;
      if (!edgeById.has(presEdgeId)) {
        edgeById.set(presEdgeId, {
          id: presEdgeId,
          kind: "operates",
          source: company.id,
          target: presenceId,
          tracks,
        });
      }
    }
  }

  return { nodes: [...nodeById.values()], edges: [...edgeById.values()] };
}

/** Full geography: countries, fab sites, operating-country links, presence pins. */
export function applyGeography(graph: SupplyGraph): SupplyGraph {
  let nodes = mergeCountryNodes(graph.nodes);
  let edges = [...graph.edges];

  const fabMerge = mergeFabSites(nodes, edges);
  nodes = fabMerge.nodes;
  edges = fabMerge.edges;

  const footprint = addOperatingFootprint(
    nodes,
    edges,
    fabMerge.fabCountriesByCompany,
  );

  return {
    ...graph,
    nodes: footprint.nodes,
    edges: footprint.edges,
  };
}
