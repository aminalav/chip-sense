"use client";

import type { MapRef } from "react-map-gl/maplibre";
import type { RefObject } from "react";

export function ExportMapButton({
  mapRef,
  filename = "chip-sense-map.png",
}: {
  mapRef: RefObject<MapRef | null>;
  filename?: string;
}) {
  const exportPng = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    try {
      const canvas = map.getCanvas();
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Map export failed", err);
    }
  };

  return (
    <button
      type="button"
      onClick={exportPng}
      className="rounded-md border border-white/10 bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-white/20"
    >
      Export map PNG
    </button>
  );
}
