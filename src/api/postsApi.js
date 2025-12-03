import api from "./apiClient";

export const postsApi = {
  getAll: () => api.get("/Posts"),
  getById: (id) => api.get(`/Posts/${id}`),
  create: (data) => api.post("/Posts", data),
  delete: (id) => api.delete(`/Posts/${id}`),
  getFollowing: (userId) => api.get(`/Posts/following/${userId}`),
};
