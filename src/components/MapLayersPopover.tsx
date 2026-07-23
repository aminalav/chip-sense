"use client";

import { useEffect, useRef, useState } from "react";

export function MapLayersPopover({
  essay1Only,
  onEssay1OnlyChange,
  focusConnections,
  onFocusConnectionsChange,
  showSupplyLines,
  onShowSupplyLinesChange,
  showEquips,
  onShowEquipsChange,
  showPackaging,
  onShowPackagingChange,
  showMemory,
  onShowMemoryChange,
  showAssembly,
  onShowAssemblyChange,
  showTradeFlows,
  onShowTradeFlowsChange,
  includePresence,
  onIncludePresenceChange,
}: {
  essay1Only: boolean;
  onEssay1OnlyChange: (value: boolean) => void;
  focusConnections: boolean;
  onFocusConnectionsChange: (value: boolean) => void;
  showSupplyLines: boolean;
  onShowSupplyLinesChange: (value: boolean) => void;
  showEquips: boolean;
  onShowEquipsChange: (value: boolean) => void;
  showPackaging: boolean;
  onShowPackagingChange: (value: boolean) => void;
  showMemory: boolean;
  onShowMemoryChange: (value: boolean) => void;
  showAssembly: boolean;
  onShowAssemblyChange: (value: boolean) => void;
  showTradeFlows: boolean;
  onShowTradeFlowsChange: (value: boolean) => void;
  includePresence: boolean;
  onIncludePresenceChange: (value: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const arcLayerCount = [
    showSupplyLines,
    showEquips,
    showPackaging,
    showMemory,
    showAssembly,
    showTradeFlows,
  ].filter(Boolean).length;

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
    <div ref={rootRef} data-tour="layers" className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-white/20"
      >
        Layers
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-normal text-[var(--muted)]">
          {arcLayerCount}
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Map layers"
          className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-lg border border-white/10 bg-[#111820] p-3 shadow-2xl shadow-black/50"
        >
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            View filters
          </p>
          <div className="space-y-2 border-b border-white/10 pb-3">
            <LayerToggle
              label="Core supply chain view"
              hint="Twelve anchor companies and key fabs"
              checked={essay1Only}
              onChange={onEssay1OnlyChange}
            />
            <LayerToggle
              label="Focus on visible connections"
              hint="Dim pins not tied to visible arcs"
              checked={focusConnections}
              onChange={onFocusConnectionsChange}
            />
            <LayerToggle
              label="Ops pins"
              hint="Country-level presence without a fab site"
              checked={includePresence}
              onChange={onIncludePresenceChange}
            />
          </div>
          <p className="mb-2 mt-3 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Connection arcs
          </p>
          <p className="mb-2 text-[10px] text-[var(--muted)]/80">
            Each line links two company HQs and points from supplier → customer.
          </p>
          <div className="space-y-2">
            <LayerToggle
              label="Foundry supply"
              hint="Who fabricates whose wafers (foundry → customer)"
              checked={showSupplyLines}
              onChange={onShowSupplyLinesChange}
            />
            <LayerToggle
              label="Equipment"
              hint="Who supplies fab tools (equipment maker → fab operator)"
              checked={showEquips}
              onChange={onShowEquipsChange}
            />
            <LayerToggle
              label="Packaging / OSAT"
              hint="Who packages whose chips (packager → customer)"
              checked={showPackaging}
              onChange={onShowPackagingChange}
            />
            <LayerToggle
              label="HBM / memory"
              hint="Who supplies memory (memory maker → customer)"
              checked={showMemory}
              onChange={onShowMemoryChange}
            />
            <LayerToggle
              label="Assembly / EMS"
              hint="Who assembles finished products (assembler → brand)"
              checked={showAssembly}
              onChange={onShowAssemblyChange}
            />
            <LayerToggle
              label="Trade flows"
              hint="Country-to-country chip & equipment trade (exporter → importer)"
              checked={showTradeFlows}
              onChange={onShowTradeFlowsChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LayerToggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-xs text-[var(--foreground)]/90">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 rounded border-white/20"
      />
      <span>
        {label}
        {hint ? <span className="mt-0.5 block text-[10px] text-[var(--muted)]">{hint}</span> : null}
      </span>
    </label>
  );
}
