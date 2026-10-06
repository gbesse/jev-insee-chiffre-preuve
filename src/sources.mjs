import { getJson, document } from "./io.mjs";
export async function fetchMelodi(url, { fetchImpl, signal } = {}) {
  const u = new URL(url);
  if (
    u.origin !== "https://api.insee.fr" ||
    !/^\/melodi\/data\/[A-Za-z0-9_]+$/.test(u.pathname) ||
    u.username ||
    u.password
  )
    throw new TypeError("URL de données Melodi requise");
  const max = Number(u.searchParams.get("maxResult") ?? 100);
  if (!Number.isInteger(max) || max < 1 || max > 100)
    throw new TypeError("Limiter maxResult de 1 à 100");
  u.searchParams.set("maxResult", String(max));
  u.searchParams.set("totalCount", "true");
  const raw = await getJson(u.href, { fetchImpl, signal });
  if (
    !Array.isArray(raw.observations) ||
    !Number.isSafeInteger(raw.paging?.count) ||
    raw.paging.count < raw.observations.length
  )
    throw new TypeError("Réponse Melodi invalide");
  const complete =
    !raw.paging.next && raw.observations.length === raw.paging.count;
  return {
    raw,
    complete,
    total: raw.paging.count,
    document: document("melodi", JSON.stringify(raw), {
      uri: u.href,
      kind: "donnee-publique",
      licence: "Licence Ouverte 2.0 ; vérifier les conditions INSEE",
    }),
  };
}
