"use client";

import { useState } from "react";
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
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );

  const exportPng = () => {
    const map = mapRef.current?.getMap();
    if (!map) {
      setMessage({ tone: "error", text: "Map is still loading — try again in a moment." });
      return;
    }

    setExporting(true);
    setMessage(null);

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
        setExporting(false);
        setMessage({ tone: "success", text: "Map PNG downloaded." });
      },
      () => {
        setExporting(false);
        setMessage({ tone: "error", text: "Export failed — try again or use a browser screenshot." });
      },
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={exportPng}
        disabled={exporting}
        title="Downloads the visible map with connection arcs and pin markers."
        className="rounded-md border border-white/10 bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-white/20 disabled:cursor-wait disabled:opacity-60"
      >
        {exporting ? "Exporting…" : "Export map (PNG)"}
      </button>
      {message ? (
        <p
          role="status"
          className={`text-xs ${
            message.tone === "error" ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
