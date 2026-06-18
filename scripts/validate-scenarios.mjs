/**
 * Validates scenario affects reference real graph nodes/edges (including fab-sites merge).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const seed = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/seed-graph.json"), "utf8"),
);
const fabSites = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/fab-sites.json"), "utf8"),
);

const nodeIds = new Set([
  ...seed.nodes.map((n) => n.id),
  ...fabSites.map((f) => f.id),
]);
const edgeIds = new Set(seed.edges.map((e) => e.id));

const errors = [];

for (const scenario of seed.scenarios) {
  if (!scenario.affects) continue;
  for (const [key, ids] of Object.entries(scenario.affects)) {
    for (const id of ids) {
      const isEdge = key.includes("edge");
      const ok = isEdge ? edgeIds.has(id) : nodeIds.has(id);
      if (!ok) {
        errors.push(`[${scenario.id}] ${key}: unknown id "${id}"`);
      }
    }
  }
}

if (errors.length) {
  console.error("Scenario validation failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(`Scenario validation passed (${seed.scenarios.length} scenarios).`);
