"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { MapRef } from "react-map-gl/maplibre";
import { BoardLoadingPlaceholder } from "@/components/BoardLoadingPlaceholder";
import { BoardSelectionPanel } from "@/components/BoardSelectionPanel";
import { EditorialTracksBar } from "@/components/EditorialTracksBar";
import { ScenarioBanner } from "@/components/BoardDisclaimer";
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
import { collectBoardSourceIds } from "@/lib/sourceQueries";
import { loadTradeFlows, tradeFlowsForTrack, tradeFlowsToGeoJSON } from "@/lib/tradeFlows";

const SupplyMap = dynamic(
  () => import("./SupplyMap").then((m) => m.SupplyMap),
  {
    ssr: false,
    loading: () => <BoardLoadingPlaceholder />,
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
  const { state, update, urlWarnings } = useBoardUrlState(scenarios, {
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
    return collectBoardSourceIds(edges, tradeFlows, state.showTradeFlows)
      .map((id) => sourceLookup.get(id))
      .filter((s): s is SourceRecord => Boolean(s));
  }, [edges, tradeFlows, state.showTradeFlows, sourceLookup]);

  const nodeById = useMemo(() => new Map(graphNodes.map((n) => [n.id, n])), [graphNodes]);
  const countryName = useMemo(
    () =>
      new Map(
        graphNodes.filter((n) => n.kind === "country").map((n) => [n.id, n.label]),
    ),
    [graphNodes],
  );
  const edgeById = useMemo(() => new Map(graphEdges.map((e) => [e.id, e])), [graphEdges]);

  const selectedNode = state.selectedNodeId
    ? (mapNodes.find((n) => n.id === state.selectedNodeId) ??
      nodeById.get(state.selectedNodeId) ??
      null)
    : null;
  const selectedNodeHiddenFromMap = Boolean(
    state.selectedNodeId &&
      selectedNode &&
      !mapNodes.some((n) => n.id === state.selectedNodeId),
  );
  const selectedEdge = state.selectedEdgeId ? (edgeById.get(state.selectedEdgeId) ?? null) : null;
  const selectedTradeFlow = state.selectedEdgeId
    ? (tradeFlows.find((f) => f.id === state.selectedEdgeId) ?? null)
    : null;

  const relationships = useMemo(() => {
    const verbs: Partial<Record<GraphEdge["kind"], string>> = {
      supplies: "supplies",
      equips: "equips",
      packages: "packages for",
      memory_supply: "supplies memory to",
      assembles: "assembles for",
    };
    return graphEdges
      .filter((e) => e.kind in verbs && (!trackLens || e.tracks.includes(trackLens)))
      .map((e) => ({
        id: e.id,
        from: nodeById.get(e.source)?.label ?? e.source,
        verb: verbs[e.kind]!,
        to: nodeById.get(e.target)?.label ?? e.target,
      }));
  }, [graphEdges, nodeById, trackLens]);

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
      {activeScenario && activeScenario.id !== "baseline" ? (
        <ScenarioBanner scenarioLabel={activeScenario.label} />
      ) : null}
      {urlWarnings.length > 0 ? (
        <div
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-100/90"
          role="status"
        >
          {urlWarnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col gap-6">
        <div className="isolate space-y-3">
          {showTrackLens ? (
            <TrackLensBar
              active={trackLens}
              boardState={state}
              useTrackRoutes
            />
          ) : null}
          {boardNote ? <p className="text-sm text-[var(--muted)]">{boardNote}</p> : null}
          {trackLens ? (
            <p className="text-xs text-[var(--muted)]">
              <Link
                href={boardPath("/", state, { includeTrackParam: false })}
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
            <ExportMapButton
              mapRef={mapRef}
              nodes={mapNodes}
              edges={edges}
              effects={effects}
              selectedNodeId={state.selectedNodeId}
              labelAllPins={state.essay1Only}
            />
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
            focusConnections={state.focusConnections}
            onFocusConnectionsChange={(v) => update({ focusConnections: v })}
            tradeFlows={tradeFlows}
            tradeLines={tradeLinesGeo}
            selectedNodeId={state.selectedNodeId}
            onSelectNode={selectNode}
            onSelectEdge={selectEdge}
          />
        </div>
        <aside className="grid gap-5 lg:grid-cols-2">
        <BoardSelectionPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          selectedTradeFlow={selectedTradeFlow}
          graphNodes={graphNodes}
          graphEdges={graphEdges}
          sourceLookup={sourceLookup}
          hiddenFromMap={selectedNodeHiddenFromMap}
          onClear={clearSelection}
        />
        <ScenarioImpactPanel scenario={activeScenario} effects={effects} />
        {state.showTradeFlows ? (
          <TradeFlowsPanel
            flows={tradeFlows}
            sourceLookup={sourceLookup}
            countryName={countryName}
            selectedFlowId={selectedTradeFlow?.id ?? null}
            onSelectFlow={selectEdge}
          />
        ) : null}
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
        <details className="rounded-xl border border-white/10 bg-[var(--card)] px-4 py-3 lg:col-span-2">
          <summary className="cursor-pointer select-none text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            Supply relationships ({scopeLabel})
            <span className="ml-1 font-normal normal-case text-[var(--foreground)]/70">
              · {relationships.length} in view
            </span>
          </summary>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Who supplies whom across the chain. Select one to see its citations.
          </p>
          {relationships.length === 0 ? (
            <p className="mt-2 text-xs text-[var(--muted)]">
              No supply relationships in this view.
            </p>
          ) : (
            <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-xs">
              {relationships.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => selectEdge(e.id)}
                    className={`w-full rounded-md border px-2 py-1.5 text-left text-[12px] leading-snug transition ${
                      state.selectedEdgeId === e.id
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                        : "border-white/5 bg-black/20 text-[var(--foreground)]/85 hover:border-white/15"
                    }`}
                  >
                    <span className="font-medium">{e.from}</span>{" "}
                    <span className="text-[var(--muted)]">{e.verb}</span>{" "}
                    <span className="font-medium">{e.to}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </details>
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
  boardState,
  useTrackRoutes,
}: {
  active: TrackSlug | null;
  boardState: import("@/lib/boardUrlState").BoardUrlState;
  /** Link to /track/slug instead of /?track=slug */
  useTrackRoutes: boolean;
}) {
  const allHref = useTrackRoutes
    ? boardPath("/", boardState, { includeTrackParam: false })
    : boardPath("/", boardState, { track: null });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        Track lens
      </span>
      <LensChip href={allHref} label="All" isActive={active === null} />
      {TRACKS.map((t) => (
        <LensChip
          key={t.slug}
          href={
            useTrackRoutes
              ? boardPath(`/track/${t.slug}`, boardState, { includeTrackParam: false })
              : boardPath("/", boardState, { track: t.slug })
          }
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
