"use client";

import type { SourceRecord, TradeFlowRecord } from "@/data/graph";

function formatTradeValue(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  return `$${millions.toLocaleString()}M`;
}

export function TradeFlowsPanel({
  flows,
  sourceLookup,
  countryName,
}: {
  flows: TradeFlowRecord[];
  sourceLookup: Map<string, SourceRecord>;
  countryName: Map<string, string>;
}) {
  if (flows.length === 0) {
    return null;
  }

  const name = (id: string) =>
    countryName.get(id) ?? id.replace("country-", "").toUpperCase();

  return (
    <div className="rounded-xl border border-white/10 bg-[var(--card)] px-4 py-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Trade flows
      </h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Annual value of finished chips crossing borders. Each row is drawn as an arc
        on the map, with width scaled to trade value.
      </p>
      <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto text-xs">
        {flows.map((flow) => (
          <li
            key={flow.id}
            className="rounded-md border border-white/5 bg-black/20 px-2.5 py-2 text-[var(--foreground)]/90"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-medium">
                {name(flow.exporter_country_id)} → {name(flow.importer_country_id)}
              </p>
              <span className="shrink-0 font-semibold tabular-nums">
                {flow.value_usd_millions != null
                  ? formatTradeValue(flow.value_usd_millions)
                  : "—"}
              </span>
            </div>
            <p className="mt-0.5 text-[var(--muted)]">
              {flow.hs_label}
              {flow.value_usd_millions != null ? ` · ${flow.year}` : " · value TBD"}
            </p>
            {flow.notes ? (
              <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">{flow.notes}</p>
            ) : null}
            {(flow.source_ids ?? []).length > 0 ? (
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                Source:{" "}
                {(flow.source_ids ?? [])
                  .map((id) => sourceLookup.get(id)?.title ?? id)
                  .join(" · ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
