import type { SourceRecord } from "@/data/graph";

export function SourcesLinkedStrip({
  sources,
  scopeLabel,
  sourceCatalogCount,
}: {
  sources: SourceRecord[];
  scopeLabel: string;
  sourceCatalogCount: number;
}) {
  return (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Sources linked ({scopeLabel})
        </h2>
        <p className="text-[11px] text-[var(--muted)]">
          {sourceCatalogCount} catalog entries · {sources.length} cited in this view
        </p>
      </div>
      {sources.length > 0 ? (
        <>
          <p className="text-[10px] text-[var(--muted)]">
            {sources.length} citation{sources.length === 1 ? "" : "s"} in this view — scroll horizontally →
          </p>
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
            {sources.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex w-[200px] shrink-0 snap-start flex-col rounded-lg border border-white/10 bg-[var(--card)] px-3 py-2 transition hover:border-white/20"
              >
              <span className="line-clamp-2 text-xs font-medium text-[var(--accent)] underline-offset-4 hover:underline">
                {s.title}
              </span>
              {s.publisher ? (
                <span className="mt-1 truncate text-[10px] text-[var(--muted)]">{s.publisher}</span>
              ) : null}
            </a>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--muted)]">
          No edge facts cite a source in this view.
        </p>
      )}
    </div>
  );
}
