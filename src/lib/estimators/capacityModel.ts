/**
 * Fab capacity accounting (not MES reality).
 * goodDies/month ≈ WSPM × DPW × Y × U
 */

export type CapacityInputs = {
  waferStartsPerMonth: number;
  diesPerWafer: number;
  yieldFraction: number;
  utilization: number;
};

export type CapacityResult = {
  effectiveWaferStarts: number;
  goodDiesPerMonth: number;
  goodDiesPerYear: number;
};

export function computeCapacity(inputs: CapacityInputs): CapacityResult {
  const u = clamp01(inputs.utilization);
  const y = clamp01(inputs.yieldFraction);
  const wspm = Math.max(0, inputs.waferStartsPerMonth);
  const dpw = Math.max(0, inputs.diesPerWafer);
  const effective = wspm * u;
  const goodMonth = effective * dpw * y;
  return {
    effectiveWaferStarts: effective,
    goodDiesPerMonth: goodMonth,
    goodDiesPerYear: goodMonth * 12,
  };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
