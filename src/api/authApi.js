import api from "./apiClient";

export const authApi = {
  login: (data) => api.post("/Auth/login", data),
  register: (data) => api.post("/Auth/register", data),
};
