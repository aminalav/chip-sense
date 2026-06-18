"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { MapRef } from "react-map-gl/maplibre";
import { BoardSelectionPanel } from "@/components/BoardSelectionPanel";
import { EditorialTracksBar } from "@/components/EditorialTracksBar";
import { ExportMapButton } from "@/components/ExportMapButton";
import { ScenarioImpactPanel } from "@/components/ScenarioImpactPanel";
import { SourcesLinkedStrip } from "@/components/SourcesLinkedStrip";
import { TradeFlowsPanel } from "@/components/TradeFlowsPanel";
import type { GraphEdge, GraphNode, Scenario, SourceRecord, TrackSlug } from "@/data/graph";
import { TRACKS, type TrackDefinition } from "@/data/tracks";
import { useBoardUrlState } from "@/hooks/useBoardUrlState";
import { boardPath } from "@/lib/boardUrlState";
import { buildMapView } from "@/lib/mapView";
import { computeScenarioEffects } from "@/lib/scenarioEffects";
import { sourceIdsFromEdges } from "@/lib/sourceQueries";
import { loadTradeFlows, tradeFlowsForTrack, tradeFlowsToGeoJSON } from "@/lib/tradeFlows";

const SupplyMap = dynamic(
  () => import("./SupplyMap").then((m) => m.SupplyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[2/1] max-h-[min(50vh,480px)] w-full items-center justify-center rounded-xl border border-white/10 bg-[var(--card)] text-sm text-[var(--muted)]">
        Loading map…
      </div>
    ),
  },
);

