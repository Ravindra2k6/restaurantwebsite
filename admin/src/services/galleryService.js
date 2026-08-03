import api from "./api";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

const galleryService = {
  getAll: (params = {}) => api.get("/gallery", { params }),
  upload: (formData) => api.post("/gallery", formData, multipartHeaders),
  update: (id, payload) => api.patch(`/gallery/${id}`, payload),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export default galleryService;
