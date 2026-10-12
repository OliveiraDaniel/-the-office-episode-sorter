// One-off snapshot generator. The Office ended in 2013, so theofficeapi.dev's
// episode/character/season data is permanently static — there's no need to
// hit that API at runtime. Run this script to (re)generate the JSON files
// the client ships with. Only needed again if the upstream API fixes a typo
// or adds something new.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://theofficeapi.dev/api";
const OUT_DIR = fileURLToPath(new URL("../client/src/data", import.meta.url));

// Curated main cast, matched against the "name" field from /api/characters.
// The upstream API has no main/supporting/recurring flag, so this list is
// maintained by hand.
const MAIN_CHARACTER_NAMES = [
  "Michael Scott",
  "Jim Halpert",
  "Pam Beesly",
  "Dwight Schrute",
  "Andy Bernard",
  "Kevin Malone",
  "Angela Martin",
  "Oscar Martinez",
  "Stanley Hudson",
  "Phyllis Vance",
  "Creed Bratton",
  "Meredith Palmer",
  "Ryan Howard",
  "Kelly Kapoor",
  "Toby Flenderson",
  "Darryl Philbin",
  "Erin Hannon",
  "Holly Flax",
  "Jan Levinson",
  "David Wallace",
  "Robert California",
  "Nellie Bertram",
  "Gabe Lewis",
  "Pete Miller",
  "Clark Green",
];

async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
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

// Approximates "episodes featuring this character" as the inclusive range
// between their first and last appearance, since the API doesn't expose a
// per-episode cast list.
function resolveAppearanceRange(character, titleIndex) {
  const first = titleIndex.get(character.firstAppearance?.trim().toLowerCase());
  const last = titleIndex.get(character.lastAppearance?.trim().toLowerCase());
  if (!first || !last) return null;

  const start = Math.min(...first.map((e) => e.seriesEpisodeNumber));
  const end = Math.max(...last.map((e) => e.seriesEpisodeNumber));
  return start <= end ? { start, end } : null;
}

const [seasons, episodes, characters] = await Promise.all([
  fetchJson("/seasons"),
  fetchAllPages("/episodes"),
  fetchAllPages("/characters"),
]);

const titleIndex = new Map();
for (const episode of episodes) {
  const key = episode.title.trim().toLowerCase();
  if (!titleIndex.has(key)) titleIndex.set(key, []);
  titleIndex.get(key).push(episode);
}

const byName = new Map(characters.map((c) => [c.name, c]));
const mainCharacters = MAIN_CHARACTER_NAMES.map((name) => byName.get(name))
  .filter(Boolean)
  .map((character) => ({
    id: character.id,
    name: character.name,
    actor: character.actor,
    range: resolveAppearanceRange(character, titleIndex),
  }))
  .filter((c) => c.range !== null);

await mkdir(OUT_DIR, { recursive: true });
await writeFile(`${OUT_DIR}/seasons.json`, JSON.stringify(seasons, null, 2));
await writeFile(`${OUT_DIR}/episodes.json`, JSON.stringify(episodes, null, 2));
await writeFile(`${OUT_DIR}/mainCharacters.json`, JSON.stringify(mainCharacters, null, 2));

console.log(
  `Wrote ${seasons.length} seasons, ${episodes.length} episodes, ${mainCharacters.length} main characters to ${OUT_DIR}`
);
