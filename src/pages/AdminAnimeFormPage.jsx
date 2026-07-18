import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnime, createAnime, updateAnime } from "../api/anime";
import { listGenres } from "../api/genres";
import Loader from "../components/common/Loader";

const emptyForm = {
  title: "",
  synopsis: "",
  release_year: "",
  cover_image: "",
  studio: "",
  status: "ongoing",
  genre_ids: [],
};

export default function AdminAnimeFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listGenres().then((res) => setGenres(res.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getAnime(id).then((res) => {
      const a = res.data;
      setForm({
        title: a.title,
        synopsis: a.synopsis,
        release_year: a.release_year || "",
        cover_image: a.cover_image || "",
        studio: a.studio || "",
        status: a.status,
        genre_ids: a.genres.map((g) => g.id),
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleGenre = (genreId) => {
    setForm((f) => ({
      ...f,
      genre_ids: f.genre_ids.includes(genreId)
        ? f.genre_ids.filter((gid) => gid !== genreId)
        : [...f.genre_ids, genreId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      release_year: form.release_year ? Number(form.release_year) : null,
    };
    try {
      if (isEdit) {
        const res = await updateAnime(id, payload);
        navigate(`/anime/${res.data.id}`);
      } else {
        const res = await createAnime(payload);
        navigate(`/anime/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Could not save this anime.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><Loader label="Loading" /></div>;

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Admin Tools</span>
        <h1>{isEdit ? "Edit Anime" : "Add New Anime"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="panel" style={{ maxWidth: 640 }}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea id="synopsis" name="synopsis" value={form.synopsis} onChange={handleChange} />
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label htmlFor="release_year">Release year</label>
            <input id="release_year" name="release_year" type="number" value={form.release_year} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="studio">Studio</label>
          <input id="studio" name="studio" value={form.studio} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="cover_image">Cover image URL</label>
          <input id="cover_image" name="cover_image" value={form.cover_image} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label>Genres</label>
          <div className="tags-row">
            {genres.map((g) => (
              <label key={g.id} style={{ marginRight: 14, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                <input
                  type="checkbox"
                  checked={form.genre_ids.includes(g.id)}
                  onChange={() => toggleGenre(g.id)}
                  style={{ width: "auto", marginRight: 6 }}
                />
                {g.name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Anime"}
        </button>
      </form>
    </div>
  );
}
