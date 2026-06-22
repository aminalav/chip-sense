import type { Scenario, TrackSlug } from "@/data/graph";
import { isTrackSlug } from "@/data/tracks";

export interface BoardUrlState {
  scenarioId: string;
  essay1Only: boolean;
  showSupplyLines: boolean;
  showEquips: boolean;
  showPackaging: boolean;
  showMemory: boolean;
  showAssembly: boolean;
  showTradeFlows: boolean;
  includePresence: boolean;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
}

export function parseBoardSearchParams(
  params: URLSearchParams,
  scenarios: Scenario[],
  options?: { defaultIncludePresence?: boolean },
): BoardUrlState & { track: TrackSlug | null } {
  const scenarioParam = params.get("scenario");
  const knownScenario = scenarios.some((s) => s.id === scenarioParam);
  const scenarioId = knownScenario && scenarioParam ? scenarioParam : "baseline";

  const trackParam = params.get("track");
  const track = trackParam && isTrackSlug(trackParam) ? trackParam : null;

  return {
    track,
    scenarioId,
    essay1Only: params.get("essay1") === "1",
    showSupplyLines: params.get("supply") !== "0",
    showEquips: params.get("equips") !== "0",
    showPackaging: params.get("pkg") !== "0",
    showMemory: params.get("mem") !== "0",
    showAssembly: params.get("asm") !== "0",
    showTradeFlows: params.get("trade") === "1",
    includePresence:
      params.get("ops") === "1" || (params.get("ops") !== "0" && Boolean(options?.defaultIncludePresence)),
    selectedNodeId: params.get("node"),
    selectedEdgeId: params.get("edge"),
  };
}

export function buildBoardQueryString(
  state: BoardUrlState,
  options?: { track?: TrackSlug | null; includeTrackParam?: boolean },
): string {
  const params = new URLSearchParams();
  if (options?.includeTrackParam !== false && options?.track) {
    params.set("track", options.track);
  }
  if (state.scenarioId !== "baseline") params.set("scenario", state.scenarioId);
  if (state.essay1Only) params.set("essay1", "1");
  if (!state.showSupplyLines) params.set("supply", "0");
  if (!state.showEquips) params.set("equips", "0");
  if (!state.showPackaging) params.set("pkg", "0");
  if (!state.showMemory) params.set("mem", "0");
  if (!state.showAssembly) params.set("asm", "0");
  if (state.showTradeFlows) params.set("trade", "1");
  if (state.includePresence) params.set("ops", "1");
  if (state.selectedNodeId) params.set("node", state.selectedNodeId);
  if (state.selectedEdgeId) params.set("edge", state.selectedEdgeId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function boardPath(
  pathname: string,
  state: BoardUrlState,
  options?: { track?: TrackSlug | null; includeTrackParam?: boolean },
): string {
  return `${pathname}${buildBoardQueryString(state, options)}`;
}
