import { NODE_ROLE_RING } from "@/lib/scenarioEffects";

const LEGEND = [
  { label: "Disrupted / chokepoint", color: NODE_ROLE_RING.chokepoint ?? "#f87171" },
  { label: "Stressed", color: "#fb923c" },
  { label: "Partial relief", color: NODE_ROLE_RING.partial_relief ?? "#34d399" },
  { label: "Substitution / buffer", color: NODE_ROLE_RING.substitution_buffer ?? "#22d3ee" },
] as const;

export function ScenarioRoleLegend() {
  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-amber-500/25 bg-amber-500/5 px-2 py-1.5 text-[10px] text-[var(--muted)]"
      role="note"
    >
      <span className="font-medium text-amber-100/90">Scenario colors</span>
      {LEGEND.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full ring-2"
            style={{ boxShadow: `0 0 0 2px ${item.color}` }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
