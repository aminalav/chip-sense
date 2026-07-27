"use client";

import { useMemo } from "react";
import { EstimateFrame } from "./EstimateFrame";
import { AssumptionField } from "./AssumptionField";
import { EstimateResultCard } from "./EstimateResultCard";
import { useEditableNumbers } from "./useEstimatorState";
import { PACKAGING_DEFAULTS } from "@/data/estimators/catalog";
import { computePackagingCost } from "@/lib/estimators/packagingModel";
import { formatPercent, formatUsd } from "@/lib/estimators/format";

export function PackagingCostModel() {
  const defaults = useMemo(
    () => ({
      units: PACKAGING_DEFAULTS.units,
      substrateUsd: PACKAGING_DEFAULTS.substrateUsd,
      assemblyUsd: PACKAGING_DEFAULTS.assemblyUsd,
      testUsd: PACKAGING_DEFAULTS.testUsd,
      packageYield: PACKAGING_DEFAULTS.packageYield,
    }),
    [],
  );
  const { values, set, reset, kindOf } = useEditableNumbers(defaults);
  const result = useMemo(() => computePackagingCost(values), [values]);

  return (
    <EstimateFrame
      title="Packaging cost model"
      description="Coarse $/unit build-up for advanced packaging teaching stories (substrate + assembly + test, inflated by package yield). Not an OSAT quote."
      methodologyHref="/estimators#packaging-cost"
      onReset={reset}
      results={
        <>
          <EstimateResultCard
            label="Unit cost (before yield loss)"
            display={formatUsd(result.unitCostUsd)}
            notes="Substrate + assembly + test."
          />
          <EstimateResultCard
            label="Unit cost (with package yield)"
            display={formatUsd(result.unitCostWithYieldUsd)}
            notes={`Base ÷ package yield (${formatPercent(values.packageYield)}).`}
          />
          <EstimateResultCard
            label="Batch total"
            display={formatUsd(result.totalUsd)}
            notes={`${values.units.toLocaleString("en-US")} units × yield-adjusted unit cost.`}
          />
          <EstimateResultCard
            label="Implied yield-loss cost"
            display={formatUsd(result.yieldLossUsd)}
            notes="Extra spend attributed to package yield below 100%."
          />
          <div className="rounded-lg border border-white/10 p-3 text-xs text-[var(--muted)]">
            Illustrative public “CoWoS-class” band used to sanity-check defaults:{" "}
            <span className="text-[var(--foreground)]">
              {formatUsd(PACKAGING_DEFAULTS.bandLowUsd)} –{" "}
              {formatUsd(PACKAGING_DEFAULTS.bandHighUsd).replace(/^~/, "")}
            </span>{" "}
            per AI GPU package (wide trade-press range; estimate only).{" "}
            {PACKAGING_DEFAULTS.notes.costs}
          </div>
        </>
      }
    >
      <AssumptionField
        id="units"
        label="Units"
        value={values.units}
        onChange={(v) => set("units", v)}
        kind={kindOf("units", "user")}
        notes="Your batch or shipment size."
        min={1}
        step={100}
      />
      <AssumptionField
        id="substrateUsd"
        label="Substrate / interposer"
        unit="USD / unit"
        value={values.substrateUsd}
        onChange={(v) => set("substrateUsd", v)}
        kind={kindOf("substrateUsd")}
        notes={PACKAGING_DEFAULTS.notes.costs}
        min={0}
        step={10}
      />
      <AssumptionField
        id="assemblyUsd"
        label="Assembly / bonding"
        unit="USD / unit"
        value={values.assemblyUsd}
        onChange={(v) => set("assemblyUsd", v)}
        kind={kindOf("assemblyUsd")}
        min={0}
        step={10}
      />
      <AssumptionField
        id="testUsd"
        label="Test / finish"
        unit="USD / unit"
        value={values.testUsd}
        onChange={(v) => set("testUsd", v)}
        kind={kindOf("testUsd")}
        min={0}
        step={10}
      />
      <AssumptionField
        id="packageYield"
        label="Package yield"
        unit="fraction 0–1"
        value={values.packageYield}
        onChange={(v) => set("packageYield", v)}
        kind={kindOf("packageYield")}
        notes={PACKAGING_DEFAULTS.notes.packageYield}
        min={0.01}
        max={1}
        step={0.01}
      />
    </EstimateFrame>
  );
}
