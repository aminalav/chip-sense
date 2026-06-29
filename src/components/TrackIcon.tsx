import type { TrackSlug } from "@/data/graph";

export function TrackIcon({ slug, className = "h-4 w-4" }: { slug: TrackSlug; className?: string }) {
  switch (slug) {
    case "memory":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="2" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M4 5V3.5M6 5V3.5M8 5V3.5M10 5V3.5M12 5V3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case "cpus":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "gpus":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="1.5" y="5" width="13" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M4 11v2.5M7 11v2.5M10 11v2.5M13 11v2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M5 7h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case "data-centers":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
  }
}
