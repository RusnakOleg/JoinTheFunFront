import api from "./apiClient";

export const followApi = {
  isFollowing: (followerId, followedId) =>
    api.get(
      `/Follow/is-following?followerId=${followerId}&followedId=${followedId}`
    ),
  follow: (data) => api.post("/Follow", data),
  unfollow: (data) => api.delete("/Follow", { data }),
};
