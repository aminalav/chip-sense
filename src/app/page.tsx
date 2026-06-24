import { BoardDisclaimer } from "@/components/BoardDisclaimer";
import { ClientHomeDashboard } from "@/components/ClientBoardSections";
import { loadGraph } from "@/lib/graphQueries";
import { COMPANY_RECORDS } from "@/lib/companyRecords";
import { loadSources } from "@/lib/sourceQueries";

export default function Home() {
  const graph = loadGraph();
  const sources = loadSources();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
          Chip Sense
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Semiconductor supply chain board
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          Global baseline map of registry companies, cited fabs, and countries. Select a
          scenario to stress the graph, or use a track lens to narrow the view.
        </p>
      </header>

      <ClientHomeDashboard
        graphNodes={graph.nodes}
        graphEdges={graph.edges}
        scenarios={graph.scenarios}
        sourceCatalogCount={sources.length}
        sourceRecords={sources}
      />

      <footer className="space-y-2 border-t border-white/10 pt-4">
        <BoardDisclaimer />
        <p className="text-xs text-[var(--muted)]">
          Registry: {COMPANY_RECORDS.length} companies ·{" "}
          <a
            href="https://github.com/aminalav/chip-sense/blob/main/SOURCES.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Sourcing rules
          </a>
          {" · "}
          <a
            href="https://github.com/aminalav/chip-sense/blob/main/DATA_COVERAGE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Data coverage
          </a>
        </p>
      </footer>
    </main>
  );
}
