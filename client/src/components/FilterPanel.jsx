import "./FilterPanel.css";

export default function FilterPanel({
  mode,
  onModeChange,
  seasons,
  seasonId,
  onSeasonChange,
  characters,
  characterId,
  onCharacterChange,
  episodeCount,
}) {
  return (
    <div className="filter-panel">
      <div className="filter-panel__modes">
        <button
          type="button"
          className={mode === "all" ? "mode-btn mode-btn--active" : "mode-btn"}
          onClick={() => onModeChange("all")}
        >
          Todos
        </button>
        <button
          type="button"
          className={mode === "season" ? "mode-btn mode-btn--active" : "mode-btn"}
          onClick={() => onModeChange("season")}
        >
          Por Temporada
        </button>
        <button
          type="button"
          className={mode === "character" ? "mode-btn mode-btn--active" : "mode-btn"}
          onClick={() => onModeChange("character")}
        >
          Por Personagem
        </button>
      </div>

      {mode === "season" && (
        <select
          className="filter-panel__select"
          value={seasonId ?? ""}
          onChange={(e) => onSeasonChange(Number(e.target.value))}
        >
          <option value="" disabled>
            Escolha a temporada...
          </option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              Temporada {season.number}
            </option>
          ))}
        </select>
      )}

      {mode === "character" && (
        <select
          className="filter-panel__select"
          value={characterId ?? ""}
          onChange={(e) => onCharacterChange(Number(e.target.value))}
        >
          <option value="" disabled>
            Escolha o personagem...
          </option>
          {characters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
        </select>
      )}

      <p className="filter-panel__count">
        {episodeCount} episódio{episodeCount === 1 ? "" : "s"} no sorteio
      </p>
    </div>
  );
}
