export type EstimateKind = "cited" | "estimate" | "user";

export type Confidence = "low" | "medium" | "high";

export type EstimateParamMeta = {
  id: string;
  label: string;
  unit?: string;
  kind: EstimateKind;
  confidence?: Confidence;
  notes?: string;
  sourceLabel?: string;
  sourceUrl?: string;
};

export type NumericParam = EstimateParamMeta & {
  value: number;
  min?: number;
  max?: number;
  step?: number;
};

export type EstimateOutput = {
  id: string;
  label: string;
  /** Display string already formatted with ~ / ranges when appropriate */
  display: string;
  unit?: string;
  kind: EstimateKind;
  notes?: string;
};

export type EstimatorId =
  | "yield"
  | "export-controls"
  | "fab-capacity"
  | "packaging-cost"
  | "ai-cluster-demand";

export type EstimatorDef = {
  id: EstimatorId;
  title: string;
  short: string;
  accent: string;
  /** Short how-to steps shown on the tool page (clean numbered list). */
  howTo: string[];
};
