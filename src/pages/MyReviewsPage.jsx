import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { updateReview, deleteReview } from "../api/reviews";
import RatingStamp from "../components/common/RatingStamp";
import ReviewForm from "../components/reviews/ReviewForm";
import Loader from "../components/common/Loader";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await client.get("/reviews/mine");
    setReviews(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async (payload) => {
    await updateReview(editingId, payload);
    setEditingId(null);
    await load();
  };

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete your review of "${review.anime_title}"?`)) return;
    await deleteReview(review.id);
    await load();
  };

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Your Contributions</span>
        <h1>My Reviews</h1>
      </div>

      {loading ? (
        <Loader label="Loading your reviews" />
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't written any reviews yet</h3>
          <p>Find an anime you've watched and share your thoughts.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Catalog</Link>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map((review) =>
            editingId === review.id ? (
              <ReviewForm
                key={review.id}
                initialValue={{
                  title: review.title,
                  content: review.content,
                  rating: review.rating,
                  spoiler: review.spoiler,
                }}
                submitLabel="Save Changes"
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <article className="review-card" key={review.id}>
                <RatingStamp value={review.rating} />
                <div className="review-card-body">
                  <div className="review-card-head">
                    <h4>
                      <Link to={`/anime/${review.anime_id}`}>{review.anime_title}</Link> — {review.title}
                    </h4>
                    <span className="review-meta">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{review.content}</p>
                  <div className="review-actions">
                    <button onClick={() => setEditingId(review.id)}>Edit</button>
                    <button onClick={() => handleDelete(review)}>Delete</button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}
