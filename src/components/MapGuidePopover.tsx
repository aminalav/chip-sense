"use client";

import { useEffect, useRef, useState } from "react";
import { startBoardTour } from "@/components/BoardTour";

export function MapGuidePopover() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} data-tour="guide" className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-white/20"
      >
        Guide
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Map guide"
          className="absolute right-0 top-full z-50 mt-1.5 max-h-[min(70vh,560px)] w-[min(92vw,24rem)] overflow-y-auto rounded-lg border border-white/10 bg-[#111820] p-3 text-xs leading-relaxed text-[var(--muted)] shadow-2xl shadow-black/50"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              startBoardTour();
            }}
            className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-2 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-[var(--accent)]/20"
          >
            Take the guided tour
          </button>
          <section className="space-y-2">
            <h3 className="text-[11px] font-medium text-[var(--foreground)]/90">How to use this tool</h3>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>Use track lenses to narrow the graph to one product story.</li>
              <li>Above the map, open Estimate tools for teaching calculators (yield, export controls, capacity, packaging, AI demand).</li>
              <li>Use the registry search in the toolbar or Browse tab to find companies, fabs, and countries without panning the map.</li>
              <li>Inspect pins and links in the right-hand panel — Selection, Browse, Scenario, Links.</li>
              <li>Pick a scenario for stress-test styling; click impact rows to locate entities.</li>
              <li>Layer toggles live under Layers; filters update the shareable URL.</li>
            </ul>
          </section>
          <section className="mt-4 space-y-2 border-t border-white/10 pt-3">
            <h3 className="text-[11px] font-medium text-[var(--foreground)]/90">How to read this map</h3>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>Colored arcs are typed HQ supply relationships, not shipping routes.</li>
              <li>Hover a pin for a quick card; click for full detail and citations.</li>
              <li>Scenarios restyle the graph — illustrative only, not forecasts.</li>
              <li>Trade flows are optional country-to-country Comtrade arcs.</li>
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  );
}
