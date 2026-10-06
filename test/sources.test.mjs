import test from "node:test";
import assert from "node:assert/strict";
import { fetchMelodi } from "../src/sources.mjs";
test("Melodi conserve les dimensions et la pagination", async () => {
  const r = await fetchMelodi(
    "https://api.insee.fr/melodi/data/DS_DEMO?maxResult=10",
    {
      fetchImpl: async () =>
        Response.json({
          observations: [
            {
              dimensions: { TIME_PERIOD: "2025" },
              measures: { OBS_VALUE: { value: 42 } },
            },
          ],
          paging: {
            count: 2,
            next: "https://api.insee.fr/melodi/data/DS_DEMO?page=2",
          },
        }),
    },
  );
  assert.equal(r.complete, false);
  assert.equal(r.total, 2);
  assert.ok(r.document.text.includes("TIME_PERIOD"));
});
test("Un autre domaine et une requête trop volumineuse sont rejetés", async () => {
  await assert.rejects(fetchMelodi("https://exemple.fr/data"), /URL/);
  await assert.rejects(
    fetchMelodi("https://api.insee.fr/melodi/data/DS_DEMO?maxResult=10000"),
    /Limiter/,
  );
});
