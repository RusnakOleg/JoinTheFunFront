import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  //  Якщо користувач взагалі не авторизований — кидаємо на логін
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //  Якщо роуту потрібні специфічні ролі, а в користувача немає потрібної ролі
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Якщо звичайний юзер лізе в адмінку — повертаємо його на головну сторінку
    return <Navigate to="/" replace />;
  }

  //  Якщо все добре — рендеримо сторінку
  return children;
}