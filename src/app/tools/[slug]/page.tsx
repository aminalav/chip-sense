import Link from "next/link";
import { notFound } from "next/navigation";
import { EstimateBanner } from "@/components/estimators/EstimateBanner";
import { EstimatorTool, EstimatorsNav } from "@/components/estimators/EstimatorShell";
import { ESTIMATORS, getEstimator, isEstimatorId } from "@/data/estimators/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ESTIMATORS.map((e) => ({ slug: e.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = getEstimator(slug);
  return {
    title: tool ? `${tool.title} — Chip Sense` : "Estimator — Chip Sense",
    description: tool?.short,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  if (!isEstimatorId(slug)) notFound();
  const tool = getEstimator(slug)!;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Chip Sense
          </Link>
          {" / "}
          <Link href="/tools" className="hover:underline">
            Tools
          </Link>
          {" / "}
          {tool.title}
        </p>
        <EstimatorsNav activeId={tool.id} />
      </header>

      <EstimateBanner />
      <EstimatorTool id={tool.id} />

      <footer className="border-t border-white/10 pt-4 text-xs text-[var(--muted)]">
        <Link href="/tools" className="text-[var(--accent)] underline-offset-2 hover:underline">
          ← All estimate tools
        </Link>
        {" · "}
        <Link href="/estimators" className="text-[var(--accent)] underline-offset-2 hover:underline">
          Methodology
        </Link>
      </footer>
    </main>
  );
}
