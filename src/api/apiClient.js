import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7038/api",
});

// автоматично підставляємо JWT токен, якщо він є
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
