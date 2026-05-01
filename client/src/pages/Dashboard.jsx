import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loading } = useAuth();

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState("");

  // Protect route
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // ✅ CLEAN FIX: no fetch function, no eslint issue
  useEffect(() => {
    if (!user) return;

    const loadPosts = async () => {
      try {
        setPostLoading(true);
        setError("");

        const res = await api.get(
          `/api/posts?page=${page}&limit=5`
        );

        setPosts(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        setError("Failed to load posts");
        console.log(err);
      } finally {
        setPostLoading(false);
      }
    };

    loadPosts();
  }, [page, user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>
            👋 Welcome, <b>{user.name}</b>
          </p>
          <p>Email: {user.email}</p>

          <button onClick={handleLogout}>Logout</button>

          <hr />

          <h2>Your Posts</h2>

          {postLoading && <p>Loading posts...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* POSTS */}
          {posts.length === 0 && !postLoading ? (
            <p>No posts found</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>
                  {post.category} | {post.status}
                </small>
              </div>
            ))
          )}

          {/* PAGINATION */}
          {posts.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {pagination.page || 1} of{" "}
                {pagination.totalPages || 1}
              </span>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}