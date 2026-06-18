/**
 * Regenerates DATA_COVERAGE.md from companies.json, fab-sites.json, seed-graph.json.
 * Run: npm run data:coverage
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const companies = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/companies.json"), "utf8"),
);
const fabSites = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/fab-sites.json"), "utf8"),
);
const graph = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/seed-graph.json"), "utf8"),
);
const sources = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/sources.json"), "utf8"),
);

const fabsByCompany = new Map();
for (const site of fabSites) {
  const list = fabsByCompany.get(site.company_id) ?? [];
  list.push(site);
  fabsByCompany.set(site.company_id, list);
}

const suppliesOut = new Map();
const suppliesIn = new Map();
for (const edge of graph.edges ?? []) {
  if (edge.kind !== "supplies") continue;
  if (!suppliesOut.has(edge.source)) suppliesOut.set(edge.source, []);
  suppliesOut.get(edge.source).push(edge);
  if (!suppliesIn.has(edge.target)) suppliesIn.set(edge.target, []);
  suppliesIn.get(edge.target).push(edge);
}

function edgeCited(edge) {
  if (!edge.facts) return false;
  return Object.values(edge.facts).some((f) => (f.source_ids?.length ?? 0) > 0);
}

const citedFacts = (graph.edges ?? []).filter((e) => edgeCited(e)).length;
const supplies = (graph.edges ?? []).filter((e) => e.kind === "supplies");
const equips = (graph.edges ?? []).filter((e) => e.kind === "equips");
const packages = (graph.edges ?? []).filter((e) => e.kind === "packages");
const memorySupply = (graph.edges ?? []).filter((e) => e.kind === "memory_supply");
const assembles = (graph.edges ?? []).filter((e) => e.kind === "assembles");
const suppliesCited = supplies.filter(edgeCited).length;
const equipsCited = equips.filter(edgeCited).length;
const packagesCited = packages.filter(edgeCited).length;
const memoryCited = memorySupply.filter(edgeCited).length;
const assemblesCited = assembles.filter(edgeCited).length;
const tradeFlowCount = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/trade-flows.json"), "utf8"),
).flows.length;

const lines = [
  "# Data coverage",
  "",
  "Auto-generated from `companies.json`, `fab-sites.json`, and `seed-graph.json`.",
  `Regenerate: \`npm run data:coverage\` · Updated: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "## Summary",
  "",
  "| Metric | Count |",
  "| --- | ---: |",
  `| Registry companies | ${companies.length} |`,
  `| Companies sourced (\`sourced: true\`) | ${companies.filter((c) => c.sourced).length} |`,
  `| Essay 1 must-show companies | ${companies.filter((c) => c.must_show_essay_1).length} |`,
  `| Fab / site pins | ${fabSites.length} |`,
  `| Fab pins with \`source_ids\` | ${fabSites.filter((s) => s.source_ids?.length).length} |`,
  `| Source catalog entries | ${sources.length} |`,
  `| Seed graph \`supplies\` edges | ${supplies.length} |`,
  `| Supplies edges cited | ${suppliesCited} |`,
  `| Seed graph \`equips\` edges | ${equips.length} |`,
  `| Equips edges cited | ${equipsCited} |`,
  `| Seed graph \`packages\` edges | ${packages.length} |`,
  `| Packages edges cited | ${packagesCited} |`,
  `| Seed graph \`memory_supply\` edges | ${memorySupply.length} |`,
  `| Memory supply edges cited | ${memoryCited} |`,
  `| Seed graph \`assembles\` edges | ${assembles.length} |`,
  `| Assembles edges cited | ${assemblesCited} |`,
  `| Comtrade trade flows | ${tradeFlowCount} |`,
  `| Seed edges with cited \`facts\` | ${citedFacts} |`,
  `| Scenarios | ${(graph.scenarios ?? []).length} (illustrative except baseline copy) |`,
  "",
  "See `SOURCES.md` for sourcing rules and `COMPANIES.md` for the human company table.",
  "",
  "## Company × fabs × supply",
  "",
  "| Company | Essay 1 | Sourced | Fab pins | Supplies out (cited?) | Supplies in |",
  "| --- | :---: | :---: | --- | --- | --- |",
];

for (const co of companies) {
  const fabs = fabsByCompany.get(co.id) ?? [];
  const fabLabels =
    fabs.length === 0
      ? "—"
      : fabs.map((f) => f.id.replace(/^fab-/, "")).join(", ");
  const out = suppliesOut.get(co.id) ?? [];
  const outStr =
    out.length === 0
      ? "—"
      : out
          .map((e) => {
            const target = graph.nodes.find((n) => n.id === e.target)?.label ?? e.target;
            return `${target}${edgeCited(e) ? " ✓" : ""}`;
          })
          .join("; ");
  const inn = suppliesIn.get(co.id) ?? [];
  const inStr =
    inn.length === 0
      ? "—"
      : inn
          .map((e) => {
            const source = graph.nodes.find((n) => n.id === e.source)?.label ?? e.source;
            return `${source}${edgeCited(e) ? " ✓" : ""}`;
          })
          .join("; ");
  lines.push(
    `| ${co.name} | ${co.must_show_essay_1 ? "Y" : ""} | ${co.sourced ? "Y" : ""} | ${fabLabels} | ${outStr} | ${inStr} |`,
  );
}

lines.push(
  "",
  "## Fab sites (all)",
  "",
  "| Fab ID | Operator | City / country | Essay 1 | source_ids |",
  "| --- | --- | --- | :---: | --- |",
);

for (const site of fabSites) {
  lines.push(
    `| \`${site.id}\` | ${site.company_id} | ${site.city}, ${site.country} | ${site.must_show_essay_1 ? "Y" : ""} | ${(site.source_ids ?? []).join(", ")} |`,
  );
}

for (const kind of ["supplies", "equips", "packages", "memory_supply", "assembles"]) {
  lines.push("", `## Cited \`${kind}\` edges`, "", "| Edge ID | Route | source_ids |", "| --- | --- | --- |");
  for (const edge of graph.edges ?? []) {
    if (edge.kind !== kind || !edgeCited(edge)) continue;
    const a = graph.nodes.find((n) => n.id === edge.source)?.label ?? edge.source;
    const b = graph.nodes.find((n) => n.id === edge.target)?.label ?? edge.target;
    const ids = [
      ...new Set(Object.values(edge.facts).flatMap((f) => f.source_ids ?? [])),
    ].join(", ");
    lines.push(`| \`${edge.id}\` | ${a} → ${b} | ${ids} |`);
  }
}

lines.push("");

const outPath = path.join(root, "DATA_COVERAGE.md");
fs.writeFileSync(outPath, lines.join("\n"));
console.log(`Wrote ${outPath}`);
