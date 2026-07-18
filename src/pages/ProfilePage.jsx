import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await updateProfile(form);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not update your profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Account Settings</span>
        <h1>Your Profile</h1>
      </div>

      <div className="profile-grid">
        <div className="panel profile-summary">
          <div
            className="profile-avatar"
            style={form.avatar_url ? { backgroundImage: `url(${form.avatar_url})` } : undefined}
          />
          <h3>@{user?.username}</h3>
          <p className="mono" style={{ color: "var(--muted)" }}>{user?.email}</p>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </div>

        <div className="panel">
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" value={form.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="avatar_url">Avatar URL</label>
              <input id="avatar_url" name="avatar_url" value={form.avatar_url} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} maxLength={500} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
