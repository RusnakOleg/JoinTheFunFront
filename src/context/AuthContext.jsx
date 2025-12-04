import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user = { userId, username }
  const [loading, setLoading] = useState(true);

  // Читаємо токен при завантаженні додатку
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (token && userId && username) {
      setUser({ userId, username });
    }

    setLoading(false);
  }, []);

  // Вхід
  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const data = response.data;

    // зберігаємо токен та користувача
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);

    setUser({
      userId: data.userId,
      username: data.username,
    });
  };

  // Реєстрація (просто передає далі)
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
