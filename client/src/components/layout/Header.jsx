import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <h2>MyPlatform</h2>

      <nav style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff" }}>Home</Link>

        {isAuthenticated ? (
          <>
            <span>👋 {user?.name}</span>

            <Link to="/dashboard" style={{ color: "#fff" }}>
              Dashboard
            </Link>

            <button onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#fff" }}>Login</Link>
            <Link to="/register" style={{ color: "#fff" }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}