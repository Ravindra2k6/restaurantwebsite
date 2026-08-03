import api from "./api";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

const menuService = {
  getAll: (params = {}) => api.get("/menu", { params }),
  getOne: (id) => api.get(`/menu/${id}`),
  create: (formData) => api.post("/menu", formData, multipartHeaders),
  update: (id, formData) => api.patch(`/menu/${id}`, formData, multipartHeaders),
  delete: (id) => api.delete(`/menu/${id}`),
  removeImage: (id, publicId) => api.delete(`/menu/${id}/images/${encodeURIComponent(publicId)}`),
  toggleAvailability: (id, isAvailable) =>
    api.patch(`/menu/${id}/availability`, { isAvailable }),
};

export default menuService;
