import api from "./apiClient";

export const adminApi = {
  getAllUsers: () => api.get("/Admin/users"),

  banUser: (userId, days = 7) => api.post(`/Admin/users/${userId}/ban?days=${days}`),

  unbanUser: (userId) => api.post(`/Admin/users/${userId}/unban`),

  createInterest: (data) => api.post("/Admin/interests", data),

  deleteInterest: (id) => api.delete(`/Admin/interests/${id}`),

  deleteEvent: (id) => api.delete(`/Admin/events/${id}`),

  deletePost: (id) => api.delete(`/Admin/posts/${id}`),
};