"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Scenario } from "@/data/graph";
import type { TrackSlug } from "@/data/graph";
import {
  buildBoardQueryString,
  parseBoardSearchParams,
  type BoardUrlState,
} from "@/lib/boardUrlState";

export function useBoardUrlState(
  scenarios: Scenario[],
  options: { trackLens?: TrackSlug | null; defaultIncludePresence?: boolean },
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsed = useMemo(
    () =>
      parseBoardSearchParams(searchParams, scenarios, {
        defaultIncludePresence: options.defaultIncludePresence,
      }),
    [searchParams, scenarios, options.defaultIncludePresence],
  );

  const [state, setState] = useState<BoardUrlState>(() => ({
    scenarioId: parsed.scenarioId,
    essay1Only: parsed.essay1Only,
    showSupplyLines: parsed.showSupplyLines,
    showEquips: parsed.showEquips,
    showPackaging: parsed.showPackaging,
    showMemory: parsed.showMemory,
    showAssembly: parsed.showAssembly,
    showTradeFlows: parsed.showTradeFlows,
    includePresence: parsed.includePresence,
    selectedNodeId: parsed.selectedNodeId,
    selectedEdgeId: parsed.selectedEdgeId,
  }));

  const syncingFromUrl = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    syncingFromUrl.current = true;
    setState({
      scenarioId: parsed.scenarioId,
      essay1Only: parsed.essay1Only,
      showSupplyLines: parsed.showSupplyLines,
      showEquips: parsed.showEquips,
      showPackaging: parsed.showPackaging,
      showMemory: parsed.showMemory,
      showAssembly: parsed.showAssembly,
      showTradeFlows: parsed.showTradeFlows,
      includePresence: parsed.includePresence,
      selectedNodeId: parsed.selectedNodeId,
      selectedEdgeId: parsed.selectedEdgeId,
    });
  }, [parsed]);

  const syncUrl = useCallback(
    (next: BoardUrlState) => {
      const onTrackPage = pathname.startsWith("/track/");
      const qs = buildBoardQueryString(next, {
        track: onTrackPage ? null : (options.trackLens ?? parsed.track ?? null),
        includeTrackParam: !onTrackPage,
      });
      const nextUrl = `${pathname}${qs}`;
      const currentQs = searchParams.toString();
      const currentUrl = `${pathname}${currentQs ? `?${currentQs}` : ""}`;
      if (nextUrl === currentUrl) return;
      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    },
    [router, pathname, options.trackLens, parsed.track, searchParams],
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (syncingFromUrl.current) {
      syncingFromUrl.current = false;
      return;
    }
    syncUrl(state);
  }, [state, syncUrl]);

  const update = useCallback((patch: Partial<BoardUrlState>) => {
    syncingFromUrl.current = false;
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  return { state, update };
}
