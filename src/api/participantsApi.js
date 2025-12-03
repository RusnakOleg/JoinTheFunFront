import api from "./apiClient";

export const participantsApi = {
  getByEventId: (eventId) => api.get(`/EventParticipants/${eventId}`),
  getByUserId: (userId) => api.get(`/EventParticipants/by-user/${userId}`),
  add: (data) => api.post("/EventParticipants", data),
  remove: (data) => api.delete("/EventParticipants", { data }),
};
