import api from "./apiClient";

export const likesApi = {
  isLiked: (postId, userId) =>
    api.get(`/Likes/is-liked?postId=${postId}&userId=${userId}`),
  like: (data) => api.post("/Likes", data),
  unlike: (data) => api.delete("/Likes", { data }),
};
