import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7038", // <-- заміни на свою адресу
  withCredentials: true, // важливо, якщо Identity використовує cookies
});

export default api;
