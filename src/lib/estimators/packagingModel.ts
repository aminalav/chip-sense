/**
 * Coarse packaging cost build-up for teaching.
 * total ≈ N × (substrate + assembly + test) / packageYield
 */

export type PackagingInputs = {
  units: number;
  substrateUsd: number;
  assemblyUsd: number;
  testUsd: number;
  packageYield: number;
};

export type PackagingResult = {
  unitCostUsd: number;
  unitCostWithYieldUsd: number;
  totalUsd: number;
  yieldLossUsd: number;
};

export function computePackagingCost(inputs: PackagingInputs): PackagingResult {
  const base = Math.max(0, inputs.substrateUsd + inputs.assemblyUsd + inputs.testUsd);
  const y = Math.min(1, Math.max(0.01, inputs.packageYield));
  const withYield = base / y;
  const units = Math.max(0, inputs.units);
  const total = units * withYield;
  return {
    unitCostUsd: base,
    unitCostWithYieldUsd: withYield,
    totalUsd: total,
    yieldLossUsd: units * (withYield - base),
  };
}
