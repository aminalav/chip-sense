"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { BoardLoadingPlaceholder } from "@/components/BoardLoadingPlaceholder";
import type { GraphEdge, GraphNode, Scenario, SourceRecord } from "@/data/graph";
import { isTrackSlug, TRACKS } from "@/data/tracks";

function HomeDashboard({
  graphNodes,
  graphEdges,
  scenarios,
  sourceCatalogCount,
  sourceRecords,
}: {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  scenarios: Scenario[];
  sourceCatalogCount: number;
  sourceRecords: SourceRecord[];
}) {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get("track");
  const trackLens = trackParam && isTrackSlug(trackParam) ? trackParam : null;
  const trackAccent =
    trackLens ? (TRACKS.find((t) => t.slug === trackLens)?.accentHex ?? "#3b82f6") : "#3b82f6";

  return (
    <ResearchBoardSection
      graphNodes={graphNodes}
      graphEdges={graphEdges}
      scenarios={scenarios}
      accentHex={trackAccent}
      trackLens={trackLens}
      showTrackLens
      sourceCatalogCount={sourceCatalogCount}
      sourceRecords={sourceRecords}
    />
  );
}

const ResearchBoardSection = dynamic(
  () => import("@/components/ResearchBoardSection").then((m) => m.ResearchBoardSection),
  {
    ssr: false,
    loading: () => <BoardLoadingPlaceholder />,
  },
);

export const ClientHomeDashboard = dynamic(
  () => Promise.resolve(HomeDashboard),
  {
    ssr: false,
    loading: () => <BoardLoadingPlaceholder />,
  },
);

export const ClientResearchBoardSection = ResearchBoardSection;
