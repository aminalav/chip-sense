export function BoardLoadingPlaceholder() {
  return (
    <div className="flex aspect-[2/1] min-h-[320px] max-h-[min(62vh,560px)] w-full items-center justify-center rounded-xl border border-white/10 bg-[var(--card)] text-sm text-[var(--muted)]">
      Loading board…
    </div>
  );
}
