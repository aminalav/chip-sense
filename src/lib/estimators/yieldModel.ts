/**
 * Teaching die-yield models (Poisson / Murphy) and wafer geometry.
 * See ESTIMATORS.md for methodology and default provenance.
 */

export type YieldModel = "poisson" | "murphy";

export type YieldInputs = {
  dieAreaCm2: number;
  defectDensityPerCm2: number;
  waferDiameterMm: number;
  edgeExclusionMm: number;
  model: YieldModel;
};

export type YieldResult = {
  yieldFraction: number;
  diesPerWafer: number;
  goodDiesPerWafer: number;
};

/** Effective radius after edge exclusion (mm → cm). */
function effectiveRadiusCm(waferDiameterMm: number, edgeExclusionMm: number): number {
  const rMm = waferDiameterMm / 2 - edgeExclusionMm;
  return Math.max(rMm, 0) / 10;
}

/**
 * Simplified dies-per-wafer: usable area / die area.
 * Teaching approximation — real DPW uses scribe, reticle, and packing efficiency.
 */
export function diesPerWafer(
  dieAreaCm2: number,
  waferDiameterMm: number,
  edgeExclusionMm: number,
): number {
  if (dieAreaCm2 <= 0) return 0;
  const r = effectiveRadiusCm(waferDiameterMm, edgeExclusionMm);
  const usable = Math.PI * r * r;
  return Math.max(0, usable / dieAreaCm2);
}

/** Poisson: Y = e^(-A·D) */
export function poissonYield(dieAreaCm2: number, defectDensityPerCm2: number): number {
  if (dieAreaCm2 < 0 || defectDensityPerCm2 < 0) return 0;
  return Math.exp(-dieAreaCm2 * defectDensityPerCm2);
}

/** Murphy: Y = (1 − e^(-A·D)) / (A·D) */
export function murphyYield(dieAreaCm2: number, defectDensityPerCm2: number): number {
  if (dieAreaCm2 < 0 || defectDensityPerCm2 < 0) return 0;
  const ad = dieAreaCm2 * defectDensityPerCm2;
  if (ad < 1e-12) return 1;
  return (1 - Math.exp(-ad)) / ad;
}

export function computeYield(inputs: YieldInputs): YieldResult {
  const y =
    inputs.model === "murphy"
      ? murphyYield(inputs.dieAreaCm2, inputs.defectDensityPerCm2)
      : poissonYield(inputs.dieAreaCm2, inputs.defectDensityPerCm2);
  const dpw = diesPerWafer(
    inputs.dieAreaCm2,
    inputs.waferDiameterMm,
    inputs.edgeExclusionMm,
  );
  return {
    yieldFraction: y,
    diesPerWafer: dpw,
    goodDiesPerWafer: dpw * y,
  };
}

/** Sensitivity: yield if defect density shifts by relative factor (e.g. 0.8 / 1.2). */
export function yieldSensitivity(
  inputs: YieldInputs,
  densityFactors: number[],
): { factor: number; yieldFraction: number; goodDiesPerWafer: number }[] {
  return densityFactors.map((factor) => {
    const r = computeYield({
      ...inputs,
      defectDensityPerCm2: inputs.defectDensityPerCm2 * factor,
    });
    return {
      factor,
      yieldFraction: r.yieldFraction,
      goodDiesPerWafer: r.goodDiesPerWafer,
    };
  });
}
