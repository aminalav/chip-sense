import { BoardDisclaimer } from "@/components/BoardDisclaimer";
import { EditorialTracksBar } from "@/components/EditorialTracksBar";
import { EstimatorsLinkStrip } from "@/components/estimators/EstimatorsLinkStrip";
import { ClientHomeDashboard } from "@/components/ClientBoardSections";
import { loadGraph } from "@/lib/graphQueries";
import { COMPANY_RECORDS } from "@/lib/companyRecords";
import { loadSources } from "@/lib/sourceQueries";
import Link from "next/link";

export default function Home() {
  const graph = loadGraph();
  const sources = loadSources();

  return (
    <main className="mx-auto flex max-w-[90rem] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-[var(--accent)]">Chip Sense</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Semiconductor supply chain intelligence
        </h1>
        <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Explore companies, fabs, and cited supply relationships on an interactive map. Run
          stress scenarios, narrow by industry lens, and inspect sources in the panel beside the
          map.
        </p>
      </header>

      <EditorialTracksBar />

      <EstimatorsLinkStrip />

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
          {COMPANY_RECORDS.length} companies in registry ·{" "}
          <Link href="/tools" className="text-[var(--accent)] underline-offset-4 hover:underline">
            Estimate tools
          </Link>
          {" · "}
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
            href="https://github.com/aminalav/chip-sense/blob/main/NOTICE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Sources &amp; licensing
          </a>
          {" · "}
          <Link
            href="/estimators"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Estimator methodology
          </Link>
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
