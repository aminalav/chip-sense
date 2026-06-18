"use client";

import type { MapRef } from "react-map-gl/maplibre";
import type { RefObject } from "react";
import type { GraphEdge, GraphNode } from "@/data/graph";
import type { ScenarioEffects } from "@/lib/scenarioEffects";
import { exportMapWhenReady } from "@/lib/mapExport";

export function ExportMapButton({
  mapRef,
  nodes,
  edges,
  effects = null,
  selectedNodeId = null,
  accentHex = "#38bdf8",
  labelAllPins,
  filename = "chip-sense-map.png",
}: {
  mapRef: RefObject<MapRef | null>;
  nodes: GraphNode[];
  edges?: GraphEdge[];
  effects?: ScenarioEffects | null;
  selectedNodeId?: string | null;
  accentHex?: string;
  /** When true, every visible pin gets a name label in the PNG. */
  labelAllPins?: boolean;
  filename?: string;
}) {
  const exportPng = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    exportMapWhenReady(
      {
        map,
        nodes,
        edges,
        effects,
        selectedNodeId,
        accentHex,
        labelAllPins,
      },
      (dataUrl) => {
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
      },
      (err) => {
        console.error("Map export failed", err);
      },
    );
  };

  return (
    <button
      type="button"
      onClick={exportPng}
      title="Downloads the visible map with connection arcs and pin markers."
      className="rounded-md border border-white/10 bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-white/20"
    >
      Export map (PNG)
    </button>
  );
}
