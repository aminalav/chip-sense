"use client";

import { KindBadge } from "./KindBadge";
import type { EstimateKind } from "@/lib/estimators/types";

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  kind: EstimateKind;
  notes?: string;
  min?: number;
  max?: number;
  step?: number;
  sourceLabel?: string;
  sourceUrl?: string;
};

export function AssumptionField({
  id,
  label,
  value,
  onChange,
  unit,
  kind,
  notes,
  min,
  max,
  step = 0.01,
  sourceLabel,
  sourceUrl,
}: Props) {
  return (
    <label className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-[var(--card)]/60 p-3">
      <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--foreground)]">
        {label}
        <KindBadge kind={kind} />
        {unit ? <span className="text-xs font-normal text-[var(--muted)]">{unit}</span> : null}
      </span>
      <input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-white/15 bg-[var(--surface-workspace)] px-2.5 py-1.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
      />
      {notes ? <span className="text-[11px] leading-relaxed text-[var(--muted)]">{notes}</span> : null}
      {sourceLabel ? (
        <span className="text-[11px] text-[var(--muted)]">
          Source:{" "}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {sourceLabel}
            </a>
          ) : (
            sourceLabel
          )}
        </span>
      ) : null}
    </label>
  );
}
