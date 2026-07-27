"use client";

/** Compact how-to strip shared by every estimate tool. */
export function EstimateHowTo({ steps }: { steps: string[] }) {
  return (
    <section
      aria-labelledby="estimate-how-to-heading"
      className="rounded-xl border border-white/10 bg-[var(--card)]/50 px-4 py-3.5"
    >
      <h3
        id="estimate-how-to-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
      >
        How to use
      </h3>
      <ol className="mt-2.5 space-y-2">
        <li className="flex gap-3 text-sm leading-relaxed text-[var(--foreground)]/90">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[var(--muted)]"
            aria-hidden
          >
            1
          </span>
          <span>
            Review <span className="text-[var(--foreground)]">Assumptions</span> on the left.
            Amber badges are teaching estimates; they become{" "}
            <span className="text-[var(--foreground)]">Your input</span> when you edit.
          </span>
        </li>
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex gap-3 text-sm leading-relaxed text-[var(--foreground)]/90"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[var(--muted)]"
              aria-hidden
            >
              {i + 2}
            </span>
            <span>{step}</span>
          </li>
        ))}
        <li className="flex gap-3 text-sm leading-relaxed text-[var(--foreground)]/90">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-[var(--muted)]"
            aria-hidden
          >
            {steps.length + 2}
          </span>
          <span>
            Read <span className="text-[var(--foreground)]">Estimated results</span> on the right
            (~ means estimate). Use <span className="text-[var(--foreground)]">Reset</span> or{" "}
            <span className="text-[var(--foreground)]">Methodology</span> anytime.
          </span>
        </li>
      </ol>
    </section>
  );
}
