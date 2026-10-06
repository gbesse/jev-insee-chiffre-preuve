import { readFile, mkdir, writeFile } from "node:fs/promises";
import { toSvg } from "../src/chart.mjs";
const input = JSON.parse(
  await readFile(new URL("./dossier.json", import.meta.url), "utf8"),
);
await mkdir(new URL("../reports/private/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../reports/private/comparaison.svg", import.meta.url),
  toSvg(input),
  { mode: 0o600 },
);
console.log(
  "Graphique : reports/private/comparaison.svg — données synthétiques",
);
