import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import { importManifest } from "../src/adapters.mjs";
const dossier: Dossier = {
  id: "jev-insee-chiffre-preuve-demo",
  tolerance: 0,
  claim: {
    docId: "a",
    value: 2200,
    unit: "EUR/mois",
    period: "2025",
    territory: "France",
    statistic: "mediane",
    population:
      "Salaire net médian mensuel des salariés du privé en équivalent temps plein.",
  },
  observation: {
    docId: "b",
    value: 2200,
    unit: "EUR/mois",
    period: "2025",
    territory: "France",
    statistic: "mediane",
    definition:
      "La moitié des salariés du secteur privé en équivalent temps plein perçoit un salaire net mensuel inférieur à cette valeur.",
  },
  documents: [
    {
      id: "a",
      text: "2200\nEUR/mois\n2025\nFrance\nmediane\nSalaire net médian mensuel des salariés du privé en équivalent temps plein.",
      source: {
        uri: "fixture:a",
        date: "2026-10-06",
        kind: "synthetique",
        licence: "CC0-1.0",
      },
    },
    {
      id: "b",
      text: "2200\nEUR/mois\n2025\nFrance\nmediane\nLa moitié des salariés du secteur privé en équivalent temps plein perçoit un salaire net mensuel inférieur à cette valeur.",
      source: {
        uri: "fixture:b",
        date: "2026-10-06",
        kind: "synthetique",
        licence: "CC0-1.0",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "test-de-type" }),
});
const html: string = toHtml(report);
void html;
const imported: Dossier = await importManifest("examples/manifest.json");
void imported;
// @ts-expect-error Les champs métier sont obligatoires.
await analyze({ id: "vide", documents: [] });
