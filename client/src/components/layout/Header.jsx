import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <h2>MyPlatform</h2>

      <nav>
        <Link to="/" style={{ marginRight: "10px", color: "#fff" }}>Home</Link>
        <Link to="/login" style={{ marginRight: "10px", color: "#fff" }}>Login</Link>
        <Link to="/register" style={{ color: "#fff" }}>Register</Link>
      </nav>
    </header>
  );
}