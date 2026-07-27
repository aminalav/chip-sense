"use client";

export function EstimateBanner() {
  return (
    <div
      className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-50/95"
      role="status"
    >
      <span className="font-medium">Estimates only.</span> These tools are illustrative what-if
      calculators for teaching and writing — not forecasts, quotes, fab plans, or legal/compliance
      advice. Defaults are curated teaching values; replace them with your own inputs.
    </div>
  );
}
