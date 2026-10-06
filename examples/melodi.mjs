import { fetchMelodi } from "../src/sources.mjs";
if (!process.argv.includes("--live"))
  console.log("Ajouter --live pour interroger un petit jeu public INSEE.");
else {
  const r = await fetchMelodi(
    "https://api.insee.fr/melodi/data/DS_POPULATIONS_REFERENCE?GEO=FRANCE-F&maxResult=10",
  );
  console.log(JSON.stringify(r, null, 2));
}
