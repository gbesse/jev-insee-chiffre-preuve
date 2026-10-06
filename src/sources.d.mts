import type { Document } from "./index.mjs";
export function fetchMelodi(
  url: string,
  options?: { fetchImpl?: typeof fetch; signal?: AbortSignal },
): Promise<{
  raw: unknown;
  complete: boolean;
  total: number;
  document: Document;
}>;
