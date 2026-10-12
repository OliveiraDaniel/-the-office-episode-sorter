const BASE = "/api";

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error on ${path}: ${res.status}`);
  return res.json();
}

export const getSeasons = () => getJson("/seasons");
export const getMainCharacters = () => getJson("/characters/main");

export function getEpisodes({ mode, seasonId, characterId }) {
  if (mode === "season" && seasonId) return getJson(`/episodes?season=${seasonId}`);
  if (mode === "character" && characterId) return getJson(`/episodes?characterId=${characterId}`);
  return getJson("/episodes");
}
