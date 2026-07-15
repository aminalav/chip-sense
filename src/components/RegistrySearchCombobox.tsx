"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { GraphEdge, GraphNode, TrackSlug } from "@/data/graph";
import {
  buildRegistryIndex,
  filterRegistryByTrack,
  REGISTRY_KIND_LABEL,
  searchRegistry,
  type RegistryEntry,
} from "@/lib/registryIndex";
import { SEGMENT_LABEL } from "@/lib/segments";

function entrySubtitle(entry: RegistryEntry): string {
  const parts = [REGISTRY_KIND_LABEL[entry.kind]];
  if (entry.segment) parts.push(SEGMENT_LABEL[entry.segment]);
  if (entry.countries.length > 0) parts.push(entry.countries.join(", "));
  return parts.join(" · ");
}

export function RegistrySearchCombobox({
  graphNodes,
  graphEdges,
  trackLens,
  onSelectNode,
}: {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  trackLens: TrackSlug | null;
  onSelectNode: (nodeId: string) => void;
}) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const entries = useMemo(
    () => buildRegistryIndex(graphNodes, graphEdges),
    [graphNodes, graphEdges],
  );

  const results = useMemo(() => {
    const scoped = filterRegistryByTrack(entries, trackLens);
    return searchRegistry(scoped, query, 10);
  }, [entries, trackLens, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, results.length]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const selectEntry = (entry: RegistryEntry) => {
    onSelectNode(entry.nodeId);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) {
      if (event.key === "ArrowDown" && query.trim()) setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = results[activeIndex];
      if (entry) selectEntry(entry);
    }
  };

  const showResults = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative min-w-[10rem] flex-1 sm:max-w-[14rem]">
      <label className="sr-only" htmlFor={`${listboxId}-input`}>
        Search companies, fabs, and countries
      </label>
      <input
        ref={inputRef}
        id={`${listboxId}-input`}
        type="search"
        value={query}
        placeholder="Search registry…"
        autoComplete="off"
        role="combobox"
        aria-expanded={showResults}
        aria-controls={showResults ? `${listboxId}-listbox` : undefined}
        aria-autocomplete="list"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[color:var(--accent)]"
      />
      {showResults ? (
        <ul
          id={`${listboxId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-[#111820] py-1 shadow-2xl shadow-black/50"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-xs text-[var(--muted)]">No matches in this view.</li>
          ) : (
            results.map((entry, index) => (
              <li key={entry.nodeId} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectEntry(entry)}
                  className={`flex w-full flex-col px-3 py-2 text-left transition ${
                    index === activeIndex
                      ? "bg-[var(--accent)]/15 text-[var(--foreground)]"
                      : "text-[var(--foreground)]/90 hover:bg-white/5"
                  }`}
                >
                  <span className="text-xs font-medium">{entry.label}</span>
                  <span className="text-[10px] text-[var(--muted)]">{entrySubtitle(entry)}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
