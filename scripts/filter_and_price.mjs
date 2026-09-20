#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_REQUIRED = [
  "fosfomycin|fosfomicina|phosphomycin|磷霉素",
  "sodium|sodica|sodio|sodique|natrium|钠",
  "sterile|esteril|steril|aseptic|无菌",
];

const DEFAULT_EXCLUDED = ["no esteril", "non sterile", "not sterile", "nonsterile", "非无菌"];

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function firstValue(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== "") return record[key];
  }
  return null;
}

function matchesGroup(text, group) {
  return group.split("|").some((term) => text.includes(normalizeText(term)));
}

export function filterAndPrice(records, options = {}) {
  const exchangeRate = Number(options.exchangeRate ?? 6.8);
  const taxFactor = Number(options.taxFactor ?? 1.13);
  const requiredGroups = options.requiredGroups?.length ? options.requiredGroups : DEFAULT_REQUIRED;
  const excludedTerms = options.excludedTerms?.length ? options.excludedTerms : DEFAULT_EXCLUDED;

  if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) throw new Error("exchangeRate must be positive");
  if (!Number.isFinite(taxFactor) || taxFactor <= 0) throw new Error("taxFactor must be positive");

  const included = [];
  const rejected = [];

  for (const record of records) {
    const description = firstValue(record, ["productDescription", "ProductDesc1", "货物描述"]);
    const text = normalizeText(description);
    const negative = excludedTerms.find((term) => text.includes(normalizeText(term)));
    if (negative) {
      rejected.push({ record, reason: `explicit exclusion: ${negative}` });
      continue;
    }

    const missing = requiredGroups.find((group) => !matchesGroup(text, group));
    if (missing) {
      rejected.push({ record, reason: `missing required group: ${missing}` });
      continue;
    }

    const unit = normalizeText(firstValue(record, ["unit", "UNIT", "单位"]));
    if (!["kgm", "kg", "kilogram", "kilograms"].includes(unit)) {
      rejected.push({ record, reason: `unsupported quantity unit: ${unit || "blank"}` });
      continue;
    }

    const unitPriceUsd = parseNumber(firstValue(record, ["unitPriceUsd", "UnitPrice", "单价($)"]));
    const quantityKg = parseNumber(firstValue(record, ["quantityKg", "WT", "weightKg", "千克重量", "QTY"]));
    if (unitPriceUsd === null || unitPriceUsd <= 0) {
      rejected.push({ record, reason: "invalid or zero USD unit price" });
      continue;
    }
    if (quantityKg === null || quantityKg <= 0) {
      rejected.push({ record, reason: "invalid or zero kilogram quantity" });
      continue;
    }

    included.push({
      ...record,
      normalized: {
        unitPriceUsd,
        quantityKg,
        exchangeRate,
        taxFactor,
        rmbUnitPriceExTax: round(unitPriceUsd * exchangeRate, 2),
        rmbUnitPriceTaxInclusive: round(unitPriceUsd * exchangeRate * taxFactor, 2),
      },
    });
  }

  return {
    summary: { searched: records.length, included: included.length, rejected: rejected.length },
    assumptions: { exchangeRate, taxFactor, requiredGroups, excludedTerms },
    included,
    rejected,
  };
}

function parseArgs(argv) {
  const options = { requiredGroups: [], excludedTerms: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--input") options.input = next, i += 1;
    else if (arg === "--output") options.output = next, i += 1;
    else if (arg === "--fx") options.exchangeRate = Number(next), i += 1;
    else if (arg === "--tax") options.taxFactor = Number(next), i += 1;
    else if (arg === "--required") options.requiredGroups.push(next), i += 1;
    else if (arg === "--exclude") options.excludedTerms.push(next), i += 1;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function usage() {
  return `Usage:
  node scripts/filter_and_price.mjs --input rows.json --output result.json [options]

Input: a JSON array, or {"records": [...]}.

Options:
  --fx <number>          Exchange rate, default 6.8
  --tax <number>        Tax-inclusive factor, default 1.13
  --required <a|b|c>    Repeatable required synonym group
  --exclude <phrase>    Repeatable explicit exclusion phrase
  -h, --help            Show help
`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  if (!options.input || !options.output) throw new Error("--input and --output are required");

  const raw = JSON.parse(await fs.readFile(options.input, "utf8"));
  const records = Array.isArray(raw) ? raw : raw.records;
  if (!Array.isArray(records)) throw new Error("Input must be a JSON array or an object with a records array");

  const result = filterAndPrice(records, options);
  await fs.mkdir(path.dirname(path.resolve(options.output)), { recursive: true });
  await fs.writeFile(options.output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result.summary)}\n`);
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isCli) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
