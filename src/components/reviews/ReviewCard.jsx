import RatingStamp from "../common/RatingStamp";

export default function ReviewCard({ review, currentUserId, isAdmin, onEdit, onDelete }) {
  const canManage = review.user_id === currentUserId || isAdmin;

  return (
    <article className="review-card">
      <RatingStamp value={review.rating} />
      <div className="review-card-body">
        <div className="review-card-head">
          <h4>
            {review.title}
            {review.spoiler && <span className="spoiler-flag">Spoilers</span>}
          </h4>
          <span className="review-meta">
            by {review.author_username} · {new Date(review.created_at).toLocaleDateString()}
          </span>
        </div>
        <p>{review.content}</p>
        {canManage && (
          <div className="review-actions">
            <button onClick={() => onEdit(review)}>Edit</button>
            <button onClick={() => onDelete(review)}>Delete</button>
          </div>
        )}
      </div>
    </article>
  );
}
