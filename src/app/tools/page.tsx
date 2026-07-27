import Link from "next/link";
import { EstimateBanner } from "@/components/estimators/EstimateBanner";
import { EstimatorsIndex, EstimatorsNav } from "@/components/estimators/EstimatorShell";

export const metadata = {
  title: "Estimate tools — Chip Sense",
  description:
    "Illustrative semiconductor estimators: yield, export controls, fab capacity, packaging cost, and AI cluster demand.",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Chip Sense
          </Link>
          {" / "}
          Tools
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Estimate tools
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          What-if calculators for essays and teaching. Every output is an estimate under editable
          assumptions — not a forecast. Formulas and default provenance are documented in{" "}
          <Link href="/estimators" className="text-[var(--accent)] underline-offset-2 hover:underline">
            methodology
          </Link>
          .
        </p>
      </header>

      <EstimateBanner />
      <EstimatorsNav />

      <section
        aria-labelledby="tools-how-to"
        className="rounded-xl border border-white/10 bg-[var(--card)]/50 px-4 py-3.5"
      >
        <h2
          id="tools-how-to"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          How to use these tools
        </h2>
        <ol className="mt-2.5 space-y-2 text-sm leading-relaxed text-[var(--foreground)]/90">
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[var(--muted)]">
              1
            </span>
            <span>Pick a calculator below for the story you want to explore.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[var(--muted)]">
              2
            </span>
            <span>
              On each tool page, edit Assumptions on the left. Amber badges are teaching estimates;
              they flip to Your input when you change a value.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[var(--muted)]">
              3
            </span>
            <span>
              Read Estimated results on the right (~ means estimate). Open Methodology for formulas
              and default provenance.
            </span>
          </li>
        </ol>
      </section>

      <EstimatorsIndex />

      <footer className="border-t border-white/10 pt-4 text-xs text-[var(--muted)]">
        <Link href="/" className="text-[var(--accent)] underline-offset-2 hover:underline">
          ← Back to map
        </Link>
        {" · "}
        <Link
          href="https://github.com/aminalav/chip-sense/blob/main/ESTIMATORS.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          ESTIMATORS.md on GitHub
        </Link>
      </footer>
    </main>
  );
}
