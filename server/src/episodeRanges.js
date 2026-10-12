// Approximates "episodes featuring this character" as the inclusive range
// between their first and last appearance, since the upstream API does not
// expose a per-episode cast list.
export function buildTitleIndex(episodes) {
  const index = new Map();
  for (const episode of episodes) {
    const key = episode.title.trim().toLowerCase();
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(episode);
  }
  return index;
}

export function resolveAppearanceRange(character, titleIndex) {
  const first = titleIndex.get(character.firstAppearance?.trim().toLowerCase());
  const last = titleIndex.get(character.lastAppearance?.trim().toLowerCase());
  if (!first || !last) return null;

  const start = Math.min(...first.map((e) => e.seriesEpisodeNumber));
  const end = Math.max(...last.map((e) => e.seriesEpisodeNumber));
  if (start > end) return null;

  return { start, end };
}

export function episodesInRange(episodes, range) {
  return episodes.filter(
    (e) => e.seriesEpisodeNumber >= range.start && e.seriesEpisodeNumber <= range.end
  );
}
