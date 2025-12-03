import api from "./apiClient";

export const commentsApi = {
  getByPostId: (postId) => api.get(`/Comments/by-post/${postId}`),
  create: (data) => api.post("/Comments", data),
  delete: (commentId) => api.delete(`/Comments/${commentId}`),
};
