import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5101/api",
});

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

    const requestUrl = error.config?.url ? error.config.url.toLowerCase() : "";

    // Перевіряємо різні варіанти написання роуту логіну (з косою рискою чи без, повний чи відносний)
    if (requestUrl.includes("auth/login") || requestUrl.endsWith("/login")) {
      return Promise.reject(error);
    }

    //  Для всіх ІНШИХ запитів (коли користувач вже сидить на сайті і в нього протух токен)
    if (error.response && error.response.status === 401) {
      alert("Доступ заборонено або ваш акаунт було заблоковано.");
      
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;