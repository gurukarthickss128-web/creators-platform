import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import ImageUpload from "../components/ImageUpload";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Technology",
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // IMAGE UPLOAD (STEP 1)
  // =========================
  const handleUpload = async (formData) => {
    setUploading(true);
    setUploadError("");

    try {
      const res = await api.post("/api/upload", formData);

      const url = res.data.url;

      setCoverImageUrl(url);

      toast.success("Image uploaded successfully!");

      return url;
    } catch (err) {
      const message =
        err.response?.data?.message || "Image upload failed";

      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // CREATE POST (STEP 2)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    if (formData.content.trim().length < 10) {
      toast.error("Content must be at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        coverImage: coverImageUrl || null,
      };

      const res = await api.post("/api/posts", payload);

      if (res.data.success) {
        toast.success("Post created successfully!");

        // reset
        setFormData({
          title: "",
          content: "",
          category: "Technology",
          status: "draft",
        });

        setCoverImageUrl(null);

        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Post</h1>

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

        {/* IMAGE UPLOAD */}
        <ImageUpload onUpload={handleUpload} />

        {/* LOADING UI */}
        {uploading && <p>Uploading image...</p>}

        {/* ERROR UI */}
        {uploadError && (
          <p style={{ color: "red" }}>{uploadError}</p>
        )}

        <br /><br />

        <button type="submit" disabled={loading || uploading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}