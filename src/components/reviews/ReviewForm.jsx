import { useState } from "react";

const initialState = { title: "", content: "", rating: 8, spoiler: false };

export default function ReviewForm({ initialValue, onSubmit, onCancel, submitLabel = "Post Review" }) {
  const [form, setForm] = useState(initialValue || initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) {
      setError("Please fill in a title and your review content.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...form, rating: Number(form.rating) });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Review title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="content">Your thoughts</label>
        <textarea id="content" name="content" value={form.content} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating: {form.rating} / 10</label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="10"
          value={form.rating}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="spoiler"
            checked={form.spoiler}
            onChange={handleChange}
            style={{ width: "auto", marginRight: 8 }}
          />
          This review contains spoilers
        </label>
      </div>

      <div className="anime-detail-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
