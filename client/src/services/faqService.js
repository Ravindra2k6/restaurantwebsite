import api from "./api";

const faqService = {
  getAll: (params = {}) => api.get("/faqs", { params }),
};

export default faqService;
