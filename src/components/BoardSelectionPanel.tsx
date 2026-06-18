"use client";

import type { GraphEdge, GraphNode, SourceRecord, TradeFlowRecord } from "@/data/graph";
import { COMPANY_RECORDS } from "@/lib/companyRecords";
import { SEGMENT_LABEL, isCompanySegment } from "@/lib/segments";

export function BoardSelectionPanel({
  selectedNode,
  selectedEdge,
  selectedTradeFlow,
  graphNodes,
  graphEdges,
  sourceLookup,
  onClear,
}: {
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  selectedTradeFlow?: TradeFlowRecord | null;
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  sourceLookup: Map<string, SourceRecord>;
  onClear: () => void;
}) {
  if (!selectedNode && !selectedEdge && !selectedTradeFlow) {
    return (
      <div className="rounded-xl border border-white/10 bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
        Click a map pin or a supply link (or an edge in the list below) to inspect registry
        fields and citations.
      </div>
    );
  }

  const byId = new Map(graphNodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-[var(--card)] px-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Selection
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Clear
        </button>
      </div>

      {selectedNode ? <NodeCard node={selectedNode} edges={graphEdges} byId={byId} /> : null}
      {selectedEdge ? (
        <EdgeCard edge={selectedEdge} byId={byId} sourceLookup={sourceLookup} />
      ) : null}
      {selectedTradeFlow ? (
        <TradeFlowCard flow={selectedTradeFlow} sourceLookup={sourceLookup} />
      ) : null}
    </div>
  );
}

function TradeFlowCard({
  flow,
  sourceLookup,
}: {
  flow: TradeFlowRecord;
  sourceLookup: Map<string, SourceRecord>;
}) {
  return (
    <div className="space-y-2 border-t border-white/10 pt-3">
      <p className="font-medium text-[var(--foreground)]">
        {flow.exporter_country_id.replace("country-", "").toUpperCase()} →{" "}
        {flow.importer_country_id.replace("country-", "").toUpperCase()}
      </p>
      <p className="text-xs text-[var(--muted)]">trade flow · {flow.hs_label}</p>
      {flow.notes ? <p className="text-xs text-[var(--foreground)]/90">{flow.notes}</p> : null}
      <ul className="space-y-1 text-xs">
        {(flow.source_ids ?? []).map((sid) => {
          const src = sourceLookup.get(sid);
          return (
            <li key={sid}>
              {src ? (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  {src.title}
                </a>
              ) : (
                <code>{sid}</code>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NodeCard({
  node,
  edges,
  byId,
}: {
  node: GraphNode;
  edges: GraphEdge[];
  byId: Map<string, GraphNode>;
}) {
  const registry = COMPANY_RECORDS.find((c) => c.id === node.id);
  const related = edges.filter((e) => e.source === node.id || e.target === node.id).slice(0, 8);
  const rawSegment = registry?.segment;
  const segment = isCompanySegment(rawSegment) ? rawSegment : undefined;

  return (
    <div className="space-y-2 border-t border-white/10 pt-3">
      <p className="font-medium text-[var(--foreground)]">{node.label}</p>
      <p className="text-xs capitalize text-[var(--muted)]">
        {segment ? SEGMENT_LABEL[segment] : node.kind.replace(/_/g, " ")}
        {registry?.founded ? ` · founded ${registry.founded}` : ""}
      </p>
      {registry ? (
        <>
          {registry.description ? (
            <p className="text-xs leading-relaxed text-[var(--foreground)]/90">
              {registry.description}
            </p>
          ) : null}
          <dl className="space-y-1 text-xs text-[var(--foreground)]/90">
            <div>
              <dt className="text-[var(--muted)]">Specialization</dt>
              <dd>{registry.specialization}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Headquarters</dt>
              <dd>{registry.hq_city ?? registry.hq_country}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Operating countries</dt>
              <dd>{registry.operating_countries.join(", ")}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="text-xs text-[var(--muted)]">
          {node.meta?.specialization ?? node.meta?.notes ?? "No registry row (fab / country / ops pin)."}
        </p>
      )}
      {registry?.source_url ? (
        <a
          href={registry.source_url}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {registry.source_label}
        </a>
      ) : null}
      {related.length > 0 ? (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Connected edges (sample)
          </p>
          <ul className="mt-1 space-y-0.5 text-[11px] text-[var(--foreground)]/85">
            {related.map((e) => (
              <li key={e.id}>
                <span className="text-[var(--muted)]">{e.kind}</span> ·{" "}
                {byId.get(e.source)?.label ?? e.source} → {byId.get(e.target)?.label ?? e.target}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function EdgeCard({
  edge,
  byId,
  sourceLookup,
}: {
  edge: GraphEdge;
  byId: Map<string, GraphNode>;
  sourceLookup: Map<string, SourceRecord>;
}) {
  const facts = edge.facts ? Object.entries(edge.facts) : [];

  return (
    <div className="space-y-2 border-t border-white/10 pt-3">
      <p className="font-medium text-[var(--foreground)]">
        {byId.get(edge.source)?.label ?? edge.source} → {byId.get(edge.target)?.label ?? edge.target}
      </p>
      <p className="text-xs text-[var(--muted)]">{edge.kind}</p>
      {facts.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">No cited facts on this edge yet.</p>
      ) : (
        facts.map(([key, fact]) => (
          <div key={key} className="rounded-md border border-white/5 bg-black/20 px-2 py-2 text-xs">
            {fact.notes ? <p className="text-[var(--foreground)]/90">{fact.notes}</p> : null}
            {fact.source_label ? (
              <p className="mt-1 text-[var(--muted)]">{fact.source_label}</p>
            ) : null}
            <ul className="mt-2 space-y-1">
              {(fact.source_ids ?? []).map((sid) => {
                const src = sourceLookup.get(sid);
                return (
                  <li key={sid}>
                    {src ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent)] underline-offset-4 hover:underline"
                      >
                        {src.title}
                      </a>
                    ) : (
                      <code>{sid}</code>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
