"use client";

import { useMemo, useState } from "react";
import { EstimateFrame } from "./EstimateFrame";
import { AssumptionField } from "./AssumptionField";
import { EstimateResultCard } from "./EstimateResultCard";
import { KindBadge } from "./KindBadge";
import { useEditableNumbers } from "./useEstimatorState";
import { YIELD_DEFAULTS } from "@/data/estimators/catalog";
import { computeYield, yieldSensitivity, type YieldModel } from "@/lib/estimators/yieldModel";
import { formatEstimateNumber, formatPercent } from "@/lib/estimators/format";
import type { EstimateKind } from "@/lib/estimators/types";

export function YieldEstimator() {
  const defaults = useMemo(
    () => ({
      dieAreaCm2: YIELD_DEFAULTS.dieAreaCm2,
      defectDensityPerCm2: YIELD_DEFAULTS.defectDensityPerCm2,
      waferDiameterMm: YIELD_DEFAULTS.waferDiameterMm,
      edgeExclusionMm: YIELD_DEFAULTS.edgeExclusionMm,
    }),
    [],
  );
  const { values, set, reset, kindOf } = useEditableNumbers(defaults);
  const [model, setModel] = useState<YieldModel>(YIELD_DEFAULTS.model);
  const [modelTouched, setModelTouched] = useState(false);
  const modelKind: EstimateKind = modelTouched ? "user" : "estimate";

  const result = useMemo(
    () =>
      computeYield({
        ...values,
        model,
      }),
    [values, model],
  );

  const sensitivity = useMemo(
    () =>
      yieldSensitivity({ ...values, model }, [0.8, 1.0, 1.2]).map((row) => ({
        ...row,
        label:
          row.factor === 1
            ? "Baseline D0"
            : row.factor < 1
              ? "D0 −20%"
              : "D0 +20%",
      })),
    [values, model],
  );

  return (
    <EstimateFrame
      title="Yield estimator"
      description="Poisson or Murphy die-yield models plus a simplified dies-per-wafer geometry. Teaching tool — not a foundry yield report."
      methodologyHref="/estimators#yield"
      onReset={() => {
        reset();
        setModel(YIELD_DEFAULTS.model);
        setModelTouched(false);
      }}
      results={
        <>
          <EstimateResultCard
            label="Die yield"
            display={formatPercent(result.yieldFraction)}
            notes={`Using ${model === "poisson" ? "Poisson Y = e^(−A·D)" : "Murphy Y = (1 − e^(−A·D))/(A·D)"}.`}
          />
          <EstimateResultCard
            label="Dies per wafer (geometry)"
            display={formatEstimateNumber(result.diesPerWafer, { digits: 1 })}
            unit="dies"
            notes="Usable wafer area ÷ die area (edge exclusion applied). Ignores scribe/reticle packing."
          />
          <EstimateResultCard
            label="Good dies per wafer"
            display={formatEstimateNumber(result.goodDiesPerWafer, { digits: 1 })}
            unit="dies"
            notes="DPW × yield under current assumptions."
          />
          <div className="rounded-lg border border-white/10 p-3">
            <p className="text-xs font-medium text-[var(--foreground)]">Sensitivity (defect density)</p>
            <ul className="mt-2 space-y-1.5 text-xs text-[var(--muted)]">
              {sensitivity.map((row) => (
                <li key={row.factor} className="flex justify-between gap-3">
                  <span>{row.label}</span>
                  <span className="text-[var(--foreground)]">
                    {formatPercent(row.yieldFraction)} ·{" "}
                    {formatEstimateNumber(row.goodDiesPerWafer, { digits: 1 })} good dies
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      }
    >
      <div className="rounded-lg border border-white/10 bg-[var(--card)]/60 p-3">
        <p className="mb-2 flex flex-wrap items-center gap-2 text-sm font-medium">
          Yield model
          <KindBadge kind={modelKind} />
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Yield model">
          {(["poisson", "murphy"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={model === m}
              onClick={() => {
                setModel(m);
                setModelTouched(m !== YIELD_DEFAULTS.model);
              }}
              className={`rounded-md border px-3 py-1.5 text-xs capitalize ${
                model === m
                  ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--foreground)]"
                  : "border-white/15 text-[var(--muted)] hover:border-white/30"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          Poisson is the teaching default; Murphy is an alternate clustered-defect model.
        </p>
      </div>
      <AssumptionField
        id="dieAreaCm2"
        label="Die area"
        unit="cm²"
        value={values.dieAreaCm2}
        onChange={(v) => set("dieAreaCm2", v)}
        kind={kindOf("dieAreaCm2")}
        notes={YIELD_DEFAULTS.notes.dieAreaCm2}
        min={0.01}
        step={0.1}
      />
      <AssumptionField
        id="defectDensityPerCm2"
        label="Defect density (D0)"
        unit="defects/cm²"
        value={values.defectDensityPerCm2}
        onChange={(v) => set("defectDensityPerCm2", v)}
        kind={kindOf("defectDensityPerCm2")}
        notes={YIELD_DEFAULTS.notes.defectDensityPerCm2}
        min={0}
        step={0.01}
      />
      <AssumptionField
        id="waferDiameterMm"
        label="Wafer diameter"
        unit="mm"
        value={values.waferDiameterMm}
        onChange={(v) => set("waferDiameterMm", v)}
        kind={kindOf("waferDiameterMm")}
        notes={YIELD_DEFAULTS.notes.waferDiameterMm}
        min={100}
        step={1}
      />
      <AssumptionField
        id="edgeExclusionMm"
        label="Edge exclusion"
        unit="mm"
        value={values.edgeExclusionMm}
        onChange={(v) => set("edgeExclusionMm", v)}
        kind={kindOf("edgeExclusionMm")}
        notes={YIELD_DEFAULTS.notes.edgeExclusionMm}
        min={0}
        step={0.5}
      />
    </EstimateFrame>
  );
}
