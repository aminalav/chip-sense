import companies from "@/data/companies.json";
import type { GraphNode } from "@/data/graph";

export interface CompanyRecord {
  id: string;
  name: string;
  segment?: string;
  specialization: string;
  description?: string;
  founded?: string;
  hq_city?: string;
  hq_country: string;
  operating_countries: string[];
  sourced: boolean;
  must_show_essay_1: boolean;
  source_label: string;
  source_url: string;
}

export const COMPANY_RECORDS = companies as CompanyRecord[];

const companyById = new Map(COMPANY_RECORDS.map((c) => [c.id, c]));

/** Essay 1 map: key country nodes to always surface */
const ESSAY_1_COUNTRY_IDS = new Set([
  "country-tw",
  "country-cn",
  "country-us",
  "country-kr",
]);

export function applyCompanyRecords(nodes: GraphNode[]): GraphNode[] {
  return nodes.map((node) => {
    if (node.kind === "company") {
      const record = companyById.get(node.id);
      if (!record) return node;
      return {
        ...node,
        meta: {
          ...node.meta,
          segment: record.segment,
          specialization: record.specialization,
          description: record.description,
          founded: record.founded,
          hq_city: record.hq_city,
          hq_country: record.hq_country,
          operating_countries: record.operating_countries,
          sourced: record.sourced,
          must_show_essay_1: record.must_show_essay_1,
          source_label: record.source_label,
          source_url: record.source_url || undefined,
        },
      };
    }
    if (node.kind === "country" && ESSAY_1_COUNTRY_IDS.has(node.id)) {
      return {
        ...node,
        meta: {
          ...node.meta,
          must_show_essay_1: true,
        },
      };
    }
    return node;
  });
}
