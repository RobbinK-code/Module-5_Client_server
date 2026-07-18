import { useEffect, useState, useCallback } from "react";
import { listAnime } from "../api/anime";
import { listGenres } from "../api/genres";
import AnimeGrid from "../components/anime/AnimeGrid";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAnime({
        page,
        search: search || undefined,
        genre: genre || undefined,
        status: status || undefined,
      });
      setItems(res.data.items);
      setPages(res.data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search, genre, status]);

  useEffect(() => {
    listGenres().then((res) => setGenres(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAnime();
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">Volume 01 — The Catalog</span>
          <h1>
            Track every <span>series</span> you're watching
          </h1>
          <p>
            Browse the catalog, rate what you've finished, and build a watchlist
            for what's next.
          </p>

          <form className="hero-filters" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search anime"
            />
            <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} aria-label="Filter by genre">
              <option value="">All genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug}>{g.name}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
              <option value="">All statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <div className="container">
        {loading ? <Loader label="Loading catalog" /> : <AnimeGrid items={items} />}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>
    </>
  );
}
