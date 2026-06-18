"use client";

import { useSearchParams } from "next/navigation";
import { ResearchBoardSection } from "@/components/ResearchBoardSection";
import type { GraphEdge, GraphNode, Scenario, SourceRecord } from "@/data/graph";
import { isTrackSlug } from "@/data/tracks";
import { COMPANY_RECORDS } from "@/lib/companyRecords";

export function HomeDashboard({
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

  return (
    <ResearchBoardSection
      graphNodes={graphNodes}
      graphEdges={graphEdges}
      scenarios={scenarios}
      accentHex="#3b82f6"
      trackLens={trackLens}
      showTrackLens
      showEditorialTracks
      sourceCatalogCount={sourceCatalogCount}
      sourceRecords={sourceRecords}
      boardNote={`${COMPANY_RECORDS.length} registry companies · cited fab pins · scenario stress-testing`}
    />
  );
}
