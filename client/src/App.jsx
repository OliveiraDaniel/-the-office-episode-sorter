import { useEffect, useState } from "react";
import { getEpisodes, getMainCharacters, getSeasons } from "./api.js";
import FilterPanel from "./components/FilterPanel.jsx";
import SlotMachine from "./components/SlotMachine.jsx";
import EpisodeCard from "./components/EpisodeCard.jsx";
import theOfficeLogo from "./assets/the-office-logo.png";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("all");
  const [seasons, setSeasons] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [seasonId, setSeasonId] = useState(null);
  const [characterId, setCharacterId] = useState(null);

  const [pool, setPool] = useState([]);
  const [loadingPool, setLoadingPool] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getSeasons().then(setSeasons).catch(() => setSeasons([]));
    getMainCharacters().then(setCharacters).catch(() => setCharacters([]));
  }, []);

  useEffect(() => {
    if (mode === "season" && !seasonId) {
      setPool([]);
      return;
    }
    if (mode === "character" && !characterId) {
      setPool([]);
      return;
    }

    setLoadingPool(true);
    getEpisodes({ mode, seasonId, characterId })
      .then(setPool)
      .catch(() => setPool([]))
      .finally(() => setLoadingPool(false));
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

      <SlotMachine pool={loadingPool ? [] : pool} onResult={setResult} />

      <EpisodeCard episode={result} />
    </div>
  );
}
