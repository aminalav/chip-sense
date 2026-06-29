"use client";

import { useEffect, useState } from "react";
import { BoardSelectionPanel } from "@/components/BoardSelectionPanel";
import { ScenarioImpactPanel } from "@/components/ScenarioImpactPanel";
import { SourcesLinkedStrip } from "@/components/SourcesLinkedStrip";
import { SupplyRelationshipsPanel } from "@/components/SupplyRelationshipsPanel";
import { TradeFlowsPanel } from "@/components/TradeFlowsPanel";
import type {
  GraphEdge,
  GraphNode,
  Scenario,
  SourceRecord,
  TrackSlug,
  TradeFlowRecord,
} from "@/data/graph";
import type { ScenarioEffects } from "@/lib/scenarioEffects";

type InspectorTab = "selection" | "scenario" | "relationships";

const TABS: { id: InspectorTab; label: string }[] = [
  { id: "selection", label: "Selection" },
  { id: "scenario", label: "Scenario" },
  { id: "relationships", label: "Relationships" },
];

export function BoardInspector({
  selectedNode,
  selectedEdge,
  selectedTradeFlow,
  selectedNodeId,
  selectedEdgeId,
  selectedNodeHiddenFromMap,
  graphNodes,
  graphEdges,
  sourceLookup,
  activeScenario,
  effects,
  relationships,
  scopeLabel,
  showTradeFlows,
  tradeFlows,
  countryName,
  trackSources,
  sourceCatalogCount,
  researchPointers,
  onClearSelection,
  onSelectNode,
  onSelectEdge,
  onRunScenario,
  trackLens = null,
}: {
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  selectedTradeFlow: TradeFlowRecord | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  selectedNodeHiddenFromMap: boolean;
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  sourceLookup: Map<string, SourceRecord>;
  activeScenario: Scenario | undefined;
  effects: ScenarioEffects | null;
  relationships: { id: string; from: string; verb: string; to: string }[];
  scopeLabel: string;
  showTradeFlows: boolean;
  tradeFlows: TradeFlowRecord[];
  countryName: Map<string, string>;
  trackSources: SourceRecord[];
  sourceCatalogCount: number;
  researchPointers?: string[];
  onClearSelection: () => void;
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onRunScenario: (scenarioId: string) => void;
  trackLens?: TrackSlug | null;
}) {
  const [tab, setTab] = useState<InspectorTab>("selection");

  useEffect(() => {
    if (selectedNodeId || selectedEdgeId) setTab("selection");
  }, [selectedNodeId, selectedEdgeId]);

  useEffect(() => {
    if (activeScenario && activeScenario.id !== "baseline") {
      setTab("scenario");
    }
  }, [activeScenario]);

  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-white/10 bg-[var(--surface-inspector)] lg:w-[380px] lg:border-t-0 lg:border-l">
      <div className="flex border-b border-white/10" role="tablist" aria-label="Board inspector">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition ${
              tab === item.id
                ? "border-b-2 border-[var(--accent)] text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]/80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="min-h-[320px] flex-1 overflow-y-auto p-4 lg:max-h-[calc(85vh-8rem)]">
        {tab === "selection" ? (
          <BoardSelectionPanel
            embedded
            trackLens={trackLens}
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            selectedTradeFlow={selectedTradeFlow}
            graphNodes={graphNodes}
            graphEdges={graphEdges}
            sourceLookup={sourceLookup}
            hiddenFromMap={selectedNodeHiddenFromMap}
            onClear={onClearSelection}
            onRunScenario={onRunScenario}
            onSelectNode={onSelectNode}
          />
        ) : null}
        {tab === "scenario" ? (
          <ScenarioImpactPanel
            embedded
            scenario={activeScenario}
            effects={effects}
            onSelectNode={onSelectNode}
            onSelectEdge={onSelectEdge}
          />
        ) : null}
        {tab === "relationships" ? (
          <div className="space-y-5">
            <SupplyRelationshipsPanel
              relationships={relationships}
              selectedEdgeId={selectedEdgeId}
              onSelectEdge={onSelectEdge}
              scopeLabel={scopeLabel}
            />
            {showTradeFlows ? (
              <TradeFlowsPanel
                embedded
                flows={tradeFlows}
                sourceLookup={sourceLookup}
                countryName={countryName}
                selectedFlowId={selectedTradeFlow?.id ?? null}
                onSelectFlow={onSelectEdge}
              />
            ) : null}
            {researchPointers && researchPointers.length > 0 ? (
              <div>
                <h3 className="text-xs font-medium text-[var(--foreground)]/80">Research pointers</h3>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[var(--foreground)]/85">
                  {researchPointers.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10 p-3">
        <SourcesLinkedStrip
          embedded
          sources={trackSources}
          scopeLabel={scopeLabel}
          sourceCatalogCount={sourceCatalogCount}
        />
      </div>
    </aside>
  );
}
