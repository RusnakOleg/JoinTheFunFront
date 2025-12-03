import api from "./apiClient";

export const profileApi = {
  getAll: () => api.get("/Profile"),
  getByUserId: (userId) => api.get(`/Profile/${userId}`),
  getByCity: (city) => api.get(`/Profile/by-city?city=${city}`),
  getByInterestId: (interestId) =>
    api.get(`/Profile/by-interest?interestId=${interestId}`),
  create: (userId, data) => api.post(`/Profile/${userId}`, data),
  update: (userId, data) => api.put(`/Profile/${userId}`, data),
};
