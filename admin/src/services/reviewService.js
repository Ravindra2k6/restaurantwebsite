import api from "./api";

const reviewService = {
  getAllAdmin: (params = {}) => api.get("/reviews/admin/all", { params }),
  moderate: (id, payload) => api.patch(`/reviews/${id}/moderate`, payload),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default reviewService;
