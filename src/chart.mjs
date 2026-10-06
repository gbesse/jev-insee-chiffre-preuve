import { plan } from "./index.mjs";
export function toSvg(input) {
  plan(input);
  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const values = [input.claim.value, input.observation.value];
  const min = Math.min(0, ...values),
    max = Math.max(0, ...values);
  const span = max - min || 1;
  const x = (v) => 100 + ((v - min) / span) * 520;
  const zero = x(0);
  const bar = (value, y, label, color) =>
    `<text x="100" y="${y - 12}" font-size="18">${esc(label)} : ${esc(value)} ${esc(input.observation.unit)}</text><rect x="${Math.min(zero, x(value))}" y="${y}" width="${Math.abs(x(value) - zero)}" height="40" fill="${color}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="740" height="300" viewBox="0 0 740 300" role="img" aria-label="Comparaison de l’affirmation et de l’observation"><rect width="740" height="300" fill="#f3f5f8"/><g font-family="sans-serif" fill="#182433"><text x="40" y="40" font-size="22">${esc(input.observation.territory)} · ${esc(input.observation.period)}</text>${bar(values[0], 95, "Affirmation", "#7a8aa5")}${bar(values[1], 175, "Observation sélectionnée", "#345bea")}<line x1="${zero}" x2="${zero}" y1="70" y2="220" stroke="#182433"/><text x="40" y="260" font-size="14">${esc(input.observation.statistic)} · source : ${esc(input.documents.find((d) => d.id === input.observation.docId).source.uri)}</text></g></svg>`;
}
