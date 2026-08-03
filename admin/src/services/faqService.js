import api from "./api";

const faqService = {
  getAll: (params = {}) => api.get("/faqs", { params }),
  create: (payload) => api.post("/faqs", payload),
  update: (id, payload) => api.patch(`/faqs/${id}`, payload),
  delete: (id) => api.delete(`/faqs/${id}`),
};

export default faqService;
