"use client";

import type { SourceRecord, TradeFlowRecord } from "@/data/graph";

export function TradeFlowsPanel({
  flows,
  sourceLookup,
}: {
  flows: TradeFlowRecord[];
  sourceLookup: Map<string, SourceRecord>;
}) {
  if (flows.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[var(--card)] px-4 py-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Trade flows (Comtrade)
      </h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Country → country arcs; line width scales with{" "}
        <code className="text-[10px]">value_usd_millions</code> when set (Comtrade
        preview API; Taiwan pairs use MOF / U.S. Census overrides). Refresh with{" "}
        <code className="text-[10px]">npm run fetch:trade</code>.
      </p>
      <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-xs">
        {flows.map((flow) => (
          <li
            key={flow.id}
            className="rounded-md border border-white/5 bg-black/20 px-2 py-2 text-[var(--foreground)]/90"
          >
            <p className="font-medium">
              {flow.exporter_country_id.replace("country-", "").toUpperCase()} →{" "}
              {flow.importer_country_id.replace("country-", "").toUpperCase()}
              <span className="ml-2 text-[10px] font-normal text-[var(--muted)]">
                {flow.rank}
              </span>
            </p>
            <p className="mt-0.5 text-[var(--muted)]">{flow.hs_label}</p>
            {flow.value_usd_millions != null ? (
              <p className="mt-0.5">USD {flow.value_usd_millions}M ({flow.year})</p>
            ) : (
              <p className="mt-0.5 text-[var(--muted)]">Value TBD — rank-only on map</p>
            )}
            {flow.notes ? <p className="mt-1 text-[11px]">{flow.notes}</p> : null}
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              {(flow.source_ids ?? [])
                .map((id) => sourceLookup.get(id)?.title ?? id)
                .join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
