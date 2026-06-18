import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResearchBoardSection } from "@/components/ResearchBoardSection";
import { getTrack, TRACKS, isTrackSlug } from "@/data/tracks";
import { loadGraph } from "@/lib/graphQueries";
import { loadSources } from "@/lib/sourceQueries";

export function generateStaticParams() {
  return TRACKS.map((t) => ({ slug: t.slug }));
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isTrackSlug(slug)) notFound();

  const track = getTrack(slug)!;
  const graph = loadGraph();
  const baselineSources = loadSources();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            ← Global board
          </Link>
          <h1
            className="mt-2 text-3xl font-semibold tracking-tight"
            style={{ color: track.cssVar }}
          >
            {track.title}
          </h1>
          <p className="mt-2 max-w-xl text-[var(--muted)]">{track.short}</p>
        </div>
        <Link
          href={`/?track=${slug}`}
          className="shrink-0 rounded-lg border border-white/10 bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-white/20"
        >
          Open on global board
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex aspect-[2/1] max-h-[min(50vh,480px)] w-full items-center justify-center rounded-xl border border-white/10 bg-[var(--card)] text-sm text-[var(--muted)]">
            Loading board…
          </div>
        }
      >
        <ResearchBoardSection
          graphNodes={graph.nodes}
          graphEdges={graph.edges}
          scenarios={graph.scenarios}
          accentHex={track.accentHex}
          trackLens={slug}
          researchPointers={track.researchPointers}
          sourceCatalogCount={baselineSources.length}
          sourceRecords={baselineSources}
        />
      </Suspense>
    </main>
  );
}
