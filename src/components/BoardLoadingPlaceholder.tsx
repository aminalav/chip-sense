import { MAP_FRAME_CLASS } from "@/lib/mapLabels";

export function BoardLoadingPlaceholder() {
  return (
    <div
      className={`${MAP_FRAME_CLASS} min-h-[min(75vh,880px)] flex items-center justify-center text-sm text-[var(--muted)]`}
    >
      Loading board…
    </div>
  );
}
