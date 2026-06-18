import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const companiesPath = path.join(root, "src/data/companies.json");

const ESSAY_1_COMPANY_IDS = [
  "co-tsmc",
  "co-samsung",
  "co-sk-hynix",
  "co-micron",
  "co-intel",
  "co-nvidia",
  "co-amd",
  "co-apple",
  "co-asml",
  "co-smic",
  "co-umc",
  "co-ase",
];

const PRIORITY_IDS = [
  "co-tsmc",
  "co-samsung",
  "co-intel",
  "co-nvidia",
  "co-amd",
  "co-apple",
  "co-asml",
  "co-sk-hynix",
  "co-micron",
  "co-smic",
];

const companies = JSON.parse(fs.readFileSync(companiesPath, "utf8"));
const errors = [];

if (!Array.isArray(companies) || companies.length < 15) {
  errors.push(`Expected at least 15 companies, found ${companies?.length ?? 0}`);
}

for (const row of companies) {
  if (!row.id || !row.name) {
    errors.push(`Row missing id or name: ${JSON.stringify(row)}`);
    continue;
  }
  if (!row.specialization?.trim()) {
    errors.push(`[${row.id}] missing specialization`);
  }
  if (!row.hq_country?.trim()) {
    errors.push(`[${row.id}] missing hq_country`);
  }
  if (!Array.isArray(row.operating_countries) || row.operating_countries.length === 0) {
    errors.push(`[${row.id}] needs at least one operating country`);
  }
  if (typeof row.sourced !== "boolean") {
    errors.push(`[${row.id}] sourced must be boolean`);
  }
  if (typeof row.must_show_essay_1 !== "boolean") {
    errors.push(`[${row.id}] must_show_essay_1 must be boolean`);
  }
}

for (const id of PRIORITY_IDS) {
  const row = companies.find((c) => c.id === id);
  if (!row) {
    errors.push(`Priority company missing: ${id}`);
    continue;
  }
  if (!row.sourced) {
    errors.push(`[${id}] priority company must be sourced=true`);
  }
  if (!row.source_url?.trim()) {
    errors.push(`[${id}] priority company needs source_url`);
  }
}

for (const row of companies) {
  if (!row.sourced) {
    errors.push(`[${row.id}] all companies must be sourced=true`);
  }
  if (!row.source_url?.trim()) {
    errors.push(`[${row.id}] missing source_url`);
  }
}

const mustShow = companies.filter((c) => c.must_show_essay_1);
if (mustShow.length !== ESSAY_1_COMPANY_IDS.length) {
  errors.push(
    `Expected exactly ${ESSAY_1_COMPANY_IDS.length} must_show_essay_1 companies, found ${mustShow.length}`,
  );
}
for (const id of ESSAY_1_COMPANY_IDS) {
  const row = companies.find((c) => c.id === id);
  if (!row?.must_show_essay_1) {
    errors.push(`[${id}] must be must_show_essay_1=true (essay-1 teaching view)`);
  }
}
for (const row of mustShow) {
  if (!ESSAY_1_COMPANY_IDS.includes(row.id)) {
    errors.push(`[${row.id}] must_show_essay_1=true but not in essay-1 list — remove flag or update ESSAY_1_COMPANY_IDS`);
  }
}

if (errors.length > 0) {
  console.error("Company validation failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

const sourcedCount = companies.filter((c) => c.sourced).length;
console.log(
  `Company validation passed. ${companies.length} companies, ${sourcedCount} sourced, ${mustShow.length} must-show on essay 1 map.`,
);
