import Link from "next/link";
import { TRACKS } from "@/data/tracks";
import { TrackIcon } from "@/components/TrackIcon";

export function EditorialTracksBar() {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-medium text-[var(--foreground)]/90">Industry lenses</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Open a focused board for memory, processors, accelerators, or data-center supply chains.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {TRACKS.map((t) => (
          <Link
            key={t.slug}
            href={`/track/${t.slug}`}
            className="group flex min-w-0 flex-col gap-2 rounded-xl border border-white/10 bg-[var(--card)]/80 px-3 py-3 transition hover:border-white/20 hover:bg-[var(--card)]"
            style={{ borderTopWidth: 3, borderTopColor: t.accentHex }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
              <span
                className="inline-flex rounded-md p-1.5"
                style={{ backgroundColor: `${t.accentHex}22`, color: t.accentHex }}
              >
                <TrackIcon slug={t.slug} />
              </span>
              {t.title}
            </span>
            <span className="text-xs leading-relaxed text-[var(--muted)]">{t.short}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
