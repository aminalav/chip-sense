export function BoardDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-xs leading-relaxed text-[var(--muted)] ${className}`.trim()}
    >
      Relationship arcs cite company filings where noted — click an arc or pin for
      sources. Scenario multipliers are{" "}
      <span className="text-[var(--foreground)]/80">illustrative stress tests</span>, not
      forecasts; verify numbers before publishing.
    </p>
  );
}

export function ScenarioBanner({ scenarioLabel }: { scenarioLabel: string }) {
  return (
    <div
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100/90"
      role="status"
    >
      <span className="font-medium">{scenarioLabel}</span> — illustrative only, not a
      forecast. See <span className="font-medium">Scenario impact</span> in the sidebar for
      assumptions.
    </div>
  );
}
