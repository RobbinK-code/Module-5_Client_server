import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getWatchlist, updateWatchlistItem, removeFromWatchlist } from "../api/watchlist";
import Loader from "../components/common/Loader";

const STATUS_LABELS = {
  plan_to_watch: "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getWatchlist();
    setItems(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (item, status) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status } : i)));
    await updateWatchlistItem(item.id, { status });
  };

  const handleRemove = async (item) => {
    if (!window.confirm(`Remove "${item.anime.title}" from your watchlist?`)) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await removeFromWatchlist(item.id);
  };

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Personal Watchlist</span>
        <h1>Your Watchlist</h1>
      </div>

      {loading ? (
        <Loader label="Loading watchlist" />
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>Your watchlist is empty</h3>
          <p>Browse the catalog and add titles you want to keep track of.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Catalog</Link>
        </div>
      ) : (
        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/anime/${item.anime.id}`} className="wt-title">{item.anime.title}</Link>
                </td>
                <td>
                  <select value={item.status} onChange={(e) => handleStatusChange(item, e.target.value)}>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="mono">{new Date(item.added_at).toLocaleDateString()}</td>
                <td>
                  <button className="wt-remove" onClick={() => handleRemove(item)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
