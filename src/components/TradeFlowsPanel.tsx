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
  selectedFlowId = null,
  onSelectFlow,
}: {
  flows: TradeFlowRecord[];
  sourceLookup: Map<string, SourceRecord>;
  countryName: Map<string, string>;
  selectedFlowId?: string | null;
  onSelectFlow?: (id: string) => void;
}) {
  const name = (id: string) =>
    countryName.get(id) ?? id.replace("country-", "").toUpperCase();

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-medium text-[var(--foreground)]/80">Trade flows</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Annual value of finished chips crossing borders. Each row is drawn as an arc on the map,
        with width scaled to trade value.
      </p>
      {flows.length === 0 ? (
        <p className="mt-3 text-xs text-[var(--muted)]">
          No trade flows match this track lens. Try the global board with trade flows enabled, or
          check back after the trade dataset is expanded.
        </p>
      ) : (
        <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto text-xs">
          {flows.map((flow) => (
            <li key={flow.id}>
              <button
                type="button"
                onClick={() => onSelectFlow?.(flow.id)}
                className={`w-full rounded-md border px-2.5 py-2 text-left transition ${
                  selectedFlowId === flow.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                    : "border-white/5 bg-black/20 text-[var(--foreground)]/90 hover:border-white/15"
                }`}
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
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
