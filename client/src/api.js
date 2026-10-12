// The show ended in 2013, so this data never changes — it ships as a static
// snapshot (see scripts/fetch-office-data.mjs) instead of being fetched at
// runtime. No backend, no network calls, no loading states needed.
import episodes from "./data/episodes.json";
import mainCharacters from "./data/mainCharacters.json";
import seasons from "./data/seasons.json";

export function getSeasons() {
  return seasons;
}

export function getMainCharacters() {
  return mainCharacters;
}

export function getEpisodes({ mode, seasonId, characterId }) {
  if (mode === "season" && seasonId) {
    return episodes.filter((e) => e.seasonId === seasonId);
  }

  if (mode === "character" && characterId) {
    const character = mainCharacters.find((c) => c.id === characterId);
    if (!character) return [];
    const { start, end } = character.range;
    return episodes.filter((e) => e.seriesEpisodeNumber >= start && e.seriesEpisodeNumber <= end);
  }

  return episodes;
}
