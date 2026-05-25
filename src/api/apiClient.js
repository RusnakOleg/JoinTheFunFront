import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5101/api",
});

// автоматично підставляємо JWT токен, якщо він є
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Якщо сервер повернув 401 (токен недійсний або користувач у бані)
    if (error.response && error.response.status === 401) {
      alert("Доступ заборонено або ваш акаунт було заблоковано.");
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Перенаправляємо на сторінку входу
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
