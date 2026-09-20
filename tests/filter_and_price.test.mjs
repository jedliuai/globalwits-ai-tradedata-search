import assert from "node:assert/strict";
import test from "node:test";
import { filterAndPrice } from "../scripts/filter_and_price.mjs";

test("includes sterile fosfomycin sodium and calculates prices", () => {
  const result = filterAndPrice([{ ProductDesc1: "FOSFOMYCIN SODIUM JP (STERILE)", UnitPrice: "280.0000", WT: "25.00", UNIT: "KGM" }]);
  assert.equal(result.summary.included, 1);
  assert.equal(result.included[0].normalized.rmbUnitPriceExTax, 1904);
  assert.equal(result.included[0].normalized.rmbUnitPriceTaxInclusive, 2151.52);
});

test("explicit non-sterile wording overrides the sterile keyword", () => {
  const result = filterAndPrice([{ ProductDesc1: "FOSFOMICINA SODICA NO ESTERIL", UnitPrice: 142.62, WT: 450, UNIT: "KGM" }]);
  assert.equal(result.summary.included, 0);
  assert.match(result.rejected[0].reason, /explicit exclusion/);
});

test("rejects unsupported package units", () => {
  const result = filterAndPrice([{ ProductDesc1: "FOSFOMYCIN SODIUM STERILE", UnitPrice: 100, QTY: 1, UNIT: "PKG" }]);
  assert.equal(result.summary.included, 0);
  assert.match(result.rejected[0].reason, /unsupported quantity unit/);
});
