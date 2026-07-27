"use client";

import { useMemo } from "react";
import Link from "next/link";
import { EstimateFrame } from "./EstimateFrame";
import { AssumptionField } from "./AssumptionField";
import { EstimateResultCard } from "./EstimateResultCard";
import { useEditableNumbers } from "./useEstimatorState";
import { CLUSTER_DEFAULTS, CAPACITY_DEFAULTS, getEstimator } from "@/data/estimators/catalog";
import { computeClusterDemand } from "@/lib/estimators/clusterModel";
import { formatEstimateNumber } from "@/lib/estimators/format";

export function AiClusterDemandModel() {
  const defaults = useMemo(
    () => ({
      clusters: CLUSTER_DEFAULTS.clusters,
      gpusPerCluster: CLUSTER_DEFAULTS.gpusPerCluster,
      hbmStacksPerGpu: CLUSTER_DEFAULTS.hbmStacksPerGpu,
      hbmGbPerStack: CLUSTER_DEFAULTS.hbmGbPerStack,
      packageYield: CLUSTER_DEFAULTS.packageYield,
      diesPerWafer: CLUSTER_DEFAULTS.diesPerWafer,
      dieYield: CLUSTER_DEFAULTS.dieYield,
    }),
    [],
  );
  const { values, set, reset, kindOf } = useEditableNumbers(defaults);
  const result = useMemo(() => computeClusterDemand(values), [values]);

  return (
    <EstimateFrame
      title="AI cluster demand model"
      description="Bill-of-materials chain for teaching: clusters → GPUs → HBM → packaging slots → implied logic wafers. Directional demand under your assumptions — not a hyperscaler forecast."
      howToSteps={getEstimator("ai-cluster-demand")!.howTo}
      methodologyHref="/estimators#ai-cluster-demand"
      onReset={reset}
      results={
        <>
          <EstimateResultCard
            label="GPUs required"
            display={formatEstimateNumber(result.gpus, { digits: 0 })}
            unit="GPUs"
            notes="Clusters × GPUs per cluster."
          />
          <EstimateResultCard
            label="HBM stacks"
            display={formatEstimateNumber(result.hbmStacks, { digits: 0 })}
            unit="stacks"
            notes="GPUs × stacks per GPU."
          />
          <EstimateResultCard
            label="HBM capacity"
            display={formatEstimateNumber(result.hbmTb, { digits: 2 })}
            unit="TB"
            notes="Stacks × GB/stack ÷ 1024."
          />
          <EstimateResultCard
            label="Packages needed (w/ pkg yield)"
            display={formatEstimateNumber(result.packagesNeeded, { digits: 1 })}
            unit="packages"
            notes="GPUs ÷ package yield (scrap/rework teaching factor)."
          />
          <EstimateResultCard
            label="Implied logic wafers"
            display={formatEstimateNumber(result.impliedLogicWafers, { digits: 1 })}
            unit="wafers"
            notes="GPUs ÷ (DPW × die yield). Ignores multi-die packages and HBM wafer demand."
          />
          <p className="text-[11px] text-[var(--muted)]">
            Pair with{" "}
            <Link href="/tools/yield" className="text-[var(--accent)] underline-offset-2 hover:underline">
              Yield
            </Link>{" "}
            and{" "}
            <Link
              href="/tools/packaging-cost"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Packaging cost
            </Link>{" "}
            for essay screenshots.
          </p>
        </>
      }
    >
      <AssumptionField
        id="clusters"
        label="Clusters"
        value={values.clusters}
        onChange={(v) => set("clusters", v)}
        kind={kindOf("clusters")}
        notes="Teaching default of 1 cluster — set to your what-if deployment size."
        min={0}
        step={1}
      />
      <AssumptionField
        id="gpusPerCluster"
        label="GPUs per cluster"
        value={values.gpusPerCluster}
        onChange={(v) => set("gpusPerCluster", v)}
        kind={kindOf("gpusPerCluster")}
        notes={CLUSTER_DEFAULTS.notes.gpusPerCluster}
        min={1}
        step={1}
      />
      <AssumptionField
        id="hbmStacksPerGpu"
        label="HBM stacks per GPU"
        value={values.hbmStacksPerGpu}
        onChange={(v) => set("hbmStacksPerGpu", v)}
        kind={kindOf("hbmStacksPerGpu")}
        notes={CLUSTER_DEFAULTS.notes.hbmStacksPerGpu}
        min={0}
        step={1}
      />
      <AssumptionField
        id="hbmGbPerStack"
        label="HBM capacity per stack"
        unit="GB"
        value={values.hbmGbPerStack}
        onChange={(v) => set("hbmGbPerStack", v)}
        kind={kindOf("hbmGbPerStack")}
        notes={CLUSTER_DEFAULTS.notes.hbmGbPerStack}
        min={0}
        step={1}
      />
      <AssumptionField
        id="packageYield"
        label="Package yield"
        unit="fraction 0–1"
        value={values.packageYield}
        onChange={(v) => set("packageYield", v)}
        kind={kindOf("packageYield")}
        notes="Teaching advanced-packaging yield default (same seed as packaging cost tool)."
        min={0.01}
        max={1}
        step={0.01}
      />
      <AssumptionField
        id="diesPerWafer"
        label="Logic dies per wafer"
        value={values.diesPerWafer}
        onChange={(v) => set("diesPerWafer", v)}
        kind={kindOf("diesPerWafer")}
        notes={CAPACITY_DEFAULTS.notes.diesPerWafer}
        min={1}
        step={1}
      />
      <AssumptionField
        id="dieYield"
        label="Logic die yield"
        unit="fraction 0–1"
        value={values.dieYield}
        onChange={(v) => set("dieYield", v)}
        kind={kindOf("dieYield")}
        notes={CAPACITY_DEFAULTS.notes.yieldFraction}
        min={0.01}
        max={1}
        step={0.01}
      />
    </EstimateFrame>
  );
}
