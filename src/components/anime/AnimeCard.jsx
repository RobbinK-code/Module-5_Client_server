import { Link } from "react-router-dom";
import RatingStamp from "../common/RatingStamp";

export default function AnimeCard({ anime }) {
  const coverStyle = anime.cover_image
    ? { backgroundImage: `url(${anime.cover_image})` }
    : undefined;

  return (
    <Link to={`/anime/${anime.id}`} className="anime-card">
      <div className="anime-card-cover" style={coverStyle}>
        <span className={`status-pill ${anime.status}`}>{anime.status.replace("_", " ")}</span>
      </div>
      <div className="anime-card-body">
        <h3>{anime.title}</h3>
        <div className="anime-card-meta">
          <span>{anime.release_year || "TBA"} · {anime.studio || "Unknown studio"}</span>
          <RatingStamp value={anime.average_rating} size="small" />
        </div>
      </div>
    </Link>
  );
}
