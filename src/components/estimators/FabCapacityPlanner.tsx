"use client";

import { useMemo } from "react";
import Link from "next/link";
import { EstimateFrame } from "./EstimateFrame";
import { AssumptionField } from "./AssumptionField";
import { EstimateResultCard } from "./EstimateResultCard";
import { useEditableNumbers } from "./useEstimatorState";
import { CAPACITY_DEFAULTS } from "@/data/estimators/catalog";
import { computeCapacity } from "@/lib/estimators/capacityModel";
import { formatEstimateNumber, formatPercent } from "@/lib/estimators/format";

export function FabCapacityPlanner() {
  const defaults = useMemo(
    () => ({
      waferStartsPerMonth: CAPACITY_DEFAULTS.waferStartsPerMonth,
      diesPerWafer: CAPACITY_DEFAULTS.diesPerWafer,
      yieldFraction: CAPACITY_DEFAULTS.yieldFraction,
      utilization: CAPACITY_DEFAULTS.utilization,
    }),
    [],
  );
  const { values, set, reset, kindOf } = useEditableNumbers(defaults);

  const result = useMemo(() => computeCapacity(values), [values]);
  const missingWspm = values.waferStartsPerMonth <= 0;

  return (
    <EstimateFrame
      title="Fab capacity planner"
      description="Accounting identity for teaching: good dies/month ≈ WSPM × DPW × yield × utilization. Enter WSPM yourself — we do not invent unpublished fab throughput."
      methodologyHref="/estimators#fab-capacity"
      onReset={reset}
      results={
        <>
          {missingWspm ? (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-xs text-amber-50/95">
              Enter a wafer-starts-per-month (WSPM) value to see throughput estimates. Prefer cited
              IR/news figures when you have them; otherwise treat the input as your assumption.
            </div>
          ) : null}
          <EstimateResultCard
            label="Effective wafer starts / month"
            display={
              missingWspm ? "—" : formatEstimateNumber(result.effectiveWaferStarts, { digits: 1 })
            }
            unit="wafers"
            notes={`WSPM × utilization (${formatPercent(values.utilization)}).`}
          />
          <EstimateResultCard
            label="Good dies / month"
            display={
              missingWspm ? "—" : formatEstimateNumber(result.goodDiesPerMonth, { digits: 1 })
            }
            unit="dies"
            notes="Effective starts × DPW × die yield."
          />
          <EstimateResultCard
            label="Good dies / year"
            display={
              missingWspm ? "—" : formatEstimateNumber(result.goodDiesPerYear, { digits: 1 })
            }
            unit="dies"
            notes="Month × 12 (no downtime calendar model)."
          />
          <p className="text-[11px] text-[var(--muted)]">
            Tip: seed DPW / yield from the{" "}
            <Link href="/tools/yield" className="text-[var(--accent)] underline-offset-2 hover:underline">
              Yield estimator
            </Link>
            .
          </p>
        </>
      }
    >
      <AssumptionField
        id="waferStartsPerMonth"
        label="Wafer starts / month (WSPM)"
        unit="wafers"
        value={values.waferStartsPerMonth}
        onChange={(v) => set("waferStartsPerMonth", v)}
        kind={kindOf("waferStartsPerMonth", "user")}
        notes={CAPACITY_DEFAULTS.notes.waferStartsPerMonth}
        min={0}
        step={100}
      />
      <AssumptionField
        id="diesPerWafer"
        label="Dies per wafer"
        unit="dies"
        value={values.diesPerWafer}
        onChange={(v) => set("diesPerWafer", v)}
        kind={kindOf("diesPerWafer")}
        notes={CAPACITY_DEFAULTS.notes.diesPerWafer}
        min={1}
        step={1}
      />
      <AssumptionField
        id="yieldFraction"
        label="Die yield"
        unit="fraction 0–1"
        value={values.yieldFraction}
        onChange={(v) => set("yieldFraction", v)}
        kind={kindOf("yieldFraction")}
        notes={CAPACITY_DEFAULTS.notes.yieldFraction}
        min={0}
        max={1}
        step={0.01}
      />
      <AssumptionField
        id="utilization"
        label="Utilization"
        unit="fraction 0–1"
        value={values.utilization}
        onChange={(v) => set("utilization", v)}
        kind={kindOf("utilization")}
        notes={CAPACITY_DEFAULTS.notes.utilization}
        min={0}
        max={1}
        step={0.01}
      />
    </EstimateFrame>
  );
}