export function ResearchBoardSection({
  graphNodes,
  graphEdges,
  scenarios,
  accentHex,
  trackLens = null,
  showTrackLens = false,
  showEditorialTracks = false,
  researchPointers,
  boardNote,
  sourceCatalogCount,
  sourceRecords,
}: {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  scenarios: Scenario[];
  accentHex: string;
  trackLens?: TrackSlug | null;
  showTrackLens?: boolean;
  showEditorialTracks?: boolean;
  researchPointers?: string[];
  boardNote?: string;
  sourceCatalogCount: number;
  sourceRecords: SourceRecord[];
}) {
  const mapRef = useRef<MapRef>(null);
  const { state, update } = useBoardUrlState(scenarios, {
    trackLens,
    defaultIncludePresence: Boolean(trackLens),
  });

  const tradeFlows = useMemo(() => {
    const all = loadTradeFlows();
    return tradeFlowsForTrack(all, trackLens ?? undefined);
  }, [trackLens]);

  const tradeLinesGeo = useMemo(
    () => tradeFlowsToGeoJSON(tradeFlows, graphNodes),
    [tradeFlows, graphNodes],
  );

  const { nodes: mapNodes, edges } = useMemo(
    () =>
      buildMapView(
        { nodes: graphNodes, edges: graphEdges },
        {
          track: trackLens ?? undefined,
          includePresence: state.includePresence,
          registryOnly: true,
          essay1Only: state.essay1Only,
        },
      ),
    [graphNodes, graphEdges, trackLens, state.includePresence, state.essay1Only],
  );

  const activeScenario = scenarios.find((s) => s.id === state.scenarioId);
  const effects = useMemo(
    () => computeScenarioEffects(activeScenario, mapNodes, edges),
    [activeScenario, mapNodes, edges],
  );

  const sourceLookup = useMemo(
    () => new Map(sourceRecords.map((s) => [s.id, s])),
    [sourceRecords],
  );

  const trackSources = useMemo(() => {
    return sourceIdsFromEdges(edges)
      .map((id) => sourceLookup.get(id))
      .filter((s): s is SourceRecord => Boolean(s));
  }, [edges, sourceLookup]);

  const nodeById = useMemo(() => new Map(graphNodes.map((n) => [n.id, n])), [graphNodes]);
  const edgeById = useMemo(() => new Map(graphEdges.map((e) => [e.id, e])), [graphEdges]);

  const selectedNode = state.selectedNodeId
    ? (mapNodes.find((n) => n.id === state.selectedNodeId) ??
      nodeById.get(state.selectedNodeId) ??
      null)
    : null;
  const selectedEdge = state.selectedEdgeId ? (edgeById.get(state.selectedEdgeId) ?? null) : null;
  const selectedTradeFlow = state.selectedEdgeId
    ? (tradeFlows.find((f) => f.id === state.selectedEdgeId) ?? null)
    : null;

  const edgeLabelsById = useMemo(() => {
    return edges.map((e) => ({
      id: e.id,
      kind: e.kind,
      label: `${nodeById.get(e.source)?.label ?? e.source} → ${nodeById.get(e.target)?.label ?? e.target}`,
    }));
  }, [edges, nodeById]);

  const scopeLabel = trackLens
    ? (TRACKS.find((t) => t.slug === trackLens)?.title ?? trackLens)
    : "Global";

  const selectNode = (id: string) => {
    update({ selectedNodeId: id, selectedEdgeId: null });
  };

  const selectEdge = (id: string) => {
    update({ selectedEdgeId: id, selectedNodeId: null });
  };

  const clearSelection = () => {
    update({ selectedNodeId: null, selectedEdgeId: null });
  };

  return (
    <section className="flex flex-col gap-6">
      {showEditorialTracks ? <EditorialTracksBar /> : null}
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="isolate space-y-3 lg:col-span-3">
        {showTrackLens ? <TrackLensBar active={trackLens} boardPathname="/" boardState={state} /> : null}
        {boardNote ? <p className="text-sm text-[var(--muted)]">{boardNote}</p> : null}
        {trackLens ? (
          <p className="text-xs text-[var(--muted)]">
            <Link
              href={boardPath("/", state, { track: trackLens })}
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Same filters on global board
            </Link>
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={state.includePresence}
              onChange={(e) => update({ includePresence: e.target.checked })}
              className="rounded border-white/20"
            />
            Show ops pins (country-level presence without a fab site)
          </label>
          <ExportMapButton mapRef={mapRef} />
        </div>
        <SupplyMap
          ref={mapRef}
          nodes={mapNodes}
          edges={edges}
          scenarios={scenarios}
          accentHex={accentHex}
          scenarioId={state.scenarioId}
          onScenarioIdChange={(id) => update({ scenarioId: id })}
          effects={effects}
          essay1Only={state.essay1Only}
          onEssay1OnlyChange={(v) => update({ essay1Only: v })}
          showSupplyLines={state.showSupplyLines}
          onShowSupplyLinesChange={(v) => update({ showSupplyLines: v })}
          showEquips={state.showEquips}
          onShowEquipsChange={(v) => update({ showEquips: v })}
          showPackaging={state.showPackaging}
          onShowPackagingChange={(v) => update({ showPackaging: v })}
          showMemory={state.showMemory}
          onShowMemoryChange={(v) => update({ showMemory: v })}
          showAssembly={state.showAssembly}
          onShowAssemblyChange={(v) => update({ showAssembly: v })}
          showTradeFlows={state.showTradeFlows}
          onShowTradeFlowsChange={(v) => update({ showTradeFlows: v })}
          tradeLines={tradeLinesGeo}
          selectedNodeId={state.selectedNodeId}
          onSelectNode={selectNode}
          onSelectEdge={selectEdge}
        />
        </div>
        <aside className="space-y-5 lg:col-span-2">
        <BoardSelectionPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          selectedTradeFlow={selectedTradeFlow}
          graphNodes={graphNodes}
          graphEdges={graphEdges}
          sourceLookup={sourceLookup}
          onClear={clearSelection}
        />
        <ScenarioImpactPanel scenario={activeScenario} effects={effects} />
        <TradeFlowsPanel flows={tradeFlows} sourceLookup={sourceLookup} />
        {researchPointers && researchPointers.length > 0 ? (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Research pointers
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--foreground)]/90">
              {researchPointers.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            Graph edges ({scopeLabel})
          </h2>
          <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-xs text-[var(--muted)]">
            {edgeLabelsById.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => selectEdge(e.id)}
                  className={`w-full rounded-md border px-2 py-1.5 text-left font-mono text-[11px] transition ${
                    state.selectedEdgeId === e.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                      : "border-white/5 bg-[var(--card)] text-[var(--foreground)]/85 hover:border-white/15"
                  }`}
                >
                  <span className="text-[var(--muted)]">{e.kind}</span> · {e.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        </aside>
      </div>
      <SourcesLinkedStrip
        sources={trackSources}
        scopeLabel={scopeLabel}
        sourceCatalogCount={sourceCatalogCount}
      />
    </section>
  );
}

function TrackLensBar({
  active,
  boardPathname,
  boardState,
}: {
  active: TrackSlug | null;
  boardPathname: string;
  boardState: import("@/lib/boardUrlState").BoardUrlState;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Track lens
      </span>
      <LensChip
        href={boardPath(boardPathname, boardState, { track: null })}
        label="All"
        isActive={active === null}
      />
      {TRACKS.map((t) => (
        <LensChip
          key={t.slug}
          href={boardPath(boardPathname, boardState, { track: t.slug })}
          label={t.title}
          isActive={active === t.slug}
          track={t}
        />
      ))}
    </div>
  );
}

function LensChip({
  href,
  label,
  isActive,
  track,
}: {
  href: string;
  label: string;
  isActive: boolean;
  track?: TrackDefinition;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        isActive
          ? "border-white/25 bg-white/10 text-[var(--foreground)]"
          : "border-white/10 text-[var(--muted)] hover:border-white/20 hover:text-[var(--foreground)]"
      }`}
      style={isActive && track ? { borderLeftColor: track.cssVar, borderLeftWidth: 3 } : undefined}
    >
      {label}
    </Link>
  );
}
