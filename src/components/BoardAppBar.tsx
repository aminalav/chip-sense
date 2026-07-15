"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import type { RefObject } from "react";
import type { GraphEdge, GraphNode, Scenario, TrackSlug } from "@/data/graph";
import { TRACKS } from "@/data/tracks";
import { ExportMapButton } from "@/components/ExportMapButton";
import { MapGuidePopover } from "@/components/MapGuidePopover";
import { MapLayersPopover } from "@/components/MapLayersPopover";
import { ScenarioRoleLegend } from "@/components/ScenarioRoleLegend";
import { ShareBoardLinkButton } from "@/components/ShareBoardLinkButton";
import { TrackIcon } from "@/components/TrackIcon";
import type { BoardUrlState } from "@/lib/boardUrlState";
import { boardPath } from "@/lib/boardUrlState";
import type { ScenarioEffects } from "@/lib/scenarioEffects";

export function BoardAppBar({
  trackLens,
  showTrackLens,
  boardState,
  useTrackRoutes,
  scopeLabel,
  companyCount,
  connectionLayerCount,
  scenarios,
  scenarioId,
  onScenarioIdChange,
  activeScenarioLabel,
  effects,
  essay1Only,
  onEssay1OnlyChange,
  focusConnections,
  onFocusConnectionsChange,
  showSupplyLines,
  onShowSupplyLinesChange,
  showEquips,
  onShowEquipsChange,
  showPackaging,
  onShowPackagingChange,
  showMemory,
  onShowMemoryChange,
  showAssembly,
  onShowAssemblyChange,
  showTradeFlows,
  onShowTradeFlowsChange,
  includePresence,
  onIncludePresenceChange,
  mapRef,
  mapNodes,
  edges,
  selectedNodeId,
  statusHints,
}: {
  trackLens: TrackSlug | null;
  showTrackLens: boolean;
  boardState: BoardUrlState;
  useTrackRoutes: boolean;
  scopeLabel: string;
  companyCount: number;
  connectionLayerCount: number;
  scenarios: Scenario[];
  scenarioId: string;
  onScenarioIdChange: (id: string) => void;
  activeScenarioLabel: string;
  effects: ScenarioEffects | null;
  essay1Only: boolean;
  onEssay1OnlyChange: (value: boolean) => void;
  focusConnections: boolean;
  onFocusConnectionsChange: (value: boolean) => void;
  showSupplyLines: boolean;
  onShowSupplyLinesChange: (value: boolean) => void;
  showEquips: boolean;
  onShowEquipsChange: (value: boolean) => void;
  showPackaging: boolean;
  onShowPackagingChange: (value: boolean) => void;
  showMemory: boolean;
  onShowMemoryChange: (value: boolean) => void;
  showAssembly: boolean;
  onShowAssemblyChange: (value: boolean) => void;
  showTradeFlows: boolean;
  onShowTradeFlowsChange: (value: boolean) => void;
  includePresence: boolean;
  onIncludePresenceChange: (value: boolean) => void;
  mapRef: RefObject<MapRef | null>;
  mapNodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  statusHints?: ReactNode;
}) {
  const scenarioActive = scenarioId !== "baseline";

  return (
    <header className="shrink-0 border-b border-white/10 bg-[#0d1219] px-3 py-3 lg:px-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-[var(--foreground)] hover:text-[var(--accent)]"
            >
              Chip Sense
            </Link>
            <span className="text-[var(--muted)]/50">/</span>
            <span className="text-sm text-[var(--foreground)]/85">Supply chain board</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]/75">{scopeLabel}</span>
            {" · "}
            {companyCount} companies · {connectionLayerCount} layers
            {scenarioActive ? (
              <>
                {" · "}
                <span className="text-amber-100/85">{activeScenarioLabel}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs">
            <span className="hidden text-[var(--muted)] sm:inline">Scenario</span>
            <select
              className="max-w-[12rem] rounded-md border border-white/10 bg-[var(--background)] px-2 py-1.5 text-xs text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
              value={scenarioId}
              onChange={(e) => onScenarioIdChange(e.target.value)}
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <MapLayersPopover
            essay1Only={essay1Only}
            onEssay1OnlyChange={onEssay1OnlyChange}
            focusConnections={focusConnections}
            onFocusConnectionsChange={onFocusConnectionsChange}
            showSupplyLines={showSupplyLines}
            onShowSupplyLinesChange={onShowSupplyLinesChange}
            showEquips={showEquips}
            onShowEquipsChange={onShowEquipsChange}
            showPackaging={showPackaging}
            onShowPackagingChange={onShowPackagingChange}
            showMemory={showMemory}
            onShowMemoryChange={onShowMemoryChange}
            showAssembly={showAssembly}
            onShowAssemblyChange={onShowAssemblyChange}
            showTradeFlows={showTradeFlows}
            onShowTradeFlowsChange={onShowTradeFlowsChange}
            includePresence={includePresence}
            onIncludePresenceChange={onIncludePresenceChange}
          />
          <MapGuidePopover />
          <ShareBoardLinkButton />
          <ExportMapButton
            mapRef={mapRef}
            nodes={mapNodes}
            edges={edges}
            effects={effects}
            selectedNodeId={selectedNodeId}
            labelAllPins={essay1Only}
          />
        </div>
      </div>

      {showTrackLens ? (
        <nav
          className="mt-3 flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/20 p-1"
          aria-label="Industry lens"
        >
          <TrackTab
            href={
              useTrackRoutes
                ? boardPath("/", boardState, { includeTrackParam: false })
                : boardPath("/", boardState, { track: null })
            }
            label="All"
            isActive={trackLens === null}
          />
          {TRACKS.map((track) => (
            <TrackTab
              key={track.slug}
              href={
                useTrackRoutes
                  ? boardPath(`/track/${track.slug}`, boardState, { includeTrackParam: false })
                  : boardPath("/", boardState, { track: track.slug })
              }
              label={track.title}
              isActive={trackLens === track.slug}
              slug={track.slug}
              accentHex={track.accentHex}
            />
          ))}
        </nav>
      ) : null}

      {scenarioActive ? (
        <p className="mt-2 text-[11px] text-amber-100/75">
          Stress scenario active — illustrative only, not a forecast. See Scenario tab for assumptions.
        </p>
      ) : null}

      {effects ? (
        <div className="mt-2">
          <ScenarioRoleLegend />
        </div>
      ) : null}

      {statusHints ? (
        <div className="mt-2 space-y-1 text-[11px] text-[var(--muted)]">{statusHints}</div>
      ) : null}
    </header>
  );
}

function TrackTab({
  href,
  label,
  isActive,
  slug,
  accentHex,
}: {
  href: string;
  label: string;
  isActive: boolean;
  slug?: TrackSlug;
  accentHex?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
        isActive
          ? "bg-white/10 text-[var(--foreground)] shadow-sm"
          : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]/85"
      }`}
      style={isActive && accentHex ? { boxShadow: `inset 0 -2px 0 ${accentHex}` } : undefined}
    >
      {slug ? <TrackIcon slug={slug} className="h-3.5 w-3.5 opacity-80" /> : null}
      {label}
    </Link>
  );
}
