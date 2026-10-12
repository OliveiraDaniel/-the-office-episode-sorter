import { useMemo, useState } from "react";
import { getEpisodes, getMainCharacters, getSeasons } from "./api.js";
import FilterPanel from "./components/FilterPanel.jsx";
import SlotMachine from "./components/SlotMachine.jsx";
import EpisodeCard from "./components/EpisodeCard.jsx";
import theOfficeLogo from "./assets/the-office-logo.png";
import "./App.css";

const seasons = getSeasons();
const characters = getMainCharacters();

export default function App() {
  const [mode, setMode] = useState("all");
  const [seasonId, setSeasonId] = useState(null);
  const [characterId, setCharacterId] = useState(null);
  const [result, setResult] = useState(null);

  const pool = useMemo(() => {
    if (mode === "season" && !seasonId) return [];
    if (mode === "character" && !characterId) return [];
    return getEpisodes({ mode, seasonId, characterId });
  }, [mode, seasonId, characterId]);

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setResult(null);
  }

  return (
    <div className="app">
      <header className="app__header">
        <img className="app__logo" src={theOfficeLogo} alt="The Office" />
        <h1>Sorteio de Episódios</h1>
        <p>Clique em Girar e deixe o acaso escolher seu próximo episódio.</p>
      </header>

      <FilterPanel
        mode={mode}
        onModeChange={handleModeChange}
        seasons={seasons}
        seasonId={seasonId}
        onSeasonChange={setSeasonId}
        characters={characters}
        characterId={characterId}
        onCharacterChange={setCharacterId}
        episodeCount={pool.length}
      />

      <SlotMachine pool={pool} onResult={setResult} />

      <EpisodeCard episode={result} />
    </div>
  );
}
