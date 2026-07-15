"use client";

import type { GraphEdge, GraphNode, SourceRecord, TradeFlowRecord, TrackSlug } from "@/data/graph";
import { SelectionEmptyState } from "@/components/SelectionEmptyState";
import { COMPANY_RECORDS } from "@/lib/companyRecords";
import {
  countryRecordForNode,
  fabSiteForNode,
  operatorForFab,
  parentCompanyIdForPresence,
  sourceLinks,
} from "@/lib/nodeProfile";
import { dedupeRelatedEdges, edgeKindLabel } from "@/lib/edgeLabels";
import { SEGMENT_LABEL, isCompanySegment } from "@/lib/segments";

export function BoardSelectionPanel({
  selectedNode,
  selectedEdge,
  selectedTradeFlow,
  graphNodes,
  graphEdges,
  sourceLookup,
  hiddenFromMap = false,
  trackLens = null,
  onClear,
  onRunScenario,
  onSelectNode,
}: {
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  selectedTradeFlow?: TradeFlowRecord | null;
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  sourceLookup: Map<string, SourceRecord>;
  hiddenFromMap?: boolean;
  trackLens?: TrackSlug | null;
  onClear: () => void;
  onRunScenario?: (scenarioId: string) => void;
  onSelectNode?: (nodeId: string) => void;
}) {
  if (!selectedNode && !selectedEdge && !selectedTradeFlow) {
    return (
      <SelectionEmptyState
        trackLens={trackLens}
        onRunScenario={onRunScenario}
        onSelectNode={onSelectNode}
      />
    );
  }

  const byId = new Map(graphNodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-medium text-[var(--foreground)]/90">Details</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Clear
        </button>
      </div>

      {hiddenFromMap && selectedNode ? (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
          This pin is hidden by the current map filters (track lens, core supply chain view, or ops
          pins). Widen the view to see it on the map.
        </p>
      ) : null}
      {selectedNode ? (
        <NodeCard
          node={selectedNode}
          edges={graphEdges}
          byId={byId}
          sourceLookup={sourceLookup}
        />
      ) : null}
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
  sourceLookup,
}: {
  node: GraphNode;
  edges: GraphEdge[];
  byId: Map<string, GraphNode>;
  sourceLookup: Map<string, SourceRecord>;
}) {
  const registry = COMPANY_RECORDS.find((c) => c.id === node.id);
  const related = dedupeRelatedEdges(
    edges.filter((e) => e.source === node.id || e.target === node.id),
  ).slice(0, 8);
  const rawSegment = registry?.segment ?? node.meta?.segment;
  const segment = isCompanySegment(rawSegment) ? rawSegment : undefined;

  if (registry) {
    return (
      <div className="space-y-2 border-t border-white/10 pt-3">
        <NodeHeader node={node} segment={segment} founded={registry.founded} />
        {registry.description ? (
          <p className="text-xs leading-relaxed text-[var(--foreground)]/90">{registry.description}</p>
        ) : null}
        <RegistryDetails registry={registry} />
        <SourceLink label={registry.source_label} url={registry.source_url} />
        <RelatedEdges related={related} byId={byId} />
      </div>
    );
  }

  if (node.kind === "fab") {
    const site = fabSiteForNode(node);
    const operator = operatorForFab(node);
    const sources = sourceLinks(site?.source_ids, sourceLookup);
    return (
      <div className="space-y-2 border-t border-white/10 pt-3">
        <NodeHeader node={node} segment={segment} subtitle="Fab / site pin" />
        {node.meta?.description ? (
          <p className="text-xs leading-relaxed text-[var(--foreground)]/90">{node.meta.description}</p>
        ) : null}
        <dl className="space-y-1 text-xs text-[var(--foreground)]/90">
          {site ? (
            <>
              <div>
                <dt className="text-[var(--muted)]">Location</dt>
                <dd>
                  {site.city}, {site.country}
                </dd>
              </div>
              {operator ? (
                <div>
                  <dt className="text-[var(--muted)]">Operator</dt>
                  <dd>{operator.name}</dd>
                </div>
              ) : null}
            </>
          ) : null}
          {operator?.specialization ? (
            <div>
              <dt className="text-[var(--muted)]">Operator role</dt>
              <dd>{operator.specialization}</dd>
            </div>
          ) : null}
        </dl>
        {sources.length > 0 ? (
          <SourceList sources={sources} heading="Site sources" />
        ) : null}
        {operator?.source_url ? (
          <SourceLink label={operator.source_label} url={operator.source_url} />
        ) : null}
        <RelatedEdges related={related} byId={byId} />
      </div>
    );
  }

  if (node.kind === "country") {
    const country = countryRecordForNode(node);
    return (
      <div className="space-y-2 border-t border-white/10 pt-3">
        <NodeHeader node={node} subtitle="Country" />
        {country?.description ?? node.meta?.description ? (
          <p className="text-xs leading-relaxed text-[var(--foreground)]/90">
            {country?.description ?? node.meta?.description}
          </p>
        ) : (
          <p className="text-xs text-[var(--muted)]">
            Country centroid on the map. Toggle trade flows to see bilateral chip and equipment arcs.
          </p>
        )}
        <RelatedEdges related={related} byId={byId} />
      </div>
    );
  }

  if (node.kind === "presence") {
    const parentId = parentCompanyIdForPresence(node.id);
    const parent = parentId ? COMPANY_RECORDS.find((c) => c.id === parentId) : undefined;
    return (
      <div className="space-y-2 border-t border-white/10 pt-3">
        <NodeHeader node={node} segment={segment} subtitle="Operating presence" />
        {node.meta?.notes ? (
          <p className="text-xs leading-relaxed text-[var(--foreground)]/90">{node.meta.notes}</p>
        ) : null}
        {parent?.description ? (
          <p className="text-xs leading-relaxed text-[var(--foreground)]/90">{parent.description}</p>
        ) : null}
        {parent ? (
          <dl className="space-y-1 text-xs text-[var(--foreground)]/90">
            <div>
              <dt className="text-[var(--muted)]">Parent company</dt>
              <dd>{parent.name}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Headquarters</dt>
              <dd>{parent.hq_city ?? parent.hq_country}</dd>
            </div>
          </dl>
        ) : null}
        {node.meta?.source_url ? (
          <SourceLink
            label={node.meta.source_label ?? "Company filing"}
            url={node.meta.source_url}
          />
        ) : parent?.source_url ? (
          <SourceLink label={parent.source_label} url={parent.source_url} />
        ) : null}
        <RelatedEdges related={related} byId={byId} />
      </div>
    );
  }

  return (
    <div className="space-y-2 border-t border-white/10 pt-3">
      <NodeHeader node={node} segment={segment} />
      <p className="text-xs text-[var(--foreground)]/90">
        {node.meta?.description ?? node.meta?.specialization ?? node.meta?.notes ?? "No profile yet."}
      </p>
      <RelatedEdges related={related} byId={byId} />
    </div>
  );
}

