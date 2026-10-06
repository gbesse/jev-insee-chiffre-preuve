import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyze, plan } from "../src/index.mjs";
import { MODEL } from "../src/jev.mjs";
const cases = JSON.parse(
  await readFile(new URL("../corpus/cases.json", import.meta.url), "utf8"),
);
test("La combinaison métier suit les annotations avec un fournisseur simulé explicitement", async () => {
  for (const c of cases) {
    const provider = {
      decide: async ({ questions }) => ({
        model: MODEL,
        usage: { input_tokens: 1, output_tokens: 1 },
        answers: Object.fromEntries(
          Object.keys(questions).map((id) => {
            const choice = c.semantic[id];
            assert.ok(choice, "Annotation absente : " + id);
            return [
              id,
              {
                type: "choice",
                choice,
                confidence: 0.95,
                probabilities: Object.fromEntries(
                  ["etaye", "ecart", "a_revoir"].map((k) => [
                    k,
                    k === choice ? 0.98 : 0.01,
                  ]),
                ),
              },
            ];
          }),
        ),
      }),
    };
    const r = await analyze(c.input, { mode: "jev", provider });
    assert.equal(r.status, c.expected, c.input.id);
  }
});
test("Le statut de revue hors ligne conserve toutes les décisions exactes", async () => {
  for (const c of cases) {
    const r = await analyze(c.input);
    for (const [id, gold] of Object.entries(c.exact)) {
      assert.equal(
        r.findings.find((f) => f.id === id)?.status,
        gold,
        c.input.id + "/" + id,
      );
    }
  }
});
test("Une référence métier inconnue est rejetée même hors des paires", () => {
  const x = structuredClone(cases[0].input);
  function change(v) {
    if (!v || typeof v !== "object") return false;
    for (const [k, o] of Object.entries(v)) {
      if (k === "docId") {
        v[k] = "piece-inconnue";
        return true;
      }
      if (k !== "documents" && change(o)) return true;
    }
    return false;
  }
  assert.ok(change(x));
  assert.throws(() => plan(x), /inconnue/);
});

test("Le pourcentage et les points restent des unités distinctes", async () => {
  const x = structuredClone(cases[0].input);
  x.claim.unit = "pourcent";
  x.observation.unit = "points";
  const r = await analyze(x);
  assert.equal(r.findings.find((f) => f.id === "unit").status, "ecart");
  x.tolerance = -1;
  await assert.rejects(analyze(x), /Nombre/);
});
