"use client";

import Link from "next/link";
import type { TrackSlug } from "@/data/graph";

const STARTERS = [
  {
    id: "taiwan-crisis",
    title: "Taiwan Strait disruption",
    detail: "See chokepoints, relief fabs, and stressed supply arcs.",
    action: "scenario" as const,
    scenarioId: "taiwan-crisis",
  },
  {
    id: "gpu-track",
    title: "GPU supply chain",
    detail: "Accelerators, foundry capacity, and HBM memory links.",
    action: "track" as const,
    href: "/track/gpus",
  },
  {
    id: "tsmc",
    title: "Explore TSMC",
    detail: "Select the leading foundry and its connections on the map.",
    action: "node" as const,
    nodeId: "co-tsmc",
  },
];

export function SelectionEmptyState({
  trackLens,
  onRunScenario,
  onSelectNode,
}: {
  trackLens?: TrackSlug | null;
  onRunScenario?: (scenarioId: string) => void;
  onSelectNode?: (nodeId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-[var(--foreground)]/90">Start exploring</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
          Click a pin or supply link on the map, or choose a starting point below.
        </p>
      </div>
      <ul className="space-y-2">
        {STARTERS.map((item) => {
          if (item.action === "track" && trackLens === "gpus") return null;

          const body = (
            <>
              <span className="block text-sm font-medium text-[var(--foreground)]/90">{item.title}</span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">{item.detail}</span>
            </>
          );

          if (item.action === "scenario" && onRunScenario) {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onRunScenario(item.scenarioId)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-left transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5"
                >
                  {body}
                </button>
              </li>
            );
          }

          if (item.action === "track") {
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5"
                >
                  {body}
                </Link>
              </li>
            );
          }

          if (item.action === "node" && onSelectNode) {
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectNode(item.nodeId)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-left transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5"
                >
                  {body}
                </button>
              </li>
            );
          }

          return null;
        })}
      </ul>
    </div>
  );
}
