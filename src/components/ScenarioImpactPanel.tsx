"use client";

import type { Scenario } from "@/data/graph";
import type { ScenarioEffects } from "@/lib/scenarioEffects";

const ROLE_BADGE: Record<string, string> = {
  chokepoint: "bg-red-500/20 text-red-200 border-red-500/40",
  disrupted: "bg-red-500/20 text-red-200 border-red-500/40",
  stressed: "bg-orange-500/20 text-orange-200 border-orange-500/40",
  partial_relief: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  substitution_buffer: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
  buffered: "bg-cyan-500/20 text-cyan-200 border-cyan-500/40",
};

export function ScenarioImpactPanel({
  scenario,
  effects,
}: {
  scenario: Scenario | undefined;
  effects: ScenarioEffects | null;
}) {
  if (!scenario || scenario.id === "baseline" || !effects) {
    return (
      <div className="rounded-xl border border-white/10 bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
        {scenario?.id === "baseline" ? (
          <>
            <span className="text-[var(--foreground)]/90">Baseline</span> — sourced registry and
            cited fab pins. Select an illustrative scenario below the map to see stress-test styling
            and assumptions.
          </>
        ) : (
          <>Select a non-baseline scenario to see illustrative assumptions and how pins and supply links are styled on the map.</>
        )}
      </div>
    );
  }

  const topImpacts = effects.impacts.slice(0, 12);
  const moreCount = effects.impacts.length - topImpacts.length;

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-[var(--card)] px-4 py-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Scenario impact
        </h2>
        <p className="mt-1 text-xs text-amber-100/80">
          Illustrative only — multipliers are not sourced forecasts.
        </p>
      </div>

      <p className="text-sm text-[var(--foreground)]/90">{scenario.description}</p>

      {effects.assumptionLines.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Assumptions
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[var(--foreground)]/85">
            {effects.assumptionLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {effects.narrative.title}
        </h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-[var(--foreground)]/90">
          {effects.narrative.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      {topImpacts.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Highlighted on map ({effects.impacts.length})
          </h3>
          <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto">
            {topImpacts.map((row) => (
              <li
                key={row.id}
                className="flex items-start justify-between gap-2 rounded-md border border-white/5 bg-black/20 px-2 py-1.5 text-[11px]"
              >
                <span className="text-[var(--foreground)]/90">{row.label}</span>
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 font-medium uppercase tracking-wide ${ROLE_BADGE[row.role] ?? "border-white/10 text-[var(--muted)]"}`}
                >
                  {row.role.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
          {moreCount > 0 && (
            <p className="mt-1 text-[10px] text-[var(--muted)]">+{moreCount} more on map</p>
          )}
        </div>
      )}
    </div>
  );
}
