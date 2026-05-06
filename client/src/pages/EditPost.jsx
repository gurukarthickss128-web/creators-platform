import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     FETCH SINGLE POST
  ========================= */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);

        const post = res.data.data;

        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          status: post.status
        });

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load post"
        );
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* =========================
     UPDATE POST
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await api.put(`/api/posts/${id}`, formData);

      if (res.data.success) {
        navigate("/dashboard"); // redirect after update
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update post"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p>Loading post...</p>;

  if (error && !formData.title) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Post</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* TITLE */}
        <div>
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* CONTENT */}
        <div>
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* BUTTONS */}
        <button type="button" onClick={() => navigate("/dashboard")}>
          Cancel
        </button>

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}