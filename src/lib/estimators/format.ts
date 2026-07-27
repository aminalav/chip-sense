import type { EstimateKind } from "./types";

/** Prefer teaching-friendly precision: avoid false decimals on large counts. */
export function formatEstimateNumber(
  value: number,
  opts?: { digits?: number; forceTilde?: boolean },
): string {
  const digits = opts?.digits ?? 2;
  const tilde = opts?.forceTilde !== false;
  const prefix = tilde ? "~" : "";

  if (!Number.isFinite(value)) return "—";

  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(digits)}M`;
  }
  if (abs >= 10_000) {
    return `${prefix}${(value / 1_000).toFixed(digits)}k`;
  }
  if (abs >= 100) {
    return `${prefix}${Math.round(value).toLocaleString("en-US")}`;
  }
  if (abs >= 1) {
    return `${prefix}${value.toFixed(Math.min(digits, 2))}`;
  }
  return `${prefix}${value.toFixed(Math.max(digits, 3))}`;
}

export function formatPercent(fraction: number, digits = 1): string {
  if (!Number.isFinite(fraction)) return "—";
  return `~${(fraction * 100).toFixed(digits)}%`;
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1_000_000) {
    return `~$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `~$${(value / 1_000).toFixed(1)}k`;
  }
  return `~$${value.toFixed(0)}`;
}

export function formatRange(low: number, high: number, fmt: (n: number) => string): string {
  return `${fmt(low)} – ${fmt(high).replace(/^~/, "")}`;
}

export function kindLabel(kind: EstimateKind): string {
  switch (kind) {
    case "cited":
      return "Cited";
    case "estimate":
      return "Estimate";
    case "user":
      return "Your input";
  }
}
