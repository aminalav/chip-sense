"use client";

import type { EstimateKind } from "@/lib/estimators/types";
import { kindLabel } from "@/lib/estimators/format";

const KIND_STYLES: Record<EstimateKind, string> = {
  cited: "border-blue-400/40 bg-blue-500/15 text-blue-100",
  estimate: "border-amber-400/40 bg-amber-500/15 text-amber-100",
  user: "border-white/20 bg-white/10 text-[var(--foreground)]",
};

export function KindBadge({ kind }: { kind: EstimateKind }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${KIND_STYLES[kind]}`}
    >
      {kindLabel(kind)}
    </span>
  );
}
