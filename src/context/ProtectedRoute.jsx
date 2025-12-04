import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" />;
}
