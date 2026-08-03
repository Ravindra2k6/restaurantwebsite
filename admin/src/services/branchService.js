import api from "./api";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

const branchService = {
  getAll: (params = {}) => api.get("/branches", { params }),
  getOne: (id) => api.get(`/branches/${id}`),
  create: (formData) => api.post("/branches", formData, multipartHeaders),
  update: (id, formData) => api.patch(`/branches/${id}`, formData, multipartHeaders),
  delete: (id) => api.delete(`/branches/${id}`),
  removeImage: (id, publicId) =>
    api.delete(`/branches/${id}/images/${encodeURIComponent(publicId)}`),
  getGoogleReviews: (id) => api.get(`/branches/${id}/google-reviews`),
};

export default branchService;
