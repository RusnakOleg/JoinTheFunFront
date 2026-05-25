import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { jwtDecode } from "jwt-decode"; // 🔴 Додаємо імпорт для розшифровки токена

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Функція для витягування ролі з JWT токена
  const getRoleFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Стандартний ключ ролі в ASP.NET Core Identity
      return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User";
    } catch {
      return "User";
    }
  };

  // Читаємо токен при завантаженні додатку
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      const role = getRoleFromToken(token); // 🔴 Дістаємо роль
      setUser({ userId, username, role });
    }

    setLoading(false);
  }, []);

  // Вхід
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const data = response.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);

    const role = getRoleFromToken(data.token); // 🔴 Дістаємо роль з нового токена

    setUser({
      userId: data.userId,
      username: data.username,
      role: role
    });
  };

  // Реєстрація
  const register = async (data) => {
    await authApi.register(data);
  };

  // Вихід
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);