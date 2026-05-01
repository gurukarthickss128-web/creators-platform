import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  // 1. Show loading while checking auth
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  // 2. If user is already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Otherwise allow access (login/register pages)
  return children;
}
