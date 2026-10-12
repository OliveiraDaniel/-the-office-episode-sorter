import cors from "cors";
import express from "express";
import { getAllCharacters, getAllEpisodes, getSeasons } from "./officeApiClient.js";
import { MAIN_CHARACTER_NAMES } from "./mainCharacters.js";
import { buildTitleIndex, episodesInRange, resolveAppearanceRange } from "./episodeRanges.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());

app.get("/api/seasons", async (_req, res, next) => {
  try {
    res.json(await getSeasons());
  } catch (err) {
    next(err);
  }
});

app.get("/api/characters/main", async (_req, res, next) => {
  try {
    const [characters, episodes] = await Promise.all([getAllCharacters(), getAllEpisodes()]);
    const titleIndex = buildTitleIndex(episodes);

    const byName = new Map(characters.map((c) => [c.name, c]));
    const main = MAIN_CHARACTER_NAMES.map((name) => byName.get(name))
      .filter(Boolean)
      .map((character) => ({
        id: character.id,
        name: character.name,
        actor: character.actor,
        hasEpisodeRange: resolveAppearanceRange(character, titleIndex) !== null,
      }));

    res.json(main);
  } catch (err) {
    next(err);
  }
});

app.get("/api/episodes", async (req, res, next) => {
  try {
    const episodes = await getAllEpisodes();
    const { season, characterId } = req.query;

    if (season) {
      const seasonId = Number(season);
      return res.json(episodes.filter((e) => e.seasonId === seasonId));
    }

    if (characterId) {
      const characters = await getAllCharacters();
      const character = characters.find((c) => c.id === Number(characterId));
      if (!character) return res.status(404).json({ error: "Character not found" });

      const titleIndex = buildTitleIndex(episodes);
      const range = resolveAppearanceRange(character, titleIndex);
      if (!range) return res.json([]);

      return res.json(episodesInRange(episodes, range));
    }

    res.json(episodes);
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(502).json({ error: err.message ?? "Upstream error" });
});

app.listen(PORT, () => {
  console.log(`Office Roulette API listening on http://localhost:${PORT}`);
});
