"use client";

import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type { MapRef } from "react-map-gl/maplibre";
import { BoardAppBar } from "@/components/BoardAppBar";
import { BoardInspector } from "@/components/BoardInspector";
import { BoardLoadingPlaceholder } from "@/components/BoardLoadingPlaceholder";
import type { GraphEdge, GraphNode, Scenario, SourceRecord, TrackSlug } from "@/data/graph";
import { TRACKS } from "@/data/tracks";
import { useBoardUrlState } from "@/hooks/useBoardUrlState";
import { buildMapView } from "@/lib/mapView";
import { computeMapFocusTarget } from "@/lib/mapFocusCamera";
import { visibleCompanyArcLayerCount } from "@/lib/mapFocus";
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
  researchPointers,
  sourceCatalogCount,
  sourceRecords,
}: {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  scenarios: Scenario[];
  accentHex: string;
  trackLens?: TrackSlug | null;
  showTrackLens?: boolean;
  researchPointers?: string[];
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

  const companyCount = useMemo(
    () => mapNodes.filter((n) => n.kind === "company").length,
    [mapNodes],
  );

  const connectionLayerCount = useMemo(() => {
    let count = visibleCompanyArcLayerCount({
      showSupplyLines: state.showSupplyLines,
      showEquips: state.showEquips,
      showPackaging: state.showPackaging,
      showMemory: state.showMemory,
      showAssembly: state.showAssembly,
      showTradeFlows: false,
    });
    if (state.showTradeFlows) count += 1;
    return count;
  }, [
    state.showSupplyLines,
    state.showEquips,
    state.showPackaging,
    state.showMemory,
    state.showAssembly,
    state.showTradeFlows,
  ]);

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

  const mapFocusTarget = useMemo(
    () =>
      computeMapFocusTarget(
        selectedNode,
        selectedEdge,
        selectedTradeFlow,
        nodeById,
      ),
    [selectedNode, selectedEdge, selectedTradeFlow, nodeById],
  );

  const mapFocusKey = state.selectedNodeId ?? state.selectedEdgeId ?? null;

  const runScenario = (scenarioId: string) => {
    update({ scenarioId, selectedNodeId: null, selectedEdgeId: null });
  };

  const statusHints = (
    <>
      {state.essay1Only ? <p>Core supply chain view — anchor companies and key fabs only.</p> : null}
      {state.focusConnections ? <p>Focus mode — pins not on visible arcs are dimmed.</p> : null}
    </>
  );

  return (
    <section className="flex flex-col gap-4">
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

      <div className="flex min-h-[min(88vh,960px)] flex-col overflow-hidden rounded-xl border border-white/10 bg-[var(--surface-workspace)] shadow-lg shadow-black/20 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          <BoardAppBar
            trackLens={trackLens}
            showTrackLens={showTrackLens}
            boardState={state}
            useTrackRoutes
            scopeLabel={scopeLabel}
            companyCount={companyCount}
            connectionLayerCount={connectionLayerCount}
            scenarios={scenarios}
            scenarioId={state.scenarioId}
            onScenarioIdChange={(id) => update({ scenarioId: id })}
            activeScenarioLabel={activeScenario?.label ?? "Baseline"}
            effects={effects}
            essay1Only={state.essay1Only}
            onEssay1OnlyChange={(v) => update({ essay1Only: v })}
            focusConnections={state.focusConnections}
            onFocusConnectionsChange={(v) => update({ focusConnections: v })}
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
            includePresence={state.includePresence}
            onIncludePresenceChange={(v) => update({ includePresence: v })}
            mapRef={mapRef}
            mapNodes={mapNodes}
            edges={edges}
            selectedNodeId={state.selectedNodeId}
            statusHints={statusHints}
          />

          <div className="flex min-h-0 flex-1 flex-col p-3 lg:p-4">
            <SupplyMap
              ref={mapRef}
              nodes={mapNodes}
              edges={edges}
              accentHex={accentHex}
              effects={effects}
              essay1Only={state.essay1Only}
              showSupplyLines={state.showSupplyLines}
              showEquips={state.showEquips}
              showPackaging={state.showPackaging}
              showMemory={state.showMemory}
              showAssembly={state.showAssembly}
              showTradeFlows={state.showTradeFlows}
              focusConnections={state.focusConnections}
              tradeFlows={tradeFlows}
              tradeLines={tradeLinesGeo}
              selectedNodeId={state.selectedNodeId}
              focusTarget={mapFocusTarget}
              focusKey={mapFocusKey}
              onSelectNode={selectNode}
              onSelectEdge={selectEdge}
            />
          </div>
        </div>

        <BoardInspector
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          selectedTradeFlow={selectedTradeFlow}
          selectedNodeId={state.selectedNodeId}
          selectedEdgeId={state.selectedEdgeId}
          selectedNodeHiddenFromMap={selectedNodeHiddenFromMap}
          graphNodes={graphNodes}
          graphEdges={graphEdges}
          sourceLookup={sourceLookup}
          activeScenario={activeScenario}
          effects={effects}
          relationships={relationships}
          scopeLabel={scopeLabel}
          trackLens={trackLens}
          showTradeFlows={state.showTradeFlows}
          tradeFlows={tradeFlows}
          countryName={countryName}
          trackSources={trackSources}
          sourceCatalogCount={sourceCatalogCount}
          researchPointers={researchPointers}
          onClearSelection={clearSelection}
          onSelectNode={selectNode}
          onSelectEdge={selectEdge}
          onRunScenario={runScenario}
        />
      </div>
    </section>
  );
}
