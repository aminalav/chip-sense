/**
 * AI cluster demand chain (BOM arithmetic).
 * GPUs → HBM stacks → packaging slots → implied logic wafers
 */

export type ClusterInputs = {
  clusters: number;
  gpusPerCluster: number;
  hbmStacksPerGpu: number;
  hbmGbPerStack: number;
  packageYield: number;
  diesPerWafer: number;
  dieYield: number;
};

export type ClusterResult = {
  gpus: number;
  hbmStacks: number;
  hbmTb: number;
  packagesNeeded: number;
  impliedLogicWafers: number;
};

export function computeClusterDemand(inputs: ClusterInputs): ClusterResult {
  const gpus = Math.max(0, inputs.clusters) * Math.max(0, inputs.gpusPerCluster);
  const stacks = gpus * Math.max(0, inputs.hbmStacksPerGpu);
  const gb = stacks * Math.max(0, inputs.hbmGbPerStack);
  const pkgY = Math.min(1, Math.max(0.01, inputs.packageYield));
  const packagesNeeded = gpus / pkgY;
  const dpw = Math.max(0.01, inputs.diesPerWafer);
  const dieY = Math.min(1, Math.max(0.01, inputs.dieYield));
  const impliedLogicWafers = gpus / (dpw * dieY);

  return {
    gpus,
    hbmStacks: stacks,
    hbmTb: gb / 1024,
    packagesNeeded,
    impliedLogicWafers,
  };
}
