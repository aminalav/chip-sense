/**
 * Pull trade flow values from the UN Comtrade public preview API and merge
 * into src/data/trade-flows.json. Taiwan bilateral rows are often empty in
 * Comtrade; those flows use MOF / U.S. trade statistics (see OVERRIDES).
 *
 * Usage: node scripts/fetch-comtrade-trade.mjs [--write]
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tradePath = path.join(root, "src/data/trade-flows.json");
const write = process.argv.includes("--write");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @type {Record<string, { reporter: string; partner: string; cmd: string; flow: "X" | "M"; mirrorUsImport?: boolean }>} */
const QUERIES = {
  "trade-tw-us-ics-2023": {
    reporter: "158",
    partner: "842",
    cmd: "8542",
    flow: "X",
  },
  "trade-kr-us-memory-2023": {
    reporter: "410",
    partner: "842",
    cmd: "8542",
    flow: "X",
    mirrorUsImport: true,
  },
  "trade-cn-us-ics-2023": {
    reporter: "156",
    partner: "842",
    cmd: "8542",
    flow: "X",
    mirrorUsImport: true,
  },
  "trade-us-cn-equipment-2023": {
    reporter: "842",
    partner: "156",
    cmd: "8486",
    flow: "X",
  },
  "trade-nl-cn-equipment-2023": {
    reporter: "528",
    partner: "156",
    cmd: "8486",
    flow: "X",
  },
  "trade-kr-cn-memory-2023": {
    reporter: "410",
    partner: "156",
    cmd: "8542",
    flow: "X",
  },
  "trade-tw-cn-ics-2023": {
    reporter: "158",
    partner: "156",
    cmd: "8542",
    flow: "X",
  },
  "trade-us-tw-equipment-2023": {
    reporter: "842",
    partner: "158",
    cmd: "8486",
    flow: "X",
  },
};

/**
 * Manual values when Comtrade preview returns no Taiwan bilateral rows.
 * @type {Record<string, { value_usd_millions: number; note: string; source_ids: string[] }>}
 */
const OVERRIDES = {
  "trade-tw-us-ics-2023": {
    value_usd_millions: 48760,
    source_ids: ["un-comtrade-plus", "us-census-foreign-trade"],
    note:
      "Comtrade preview has no TW→US HS8542 rows; value ≈ U.S. imports of HTS 8542 from Taiwan (2023), per Census foreign-trade / industry trade summaries.",
  },
  "trade-tw-cn-ics-2023": {
    value_usd_millions: 91641,
    source_ids: ["un-comtrade-plus", "taiwan-mof-trade-2023"],
    note:
      "Comtrade preview has no TW→CN HS8542 rows; estimate ≈ Taiwan IC exports (MOF 2023, US$166.6B) × ~55% to mainland China/Hong Kong (USTBC semiconductor trade report pattern).",
  },
  "trade-us-tw-equipment-2023": {
    value_usd_millions: 10200,
    source_ids: ["un-comtrade-plus", "taiwan-cbc-bop-2023"],
    note:
      "Comtrade preview has no US→TW HS8486 rows; order-of-magnitude from Taiwan imports from U.S. (CBC 2023, US$40.7B) and machinery/equipment share (USITC Taiwan trade overview).",
  },
};

async function comtradeSum(reporter, partner, cmd, flow) {
  const params = new URLSearchParams({
    reportercode: reporter,
    flowCode: flow,
    period: "2023",
    cmdCode: cmd,
    partnerCode: partner,
    maxRecords: "500",
    format: "JSON",
    breakdownMode: "classic",
  });
  const url = `https://comtradeapi.un.org/public/v1/preview/C/A/HS?${params}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.statusCode === 429) {
    throw new Error("Comtrade rate limit — retry in a few seconds");
  }
  const rows = json.data ?? [];
  const sum = rows.reduce((s, row) => s + (row.primaryValue ?? 0), 0);
  return { usdMillions: Math.round((sum / 1e6) * 10) / 10, count: json.count ?? rows.length };
}

const trade = JSON.parse(fs.readFileSync(tradePath, "utf8"));
const pulled = {};

for (const flow of trade.flows) {
  const q = QUERIES[flow.id];
  const override = OVERRIDES[flow.id];
  if (!q) {
    console.warn(`No query for ${flow.id}`);
    continue;
  }

  let reporter = q.reporter;
  let partner = q.partner;
  let flowCode = q.flow;
  let label = `${flow.id} (${reporter} ${flowCode} → ${partner} ${q.cmd})`;

  if (q.mirrorUsImport) {
    reporter = "842";
    partner = q.reporter;
    flowCode = "M";
    label += " [US import mirror]";
  }

  await sleep(1500);
  let result;
  try {
    result = await comtradeSum(reporter, partner, q.cmd, flowCode);
  } catch (err) {
    console.error(flow.id, err.message);
    result = { usdMillions: 0, count: 0 };
  }

  if (result.usdMillions > 0) {
    flow.value_usd_millions = result.usdMillions;
    const suffix = `Comtrade preview API, ${label}, pulled ${new Date().toISOString().slice(0, 10)}.`;
    flow.notes = flow.notes ? `${flow.notes} ${suffix}` : suffix;
    pulled[flow.id] = { source: "comtrade", ...result };
    console.log(flow.id, result.usdMillions, "M USD", `(${result.count} rows)`);
  } else if (override) {
    flow.value_usd_millions = override.value_usd_millions;
    flow.source_ids = [...new Set([...(flow.source_ids ?? []), ...override.source_ids])];
    flow.notes = override.note;
    pulled[flow.id] = { source: "override", usdMillions: override.value_usd_millions };
    console.log(flow.id, override.value_usd_millions, "M USD (override)");
  } else {
    console.log(flow.id, "no data");
    pulled[flow.id] = { source: "missing" };
  }
}

trade.updated = new Date().toISOString().slice(0, 10);
trade.methodology =
  "UN Comtrade public preview API (HS 8542 / 8486, 2023). Taiwan bilateral rows often empty — MOF / U.S. Census overrides documented per flow. Re-run: node scripts/fetch-comtrade-trade.mjs --write";

if (write) {
  fs.writeFileSync(tradePath, `${JSON.stringify(trade, null, 2)}\n`);
  console.log("\nWrote", tradePath);
} else {
  console.log("\nDry run — pass --write to update trade-flows.json");
  console.log(JSON.stringify(pulled, null, 2));
}
