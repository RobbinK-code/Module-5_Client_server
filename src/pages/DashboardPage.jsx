import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWatchlist } from "../api/watchlist";
import Loader from "../components/common/Loader";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchlist().then((res) => setWatchlist(res.data)).finally(() => setLoading(false));
  }, []);

  const watching = watchlist.filter((w) => w.status === "watching").length;
  const completed = watchlist.filter((w) => w.status === "completed").length;

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Personal Dashboard</span>
        <h1>Welcome back, {user?.username}</h1>
      </div>

      {loading ? (
        <Loader label="Loading your stats" />
      ) : (
        <div className="dashboard-grid">
          <div className="stat-panel">
            <span className="eyebrow">On watchlist</span>
            <div className="stat-value">{watchlist.length}</div>
          </div>
          <div className="stat-panel">
            <span className="eyebrow">Currently watching</span>
            <div className="stat-value">{watching}</div>
          </div>
          <div className="stat-panel">
            <span className="eyebrow">Completed</span>
            <div className="stat-value">{completed}</div>
          </div>
        </div>
      )}

      <div className="section-heading"><h2>Quick links</h2></div>
      <div className="quick-links" style={{ marginTop: 24 }}>
        <Link to="/watchlist" className="quick-link">
          <h4>My Watchlist</h4>
          <p>Manage what you're watching and what's next.</p>
        </Link>
        <Link to="/reviews/mine" className="quick-link">
          <h4>My Reviews</h4>
          <p>Edit or remove reviews you've written.</p>
        </Link>
        <Link to="/profile" className="quick-link">
          <h4>Profile Settings</h4>
          <p>Update your bio, avatar, and username.</p>
        </Link>
        {isAdmin && (
          <Link to="/admin/anime/new" className="quick-link">
            <h4>Add New Anime</h4>
            <p>Add a title to the catalog.</p>
          </Link>
        )}
        <Link to="/" className="quick-link">
          <h4>Browse Catalog</h4>
          <p>Find something new to watch.</p>
        </Link>
      </div>
    </div>
  );
}
