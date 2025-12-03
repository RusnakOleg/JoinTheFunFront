import api from "./apiClient";

export const interestsApi = {
  getAll: () => api.get("/Interests"),
  create: (data) => api.post("/Interests", data),
};
