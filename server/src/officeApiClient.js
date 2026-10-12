const BASE_URL = process.env.OFFICE_API_BASE ?? "https://theofficeapi.dev/api";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // show data never changes; refresh twice a day

async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`theofficeapi.dev request failed: ${path} -> ${res.status}`);
  }
  return res.json();
}

async function fetchAllPages(path) {
  const results = [];
  let page = 1;
  while (true) {
    const data = await fetchJson(`${path}${path.includes("?") ? "&" : "?"}page=${page}`);
    results.push(...data.results);
    if (!data.meta || data.meta.isLastPage) break;
    page = data.meta.nextPage;
  }
  return results;
}

function makeCache(loader) {
  let entry = null; // { value, expiresAt }
  let pending = null;

  return async function get() {
    if (entry && entry.expiresAt > Date.now()) return entry.value;
    if (!pending) {
      pending = loader()
        .then((value) => {
          entry = { value, expiresAt: Date.now() + CACHE_TTL_MS };
          return value;
        })
        .finally(() => {
          pending = null;
        });
    }
    return pending;
  };
}

export const getSeasons = makeCache(() => fetchJson("/seasons"));
export const getAllEpisodes = makeCache(() => fetchAllPages("/episodes"));
export const getAllCharacters = makeCache(() => fetchAllPages("/characters"));