function NodeHeader({
  node,
  segment,
  founded,
  subtitle,
}: {
  node: GraphNode;
  segment?: string;
  founded?: string;
  subtitle?: string;
}) {
  return (
    <>
      <p className="font-medium text-[var(--foreground)]">{node.label}</p>
      <p className="text-xs capitalize text-[var(--muted)]">
        {subtitle ??
          (segment ? SEGMENT_LABEL[segment as keyof typeof SEGMENT_LABEL] : node.kind.replace(/_/g, " "))}
        {founded ? ` · founded ${founded}` : ""}
      </p>
    </>
  );
}

function RegistryDetails({ registry }: { registry: (typeof COMPANY_RECORDS)[number] }) {
  return (
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
  );
}

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-block text-xs font-medium text-[var(--accent)] underline-offset-4 hover:underline"
    >
      {label}
    </a>
  );
}

function SourceList({
  sources,
  heading,
}: {
  sources: { id: string; title: string; url: string }[];
  heading: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">{heading}</p>
      <ul className="mt-1 space-y-1 text-xs">
        {sources.map((src) => (
          <li key={src.id}>
            <a
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {src.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedEdges({
  related,
  byId,
}: {
  related: GraphEdge[];
  byId: Map<string, GraphNode>;
}) {
  if (related.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
        Connected edges (sample)
      </p>
      <ul className="mt-1 space-y-0.5 text-[11px] text-[var(--foreground)]/85">
        {related.map((e) => (
          <li key={e.id}>
            <span className="text-[var(--muted)]">{edgeKindLabel(e.kind)}</span> ·{" "}
            {byId.get(e.source)?.label ?? e.source} → {byId.get(e.target)?.label ?? e.target}
          </li>
        ))}
      </ul>
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
      <p className="text-xs text-[var(--muted)]">{edgeKindLabel(edge.kind)}</p>
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
