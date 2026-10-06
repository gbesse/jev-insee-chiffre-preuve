import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { toSvg } from "../src/chart.mjs";
const input = JSON.parse(
  await readFile(new URL("../examples/dossier.json", import.meta.url), "utf8"),
);
test("Le graphique conserve valeur, période et échappe les libellés", () => {
  const x = structuredClone(input);
  x.observation.territory = "<script>attaque</script>";
  const svg = toSvg(x);
  assert.ok(!svg.includes("<script>"));
  assert.ok(svg.includes("&lt;script&gt;"));
  assert.ok(svg.includes("2200"));
  x.claim.value = -5;
  x.observation.value = 0;
  assert.ok(!toSvg(x).includes("NaN"));
});
