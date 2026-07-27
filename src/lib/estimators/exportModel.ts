/**
 * Export-control teaching rules: toggles → stressed entities.
 * Qualitative severity, not a compliance engine.
 */

export type ExportRuleId =
  | "euv-block"
  | "duv-curtail"
  | "us-person-service"
  | "hbm-restrict"
  | "eda-restrict";

export type ExportRule = {
  id: ExportRuleId;
  label: string;
  description: string;
  defaultOn: boolean;
  kind: "estimate";
  sourceLabel: string;
  sourceUrl: string;
  /** Company node ids stressed when rule is on */
  stressedCompanyIds: string[];
  /** Human-readable effects for the results panel */
  effects: string[];
  severity: 1 | 2 | 3;
};

export type ExportSimulationResult = {
  activeRuleIds: ExportRuleId[];
  stressedCompanyIds: string[];
  effects: string[];
  severityScore: number;
  severityLabel: "low" | "moderate" | "high";
};

export function simulateExportControls(
  rules: ExportRule[],
  activeIds: Set<string>,
): ExportSimulationResult {
  const active = rules.filter((r) => activeIds.has(r.id));
  const stressed = new Set<string>();
  const effects: string[] = [];
  let severitySum = 0;

  for (const rule of active) {
    for (const id of rule.stressedCompanyIds) stressed.add(id);
    effects.push(...rule.effects.map((e) => `${rule.label}: ${e}`));
    severitySum += rule.severity;
  }

  const maxPossible = rules.reduce((s, r) => s + r.severity, 0) || 1;
  const normalized = severitySum / maxPossible;
  const severityLabel =
    normalized < 0.34 ? "low" : normalized < 0.67 ? "moderate" : "high";

  return {
    activeRuleIds: active.map((r) => r.id),
    stressedCompanyIds: [...stressed],
    effects,
    severityScore: severitySum,
    severityLabel,
  };
}
