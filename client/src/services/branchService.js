import api from "./api";

const branchService = {
  getAll: (params = {}) => api.get("/branches", { params }),
  getOne: (idOrSlug) => api.get(`/branches/${idOrSlug}`),
  getNearby: (lat, lng, maxDistanceKm = 15) =>
    api.get("/branches/nearby", { params: { lat, lng, maxDistanceKm } }),
  getGoogleReviews: (branchId) => api.get(`/branches/${branchId}/google-reviews`),
};

export default branchService;
