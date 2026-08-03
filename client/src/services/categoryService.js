import api from "./api";

const categoryService = {
  getAll: (params = {}) => api.get("/categories", { params }),
  getOne: (id) => api.get(`/categories/${id}`),
};

export default categoryService;
