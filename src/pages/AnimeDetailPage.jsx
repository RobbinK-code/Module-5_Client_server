import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAnime, deleteAnime } from "../api/anime";
import { listReviewsForAnime, createReview, updateReview, deleteReview } from "../api/reviews";
import { addToWatchlist } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import RatingStamp from "../components/common/RatingStamp";
import GenreTag from "../components/common/GenreTag";
import Loader from "../components/common/Loader";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewForm from "../components/reviews/ReviewForm";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [anime, setAnime] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [watchlistMsg, setWatchlistMsg] = useState("");
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [animeRes, reviewsRes] = await Promise.all([
      getAnime(id),
      listReviewsForAnime(id),
    ]);
    setAnime(animeRes.data);
    setReviews(reviewsRes.data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const myExistingReview = reviews.find((r) => r.user_id === user?.id);

  const handleCreateOrUpdate = async (payload) => {
    if (editingReview) {
      await updateReview(editingReview.id, payload);
    } else {
      await createReview(id, payload);
    }
    setShowForm(false);
    setEditingReview(null);
    await load();
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(review.id);
    await load();
  };

  const handleDeleteAnime = async () => {
    if (!window.confirm(`Delete "${anime.title}" permanently?`)) return;
    setActionError("");
    try {
      await deleteAnime(id);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setActionError("Your session has expired. Please log out and log back in, then try again.");
      } else {
        setActionError(err.response?.data?.error || "Could not delete this anime.");
      }
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist(id);
      setWatchlistMsg("Added to your watchlist.");
    } catch (err) {
      if (err.response?.status === 401) {
        setWatchlistMsg("Your session has expired. Please log out and log back in.");
      } else {
        setWatchlistMsg(err.response?.data?.error || "Could not add to watchlist.");
      }
    }
  };

  if (loading) return <div className="container"><Loader label="Loading anime" /></div>;
  if (!anime) return <div className="container"><p>Anime not found.</p></div>;

  return (
    <div className="container">
      <div className="anime-detail-header">
        <div
          className="anime-detail-cover"
          style={anime.cover_image ? { backgroundImage: `url(${anime.cover_image})` } : undefined}
        />
        <div className="anime-detail-info">
          <span className={`status-pill ${anime.status}`}>{anime.status.replace("_", " ")}</span>
          <h1>{anime.title}</h1>
          <div className="meta-row">
            <span>{anime.release_year || "TBA"}</span>
            <span>{anime.studio || "Unknown studio"}</span>
            <span>{anime.review_count} review{anime.review_count === 1 ? "" : "s"}</span>
          </div>
          <div className="tags-row">
            {anime.genres.map((g) => <GenreTag key={g.id} genre={g} />)}
          </div>
          <p>{anime.synopsis}</p>

          <div className="rating-summary">
            <RatingStamp value={anime.average_rating} />
            <span className="mono">community average</span>
          </div>

          <div className="anime-detail-actions">
            {isAuthenticated && (
              <button className="btn btn-secondary" onClick={handleAddToWatchlist}>
                + Add to Watchlist
              </button>
            )}
            {isAuthenticated && !myExistingReview && !showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Write a Review
              </button>
            )}
            {isAdmin && (
              <>
                <Link to={`/admin/anime/${anime.id}/edit`} className="btn btn-ghost">Edit Anime</Link>
                <button className="btn btn-danger" onClick={handleDeleteAnime}>Delete Anime</button>
              </>
            )}
          </div>
          {watchlistMsg && <p className="form-hint">{watchlistMsg}</p>}
          {actionError && <div className="form-error" style={{ marginTop: 12 }}>{actionError}</div>}
          {!isAuthenticated && (
            <p className="form-hint">
              <Link to="/login">Log in</Link> to write a review or save this to your watchlist.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <ReviewForm
          initialValue={editingReview ? {
            title: editingReview.title,
            content: editingReview.content,
            rating: editingReview.rating,
            spoiler: editingReview.spoiler,
          } : undefined}
          submitLabel={editingReview ? "Save Changes" : "Post Review"}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setShowForm(false); setEditingReview(null); }}
        />
      )}

      <div className="section-heading" style={{ marginTop: 40 }}>
        <h2>Reviews</h2>
        <span className="eyebrow">{reviews.length} total</span>
      </div>

      <div className="review-list">
        {reviews.length === 0 && (
          <div className="empty-state">
            <h3>No reviews yet</h3>
            <p>Be the first to share your thoughts on this one.</p>
          </div>
        )}
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}