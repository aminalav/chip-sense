import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const graphPath = path.join(root, "src/data/seed-graph.json");
const sourcesPath = path.join(root, "src/data/sources.json");
const fabSitesPath = path.join(root, "src/data/fab-sites.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const graph = readJson(graphPath);
const sources = readJson(sourcesPath);
const fabSites = readJson(fabSitesPath);

const sourceIdSet = new Set(sources.map((s) => s.id));
const errors = [];
let factsWithSourceIds = 0;
let fabSourceRefs = 0;

for (const edge of graph.edges ?? []) {
  if (!edge.facts) continue;

  for (const [factKey, fact] of Object.entries(edge.facts)) {
    const ids = fact?.source_ids ?? [];
    if (!Array.isArray(ids)) {
      errors.push(
        `[${edge.id}.${factKey}] source_ids must be an array when present`,
      );
      continue;
    }

    if (ids.length > 0) factsWithSourceIds += 1;

    for (const sourceId of ids) {
      if (typeof sourceId !== "string" || sourceId.trim() === "") {
        errors.push(
          `[${edge.id}.${factKey}] source_id must be a non-empty string`,
        );
        continue;
      }
      if (!sourceIdSet.has(sourceId)) {
        errors.push(
          `[${edge.id}.${factKey}] unknown source_id "${sourceId}" (not in sources.json)`,
        );
      }
    }
  }
}

for (const site of fabSites) {
  const ids = site.source_ids ?? [];
  if (!Array.isArray(ids)) {
    errors.push(`[${site.id}] source_ids must be an array when present`);
    continue;
  }
  for (const sourceId of ids) {
    fabSourceRefs += 1;
    if (!sourceIdSet.has(sourceId)) {
      errors.push(
        `[fab ${site.id}] unknown source_id "${sourceId}" (not in sources.json)`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("Source validation failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(
  `Source validation passed. ${factsWithSourceIds} seed fact block(s) + ${fabSourceRefs} fab source_id ref(s); ${fabSites.length} fab sites.`,
);
