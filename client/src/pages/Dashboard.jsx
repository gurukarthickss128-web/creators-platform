import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ Get everything from context
  const { user, logout, isAuthenticated, loading } = useAuth();

  // ✅ Protect route
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout(); // ✅ handled by context
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {user ? (
        <>
          <p>
            👋 Welcome, <b>{user.name}</b>
          </p>
          <p>Email: {user.email}</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}