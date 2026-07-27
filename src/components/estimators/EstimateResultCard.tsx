"use client";

import { KindBadge } from "./KindBadge";
import type { EstimateKind } from "@/lib/estimators/types";

export function EstimateResultCard({
  label,
  display,
  unit,
  kind = "estimate",
  notes,
}: {
  label: string;
  display: string;
  unit?: string;
  kind?: EstimateKind;
  notes?: string;
}) {
  return (
    <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <KindBadge kind={kind} />
      </div>
      <p className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {display}
        {unit ? (
          <span className="ml-1 text-sm font-normal text-[var(--muted)]">{unit}</span>
        ) : null}
      </p>
      {notes ? <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">{notes}</p> : null}
    </div>
  );
}
