import { Layer } from "react-map-gl/maplibre";
import { EDGE_ROLE_COLOR, SCENARIO_PRESENTATION } from "@/lib/scenarioEffects";

export function ScenarioArcLayers({
  sourceId,
  idPrefix,
  arcOpacityScale,
}: {
  sourceId: string;
  idPrefix: string;
  arcOpacityScale: number;
}) {
  const p = SCENARIO_PRESENTATION;

  return (
    <>
      <Layer
        id={`${idPrefix}-neutral`}
        source={sourceId}
        type="line"
        filter={["==", ["get", "scenarioRole"], "neutral"]}
        paint={{
          "line-color": "#94a3b8",
          "line-width": p.edgeWidth.neutral,
          "line-opacity": p.edgeOpacity.neutral * arcOpacityScale,
          "line-dasharray": [2, 2],
        }}
      />
      <Layer
        id={`${idPrefix}-disrupted`}
        source={sourceId}
        type="line"
        filter={["==", ["get", "scenarioRole"], "disrupted"]}
        paint={{
          "line-color": EDGE_ROLE_COLOR.disrupted ?? "#f87171",
          "line-width": p.edgeWidth.disrupted,
          "line-opacity": p.edgeOpacity.disrupted * arcOpacityScale,
          "line-dasharray": [2, 1],
        }}
      />
      <Layer
        id={`${idPrefix}-stressed`}
        source={sourceId}
        type="line"
        filter={["==", ["get", "scenarioRole"], "stressed"]}
        paint={{
          "line-color": EDGE_ROLE_COLOR.stressed ?? "#fb923c",
          "line-width": p.edgeWidth.stressed,
          "line-opacity": p.edgeOpacity.stressed * arcOpacityScale,
          "line-dasharray": [2, 1.5],
        }}
      />
      <Layer
        id={`${idPrefix}-buffered`}
        source={sourceId}
        type="line"
        filter={["==", ["get", "scenarioRole"], "buffered"]}
        paint={{
          "line-color": EDGE_ROLE_COLOR.buffered ?? "#22d3ee",
          "line-width": p.edgeWidth.buffered,
          "line-opacity": p.edgeOpacity.buffered * arcOpacityScale,
          "line-dasharray": [2, 2],
        }}
      />
    </>
  );
}
