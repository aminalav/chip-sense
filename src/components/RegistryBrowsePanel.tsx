"use client";

import { useMemo, useState } from "react";
import type { GraphEdge, GraphNode, TrackSlug } from "@/data/graph";
import {
  buildRegistryIndex,
  filterRegistryBrowse,
  REGISTRY_COUNTRIES,
  REGISTRY_KIND_FILTERS,
  REGISTRY_KIND_LABEL,
  REGISTRY_SEGMENT_FILTERS,
  type RegistryEntityKind,
  type RegistryEntry,
} from "@/lib/registryIndex";
import { SEGMENT_LABEL, type CompanySegment } from "@/lib/segments";

function entrySubtitle(entry: RegistryEntry): string {
  const parts = [REGISTRY_KIND_LABEL[entry.kind]];
  if (entry.segment) parts.push(SEGMENT_LABEL[entry.segment]);
  if (entry.countries.length > 0) parts.push(entry.countries.join(", "));
  return parts.join(" · ");
}

export function RegistryBrowsePanel({
  graphNodes,
  graphEdges,
  trackLens,
  selectedNodeId,
  onSelectNode,
}: {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  trackLens: TrackSlug | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}) {
  const [countryId, setCountryId] = useState("");
  const [segment, setSegment] = useState<"all" | CompanySegment>("all");
  const [kind, setKind] = useState<"all" | RegistryEntityKind>("all");

  const entries = useMemo(
    () => buildRegistryIndex(graphNodes, graphEdges),
    [graphNodes, graphEdges],
  );

  const filtered = useMemo(
    () =>
      filterRegistryBrowse(entries, {
        countryId: countryId || null,
        segment,
        kind,
        trackLens,
      }),
    [entries, countryId, segment, kind, trackLens],
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-[var(--foreground)]/90">Browse registry</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
          Filter by country, segment, or entity type — then select a row to inspect it on the map.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
          Country
        </label>
        <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
        >
          <option value="">All countries</option>
          {REGISTRY_COUNTRIES.map((country) => (
            <option key={country.id} value={country.id}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="block text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Segment
          </label>
          <select
            value={segment}
            onChange={(e) =>
              setSegment(e.target.value as "all" | CompanySegment)
            }
            className="w-full rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
          >
            {REGISTRY_SEGMENT_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Type
          </label>
          <select
            value={kind}
            onChange={(e) =>
              setKind(e.target.value as "all" | RegistryEntityKind)
            }
            className="w-full rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
          >
            {REGISTRY_KIND_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="text-[10px] text-[var(--muted)]">
          {filtered.length} entit{filtered.length === 1 ? "y" : "ies"} in view
        </p>
        {filtered.length === 0 ? (
          <p className="mt-2 text-xs text-[var(--muted)]">
            No entities match these filters. Try another country or widen the type filter.
          </p>
        ) : (
          <ul className="mt-2 max-h-[min(52vh,520px)] space-y-1.5 overflow-y-auto pr-1">
            {filtered.map((entry) => (
              <li key={entry.nodeId}>
                <button
                  type="button"
                  onClick={() => onSelectNode(entry.nodeId)}
                  className={`flex w-full flex-col rounded-md border px-2.5 py-2 text-left transition ${
                    selectedNodeId === entry.nodeId
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-white/5 bg-black/20 hover:border-white/15"
                  }`}
                >
                  <span className="text-xs font-medium text-[var(--foreground)]/90">
                    {entry.label}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[var(--muted)]">
                    {entrySubtitle(entry)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
