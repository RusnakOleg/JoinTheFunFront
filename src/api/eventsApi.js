import api from "./apiClient";

export const eventsApi = {
  getAll: () => api.get("/Events"),
  getByLocation: (city) => api.get(`/Events/by-location?city=${city}`),
  getByUserInterests: (userId) =>
    api.get(`/Events/by-user-interests?userId=${userId}`),
  create: (data) => api.post("/Events", data),
  delete: (id) => api.delete(`/Events/${id}`),
};
