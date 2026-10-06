import {
  str,
  obj,
  arrays,
  rows,
  integer,
  finite,
  safe,
  money,
  sum,
  boolean,
  one,
  refs,
  semantic,
  check,
  date,
  addYears,
} from "./helpers.mjs";
export const LIMIT =
  "Une observation sélectionnée ne garantit pas que toutes les séries pertinentes ont été examinées. Source, révision et définition restent visibles.";
export function validateInput(x) {}
export function prepare(x) {
  obj(x.claim);
  obj(x.observation);
  const r = refs(x.claim, x.observation);
  const checks = [];
  for (const k of ["unit", "period", "territory", "statistic"]) {
    str(x.claim[k]);
    str(x.observation[k]);
    checks.push(
      check(k, "Périmètre : " + k, x.claim[k] === x.observation[k], r),
    );
  }
  finite(x.claim.value);
  finite(x.observation.value);
  finite(x.tolerance ?? 0, 0);
  checks.push(
    check(
      "valeur",
      "Valeur dans la tolérance déclarée",
      Math.abs(x.claim.value - x.observation.value) <= (x.tolerance ?? 0),
      r,
    ),
  );
  const pairs = [
    semantic(
      "population",
      "Population et définition",
      x.claim.population,
      x.observation.definition,
      r,
      "La définition statistique couvre-t-elle précisément la population et le concept de l’affirmation ?",
      true,
    ),
  ];
  return {
    checks,
    pairs,
    outputs: {
      fiche: {
        valeur: x.observation.value,
        unite: x.observation.unit,
        periode: x.observation.period,
        territoire: x.observation.territory,
        statistique: x.observation.statistic,
        definition: x.observation.definition,
      },
      ecartNumerique: x.claim.value - x.observation.value,
      tolerance: x.tolerance ?? 0,
    },
  };
}
