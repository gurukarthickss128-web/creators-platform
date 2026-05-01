import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ THIS MUST BE USED IN FORM
  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ VALIDATION GOES HERE
  if (!formData.content || formData.content.trim().length < 10) {
    setError("Content must be at least 10 characters");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await api.post("/api/posts", formData);

    if (res.data.success) {
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Failed to create post");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Post</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ✅ IMPORTANT FIX HERE */}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
        />
        <br /><br />

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

        <br /><br />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}