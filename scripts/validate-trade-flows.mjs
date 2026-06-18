import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tradePath = path.join(root, "src/data/trade-flows.json");
const sourcesPath = path.join(root, "src/data/sources.json");
const countriesPath = path.join(root, "src/data/countries.json");

const trade = JSON.parse(fs.readFileSync(tradePath, "utf8"));
const sources = new Set(JSON.parse(fs.readFileSync(sourcesPath, "utf8")).map((s) => s.id));
const countryIds = new Set(
  JSON.parse(fs.readFileSync(countriesPath, "utf8")).map((c) => c.id),
);

const errors = [];
const ranks = new Set(["high", "medium", "low"]);

for (const flow of trade.flows ?? []) {
  if (!flow.id) errors.push("Flow missing id");
  if (!countryIds.has(flow.exporter_country_id)) {
    errors.push(`[${flow.id}] unknown exporter ${flow.exporter_country_id}`);
  }
  if (!countryIds.has(flow.importer_country_id)) {
    errors.push(`[${flow.id}] unknown importer ${flow.importer_country_id}`);
  }
  if (!ranks.has(flow.rank)) errors.push(`[${flow.id}] invalid rank`);
  for (const sid of flow.source_ids ?? []) {
    if (!sources.has(sid)) errors.push(`[${flow.id}] unknown source_id ${sid}`);
  }
}

if (errors.length) {
  console.error("Trade flow validation failed:\n");
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log(`Trade flow validation passed. ${trade.flows.length} flows.`);
