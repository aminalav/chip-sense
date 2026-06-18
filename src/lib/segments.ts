/** Company segment taxonomy and map color coordination. */

/** Granular segment recorded per company in companies.json. */
export type CompanySegment =
  | "foundry"
  | "idm"
  | "memory"
  | "fabless"
  | "equipment"
  | "osat"
  | "ems";

/** Color group: several segments collapse into one map color. */
export type SegmentGroup =
  | "manufacturer"
  | "fabless"
  | "equipment"
  | "packaging"
  | "assembly";

export const SEGMENT_GROUP: Record<CompanySegment, SegmentGroup> = {
  foundry: "manufacturer",
  idm: "manufacturer",
  memory: "manufacturer",
  fabless: "fabless",
  equipment: "equipment",
  osat: "packaging",
  ems: "assembly",
};

/** Marker color per group (manufacturers red, fabless blue, tooling green, etc.). */
export const GROUP_COLOR: Record<SegmentGroup, string> = {
  manufacturer: "#ef4444",
  fabless: "#3b82f6",
  equipment: "#22c55e",
  packaging: "#f59e0b",
  assembly: "#a855f7",
};

export const GROUP_LABEL: Record<SegmentGroup, string> = {
  manufacturer: "Manufacturer (fab / IDM / memory)",
  fabless: "Fabless (chip design)",
  equipment: "Equipment / tooling",
  packaging: "OSAT / advanced packaging",
  assembly: "EMS / systems assembly",
};

/** Specific human label for the detail panel and tooltips. */
export const SEGMENT_LABEL: Record<CompanySegment, string> = {
  foundry: "Pure-play foundry",
  idm: "Integrated device manufacturer (IDM)",
  memory: "Memory manufacturer",
  fabless: "Fabless designer",
  equipment: "Equipment / tooling vendor",
  osat: "OSAT / advanced packaging",
  ems: "EMS / systems assembly",
};

export function isCompanySegment(value: unknown): value is CompanySegment {
  return typeof value === "string" && value in SEGMENT_GROUP;
}

export function segmentColor(segment: CompanySegment | undefined): string | undefined {
  if (!segment) return undefined;
  return GROUP_COLOR[SEGMENT_GROUP[segment]];
}

/** Legend rows in display order. */
export const SEGMENT_LEGEND: { group: SegmentGroup; color: string; label: string }[] = (
  ["manufacturer", "fabless", "equipment", "packaging", "assembly"] as SegmentGroup[]
).map((group) => ({ group, color: GROUP_COLOR[group], label: GROUP_LABEL[group] }));
