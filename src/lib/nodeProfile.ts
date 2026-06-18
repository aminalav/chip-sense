import countries from "@/data/countries.json";
import fabSites from "@/data/fab-sites.json";
import type { GraphNode, SourceRecord } from "@/data/graph";
import { COMPANY_RECORDS } from "@/lib/companyRecords";

interface FabSiteRecord {
  id: string;
  company_id: string;
  label: string;
  city: string;
  country: string;
  source_ids?: string[];
}

interface CountryRecord {
  id: string;
  label: string;
  iso: string;
  description?: string;
}

const FAB_BY_ID = new Map((fabSites as FabSiteRecord[]).map((s) => [s.id, s]));
const COUNTRY_BY_ID = new Map((countries as CountryRecord[]).map((c) => [c.id, c]));
const COMPANY_BY_ID = new Map(COMPANY_RECORDS.map((c) => [c.id, c]));

export function parentCompanyIdForPresence(nodeId: string): string | undefined {
  for (const company of COMPANY_RECORDS) {
    if (nodeId.startsWith(`presence-${company.id}-`)) return company.id;
  }
  return undefined;
}

export function sourceLinks(
  sourceIds: string[] | undefined,
  sourceLookup: Map<string, SourceRecord>,
): { id: string; title: string; url: string }[] {
  return (sourceIds ?? [])
    .map((id) => {
      const src = sourceLookup.get(id);
      return src ? { id, title: src.title, url: src.url } : null;
    })
    .filter((x): x is { id: string; title: string; url: string } => x !== null);
}

export function fabSiteForNode(node: GraphNode): FabSiteRecord | undefined {
  return node.kind === "fab" ? FAB_BY_ID.get(node.id) : undefined;
}

export function countryRecordForNode(node: GraphNode): CountryRecord | undefined {
  return node.kind === "country" ? COUNTRY_BY_ID.get(node.id) : undefined;
}

export function operatorForFab(node: GraphNode) {
  const site = fabSiteForNode(node);
  if (!site) return undefined;
  return COMPANY_BY_ID.get(site.company_id);
}
