import api from "./api";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

const categoryService = {
  getAll: (params = {}) => api.get("/categories", { params }),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (formData) => api.post("/categories", formData, multipartHeaders),
  update: (id, formData) => api.patch(`/categories/${id}`, formData, multipartHeaders),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default categoryService;
