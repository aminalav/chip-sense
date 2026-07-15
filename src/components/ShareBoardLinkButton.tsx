"use client";

import { useCallback, useState } from "react";

export function ShareBoardLinkButton() {
  const [message, setMessage] = useState<string | null>(null);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    } catch {
      setMessage("Copy failed");
    }
    window.setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={copyLink}
        title="Copy a shareable link to this board view"
        className="inline-flex items-center rounded-md border border-white/10 bg-[var(--background)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-white/20"
      >
        Copy link
      </button>
      {message ? (
        <span role="status" className="text-[10px] text-emerald-300">
          {message}
        </span>
      ) : null}
    </div>
  );
}
