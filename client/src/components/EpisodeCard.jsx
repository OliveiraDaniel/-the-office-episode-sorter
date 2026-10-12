import "./EpisodeCard.css";

export default function EpisodeCard({ episode }) {
  if (!episode) return null;

  const formattedDate = episode.airDate
    ? new Date(episode.airDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="episode-card">
      <header className="episode-card__header">
        <span className="episode-card__badge">
          Temporada {episode.seasonId} · Episódio {episode.episode}
        </span>
        {formattedDate && <span className="episode-card__date">{formattedDate}</span>}
      </header>
      <h2 className="episode-card__title">{episode.title}</h2>
      <p className="episode-card__summary">{episode.summary}</p>
    </article>
  );
}
