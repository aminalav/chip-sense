"use client";

import Link from "next/link";
import { ESTIMATORS } from "@/data/estimators/catalog";
import type { EstimatorId } from "@/lib/estimators/types";
import { YieldEstimator } from "./YieldEstimator";
import { ExportControlSimulator } from "./ExportControlSimulator";
import { FabCapacityPlanner } from "./FabCapacityPlanner";
import { PackagingCostModel } from "./PackagingCostModel";
import { AiClusterDemandModel } from "./AiClusterDemandModel";

export function EstimatorTool({ id }: { id: EstimatorId }) {
  switch (id) {
    case "yield":
      return <YieldEstimator />;
    case "export-controls":
      return <ExportControlSimulator />;
    case "fab-capacity":
      return <FabCapacityPlanner />;
    case "packaging-cost":
      return <PackagingCostModel />;
    case "ai-cluster-demand":
      return <AiClusterDemandModel />;
  }
}

export function EstimatorsIndex() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ESTIMATORS.map((tool) => (
        <Link
          key={tool.id}
          href={`/tools/${tool.id}`}
          className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-[var(--card)]/80 px-4 py-4 transition hover:border-white/25"
          style={{ borderTopWidth: 3, borderTopColor: tool.accent }}
        >
          <span className="text-sm font-medium text-[var(--foreground)]">{tool.title}</span>
          <span className="text-xs leading-relaxed text-[var(--muted)]">{tool.short}</span>
          <span className="text-[11px] text-[var(--accent)] opacity-90 group-hover:underline">
            Open estimator →
          </span>
        </Link>
      ))}
    </div>
  );
}

export function EstimatorsNav({ activeId }: { activeId?: string }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Estimators">
      <Link
        href="/tools"
        className={`rounded-md border px-2.5 py-1 text-xs ${
          !activeId
            ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--foreground)]"
            : "border-white/10 text-[var(--muted)] hover:border-white/25"
        }`}
      >
        All tools
      </Link>
      {ESTIMATORS.map((tool) => (
        <Link
          key={tool.id}
          href={`/tools/${tool.id}`}
          className={`rounded-md border px-2.5 py-1 text-xs ${
            activeId === tool.id
              ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--foreground)]"
              : "border-white/10 text-[var(--muted)] hover:border-white/25"
          }`}
        >
          {tool.title.replace(/ estimator| simulator| planner| model/gi, "")}
        </Link>
      ))}
      <Link
        href="/estimators"
        className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-[var(--muted)] hover:border-white/25"
      >
        Methodology
      </Link>
    </nav>
  );
}
