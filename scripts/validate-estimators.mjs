import fs from "node:fs";
import path from "node:path";

/**
 * Validates company ids referenced in the estimators catalog against companies.json.
 */

const root = process.cwd();
const companiesPath = path.join(root, "src/data/companies.json");
const catalogPath = path.join(root, "src/data/estimators/catalog.ts");

const companies = JSON.parse(fs.readFileSync(companiesPath, "utf8"));
const companyIds = new Set(companies.map((c) => c.id));
const catalogSrc = fs.readFileSync(catalogPath, "utf8");

const idMatches = [...catalogSrc.matchAll(/"co-[a-z0-9-]+"/g)].map((m) =>
  m[0].slice(1, -1),
);
const uniqueIds = [...new Set(idMatches)];
const errors = [];

for (const id of uniqueIds) {
  if (!companyIds.has(id)) {
    errors.push(`Unknown company id in estimators catalog: "${id}"`);
  }
}

const stressedBlock = catalogSrc.match(/stressedCompanyIds:\s*\[([\s\S]*?)\]/g);
if (!stressedBlock || stressedBlock.length === 0) {
  errors.push("No stressedCompanyIds arrays found in estimators catalog");
}

if (errors.length > 0) {
  console.error("Estimator catalog validation failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(
  `Estimator catalog validation passed. ${uniqueIds.length} company id(s) referenced; all resolve in companies.json.`,
);
