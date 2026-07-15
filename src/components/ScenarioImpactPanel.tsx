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
  embedded = false,
  onSelectNode,
  onSelectEdge,
}: {
  scenario: Scenario | undefined;
  effects: ScenarioEffects | null;
  embedded?: boolean;
  onSelectNode?: (nodeId: string) => void;
  onSelectEdge?: (edgeId: string) => void;
}) {
  if (!scenario || scenario.id === "baseline" || !effects) {
    return (
      <div
        className={
          embedded
            ? "text-sm text-[var(--muted)]"
            : "rounded-xl border border-white/10 bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]"
        }
      >
        {scenario?.id === "baseline" ? (
          <>
            <span className="text-[var(--foreground)]/90">Baseline</span> — sourced registry and
            cited fab pins. Select an illustrative scenario in the map toolbar to see
            stress-test styling and assumptions.
          </>
        ) : (
          <>Select a non-baseline scenario to see illustrative assumptions and how pins and supply links are styled on the map.</>
        )}
      </div>
    );
  }

  const impacts = effects.impacts;
  const canSelect = Boolean(onSelectNode || onSelectEdge);

  return (
    <div
      className={
        embedded ? "space-y-4" : "space-y-4 rounded-xl border border-white/10 bg-[var(--card)] px-4 py-4"
      }
    >
      <div>
        {!embedded ? (
          <h2 className="text-sm font-medium text-[var(--muted)]">Scenario impact</h2>
        ) : (
          <h2 className="text-sm font-medium text-[var(--foreground)]/90">{scenario.label}</h2>
        )}
        <p className="mt-1 text-xs text-amber-100/80">
          Illustrative only — multipliers are not sourced forecasts.
        </p>
      </div>

      <p className="text-sm text-[var(--foreground)]/90">{scenario.description}</p>

      {effects.assumptionLines.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)]">Assumptions</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[var(--foreground)]/85">
            {effects.assumptionLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-xs font-medium text-[var(--muted)]">{effects.narrative.title}</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs text-[var(--foreground)]/90">
          {effects.narrative.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      {impacts.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)]">
            Highlighted on map ({impacts.length})
          </h3>
          {canSelect ? (
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              Click a row to select it on the map.
            </p>
          ) : null}
          <ul className="mt-2 max-h-[min(40vh,360px)] space-y-1.5 overflow-y-auto pr-1">
            {impacts.map((row) => {
              const isNode = effects.nodeRoles.has(row.id);
              const isEdge = effects.edgeRoles.has(row.id);
              const selectable =
                (isNode && onSelectNode) || (isEdge && onSelectEdge);

              return (
                <li key={row.id}>
                  {selectable ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (isNode) onSelectNode?.(row.id);
                        else if (isEdge) onSelectEdge?.(row.id);
                      }}
                      className="flex w-full items-start justify-between gap-2 rounded-md border border-white/5 bg-black/20 px-2 py-1.5 text-left text-[11px] transition hover:border-white/15 hover:bg-black/30"
                    >
                      <span className="text-[var(--foreground)]/90">{row.label}</span>
                      <span
                        className={`shrink-0 rounded border px-1.5 py-0.5 font-medium uppercase tracking-wide ${ROLE_BADGE[row.role] ?? "border-white/10 text-[var(--muted)]"}`}
                      >
                        {row.role.replace(/_/g, " ")}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-start justify-between gap-2 rounded-md border border-white/5 bg-black/20 px-2 py-1.5 text-[11px]">
                      <span className="text-[var(--foreground)]/90">{row.label}</span>
                      <span
                        className={`shrink-0 rounded border px-1.5 py-0.5 font-medium uppercase tracking-wide ${ROLE_BADGE[row.role] ?? "border-white/10 text-[var(--muted)]"}`}
                      >
                        {row.role.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
