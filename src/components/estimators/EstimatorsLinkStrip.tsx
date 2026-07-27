import Link from "next/link";
import { ESTIMATORS } from "@/data/estimators/catalog";

/** Compact home-page strip — discovery without competing with the map. */
export function EstimatorsLinkStrip() {
  return (
    <section
      data-tour="estimate-tools"
      className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 text-xs leading-relaxed"
    >
      <h2 className="shrink-0 text-sm font-medium text-[var(--foreground)]/90">Estimate tools</h2>
      <span className="text-[var(--muted)]/40" aria-hidden>
        ·
      </span>
      {ESTIMATORS.map((tool, i) => (
        <span key={tool.id} className="inline-flex items-baseline gap-x-2">
          {i > 0 ? (
            <span className="text-[var(--muted)]/40" aria-hidden>
              ·
            </span>
          ) : null}
          <Link
            href={`/tools/${tool.id}`}
            className="text-[var(--muted)] underline-offset-2 transition hover:text-[var(--accent)] hover:underline"
          >
            {shortTitle(tool.title)}
          </Link>
        </span>
      ))}
      <span className="text-[var(--muted)]/40" aria-hidden>
        ·
      </span>
      <Link
        href="/tools"
        className="text-[var(--accent)] underline-offset-2 hover:underline"
      >
        All tools
      </Link>
      <span className="text-[var(--muted)]/40" aria-hidden>
        ·
      </span>
      <Link
        href="/estimators"
        className="text-[var(--muted)] underline-offset-2 transition hover:text-[var(--accent)] hover:underline"
      >
        Methodology
      </Link>
    </section>
  );
}

function shortTitle(title: string): string {
  return title
    .replace(/ estimator$/i, "")
    .replace(/ simulator$/i, "")
    .replace(/ planner$/i, "")
    .replace(/ model$/i, "");
}
