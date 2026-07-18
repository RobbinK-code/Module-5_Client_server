import AnimeCard from "./AnimeCard";

export default function AnimeGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <h3>No anime found</h3>
        <p>Try a different search term or clear your filters.</p>
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
