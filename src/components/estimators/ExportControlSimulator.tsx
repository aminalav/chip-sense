"use client";

import { useMemo } from "react";
import Link from "next/link";
import { EstimateFrame } from "./EstimateFrame";
import { EstimateResultCard } from "./EstimateResultCard";
import { KindBadge } from "./KindBadge";
import { useToggleSet } from "./useEstimatorState";
import { COMPANY_LABELS, EXPORT_RULES } from "@/data/estimators/catalog";
import { simulateExportControls } from "@/lib/estimators/exportModel";

export function ExportControlSimulator() {
  const defaultOn = useMemo(
    () => EXPORT_RULES.filter((r) => r.defaultOn).map((r) => r.id),
    [],
  );
  const { active, toggle, reset } = useToggleSet(defaultOn);

  const result = useMemo(() => simulateExportControls(EXPORT_RULES, active), [active]);

  return (
    <EstimateFrame
      title="Export control simulator"
      description="Toggle teaching rules derived from public export-control themes. Results highlight which Chip Sense companies would be stressed in a what-if — not a legal determination."
      methodologyHref="/estimators#export-controls"
      onReset={() => reset(defaultOn)}
      results={
        <>
          <EstimateResultCard
            label="Illustrative severity"
            display={result.severityLabel}
            notes={`Score ${result.severityScore} from active rule weights (teaching scale, not a real risk rating).`}
          />
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-3">
            <div className="flex items-center gap-2">
              <p className="text-xs text-[var(--muted)]">Stressed companies</p>
              <KindBadge kind="estimate" />
            </div>
            {result.stressedCompanyIds.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">None — enable at least one rule.</p>
            ) : (
              <ul className="mt-2 flex flex-wrap gap-2">
                {result.stressedCompanyIds.map((id) => (
                  <li key={id}>
                    <Link
                      href={`/?node=${id}&scenario=export-controls`}
                      className="inline-flex rounded-md border border-white/15 bg-[var(--card)] px-2 py-1 text-xs text-[var(--foreground)] hover:border-[var(--accent)]"
                    >
                      {COMPANY_LABELS[id] ?? id}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[11px] text-[var(--muted)]">
              Links open the map on the export-controls scenario with that node selected.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 p-3">
            <p className="text-xs font-medium text-[var(--foreground)]">Estimated effects</p>
            {result.effects.length === 0 ? (
              <p className="mt-2 text-xs text-[var(--muted)]">No active rules.</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-[var(--muted)]">
                {result.effects.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      }
    >
      {EXPORT_RULES.map((rule) => {
        const on = active.has(rule.id);
        return (
          <label
            key={rule.id}
            className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition ${
              on
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-white/10 bg-[var(--card)]/60 hover:border-white/20"
            }`}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="space-y-1">
                <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  {rule.label}
                  <KindBadge kind="estimate" />
                </span>
                <span className="block text-[11px] leading-relaxed text-[var(--muted)]">
                  {rule.description}
                </span>
                <a
                  href={rule.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[var(--accent)] underline-offset-2 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {rule.sourceLabel}
                </a>
              </span>
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(rule.id)}
                className="mt-1 h-4 w-4 accent-[var(--accent)]"
              />
            </span>
          </label>
        );
      })}
    </EstimateFrame>
  );
}
