import Link from "next/link";
import { EstimateBanner } from "@/components/estimators/EstimateBanner";
import { ESTIMATORS } from "@/data/estimators/catalog";

export const metadata = {
  title: "Estimator methodology — Chip Sense",
  description:
    "Formulas, default provenance, and estimate rules for Chip Sense teaching calculators.",
};

const SECTIONS = [
  {
    id: "yield",
    title: "Yield estimator",
    href: "/tools/yield",
    formulas: [
      "Poisson: Y = e^(−A·D)",
      "Murphy: Y = (1 − e^(−A·D)) / (A·D)",
      "DPW ≈ π(R − E)² / A",
      "Good dies/wafer ≈ DPW × Y",
    ],
    defaults:
      "Die area 8 cm², D0 0.15 /cm², 300 mm wafer, 3 mm edge exclusion — teaching estimates.",
  },
  {
    id: "export-controls",
    title: "Export control simulator",
    href: "/tools/export-controls",
    formulas: [
      "Stressed companies = union of active rule targets",
      "Severity score = sum of active rule weights (teaching scale)",
    ],
    defaults:
      "Public-policy themes (EUV + DUV + service on by default to match map scenario) — theme references, not legal text.",
  },
  {
    id: "fab-capacity",
    title: "Fab capacity planner",
    href: "/tools/fab-capacity",
    formulas: ["Good dies/month ≈ WSPM × utilization × DPW × yield"],
    defaults:
      "WSPM starts at 0 (you must enter it). DPW/yield/utilization ship as teaching estimates.",
  },
  {
    id: "packaging-cost",
    title: "Packaging cost model",
    href: "/tools/packaging-cost",
    formulas: [
      "C_unit = substrate + assembly + test",
      "C_yield-adj = C_unit / Y_pkg",
      "C_batch = N × C_yield-adj",
    ],
    defaults:
      "Illustrative CoWoS-class cost split; sanity band ~$500–$2000 / AI GPU package (trade-press range).",
  },
  {
    id: "ai-cluster-demand",
    title: "AI cluster demand model",
    href: "/tools/ai-cluster-demand",
    formulas: [
      "GPUs = clusters × GPUs/cluster",
      "HBM stacks = GPUs × stacks/GPU",
      "Packages ≈ GPUs / Y_pkg",
      "Logic wafers ≈ GPUs / (DPW × Y_die)",
    ],
    defaults: "8-GPU cluster shape, illustrative HBM stacks/GB — replace with your SKU.",
  },
] as const;

export default function EstimatorsMethodologyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Chip Sense
          </Link>
          {" / "}
          Methodology
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Estimator methodology</h1>
        <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Formulas and default provenance for the estimate tools. Full write-up with equations:{" "}
          <a
            href="https://github.com/aminalav/chip-sense/blob/main/ESTIMATORS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            ESTIMATORS.md
          </a>
          .
        </p>
      </header>

      <EstimateBanner />

      <section id="methodology" className="space-y-3">
        <h2 className="text-lg font-semibold">How estimates stay estimates</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
          <li>Formulas are public teaching identities, not calibrated foundry models.</li>
          <li>Defaults are labeled estimate (or left blank, like WSPM). A <code>cited</code> kind is reserved for future filing-backed parameters — tools currently ship estimate/user only.</li>
          <li>Edits you make are labeled your input.</li>
          <li>Outputs use ~ / ranges and an amber estimate badge.</li>
        </ul>
        <p className="text-sm text-[var(--muted)]">
          Open the tools:{" "}
          <Link href="/tools" className="text-[var(--accent)] underline-offset-2 hover:underline">
            /tools
          </Link>
          {ESTIMATORS.map((t) => (
            <span key={t.id}>
              {" · "}
              <Link
                href={`/tools/${t.id}`}
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {t.id}
              </Link>
            </span>
          ))}
        </p>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <Link
              href={section.href}
              className="text-xs text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Open tool →
            </Link>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Formulas
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 font-mono text-xs text-[var(--foreground)]/90">
              {section.formulas.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]/90">Defaults: </span>
            {section.defaults}
          </p>
        </section>
      ))}

      <footer className="border-t border-white/10 pt-4 text-xs text-[var(--muted)]">
        <Link href="/tools" className="text-[var(--accent)] underline-offset-2 hover:underline">
          ← Estimate tools
        </Link>
        {" · "}
        <Link href="/" className="text-[var(--accent)] underline-offset-2 hover:underline">
          Map
        </Link>
      </footer>
    </main>
  );
}
