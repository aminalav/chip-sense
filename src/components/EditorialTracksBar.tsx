import Link from "next/link";
import { TRACKS } from "@/data/tracks";

export function EditorialTracksBar() {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Editorial tracks
        </h2>
        <p className="text-xs text-[var(--muted)]">
          Dedicated boards with track-specific research notes
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <Link
            key={t.slug}
            href={`/track/${t.slug}`}
            className="group flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-[var(--card)] px-3 py-2 transition hover:border-white/20"
            style={{ borderLeftWidth: 3, borderLeftColor: t.cssVar }}
          >
            <span className="shrink-0 text-sm font-medium text-[var(--foreground)]">
              {t.title}
            </span>
            <span className="hidden truncate text-xs text-[var(--muted)] sm:inline">
              {t.short}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
