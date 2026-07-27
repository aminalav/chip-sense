"use client";

import Link from "next/link";
import { EstimateBanner } from "./EstimateBanner";

export function EstimateFrame({
  title,
  description,
  methodologyHref = "/estimators#methodology",
  onReset,
  children,
  results,
}: {
  title: string;
  description: string;
  methodologyHref?: string;
  onReset: () => void;
  children: React.ReactNode;
  results: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <EstimateBanner />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-[var(--foreground)] hover:border-white/30"
          >
            Reset to defaults
          </button>
          <Link
            href={methodologyHref}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-[var(--accent)] hover:border-white/30"
          >
            Methodology
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--foreground)]">Assumptions</h3>
          <p className="text-[11px] text-[var(--muted)]">
            Edit any field — values you change are treated as{" "}
            <span className="text-[var(--foreground)]">your input</span>, not Chip Sense published
            facts.
          </p>
          <div className="space-y-2">{children}</div>
        </section>
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--foreground)]">Estimated results</h3>
          <p className="text-[11px] text-[var(--muted)]">
            Outputs use ~ / ranges on purpose. Basis: your current assumptions.
          </p>
          <div className="space-y-2">{results}</div>
        </section>
      </div>
    </div>
  );
}
