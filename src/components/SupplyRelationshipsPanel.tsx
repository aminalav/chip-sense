"use client";

export function SupplyRelationshipsPanel({
  relationships,
  selectedEdgeId,
  onSelectEdge,
  scopeLabel,
}: {
  relationships: { id: string; from: string; verb: string; to: string }[];
  selectedEdgeId: string | null;
  onSelectEdge: (id: string) => void;
  scopeLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-[var(--muted)]">
          Cited supply links in the <span className="text-[var(--foreground)]/80">{scopeLabel}</span>{" "}
          view — select one for citations in the Selection tab.
        </p>
        <p className="mt-1 text-[10px] text-[var(--muted)]">{relationships.length} in view</p>
      </div>
      {relationships.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">No supply relationships in this view.</p>
      ) : (
        <ul className="max-h-[min(52vh,520px)] space-y-1.5 overflow-y-auto">
          {relationships.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onSelectEdge(e.id)}
                className={`w-full rounded-md border px-2.5 py-2 text-left text-[12px] leading-snug transition ${
                  selectedEdgeId === e.id
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                    : "border-white/5 bg-black/20 text-[var(--foreground)]/85 hover:border-white/15"
                }`}
              >
                <span className="font-medium">{e.from}</span>{" "}
                <span className="text-[var(--muted)]">{e.verb}</span>{" "}
                <span className="font-medium">{e.to}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
