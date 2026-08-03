import api from "./api";

const newsletterService = {
  getAll: (params = {}) => api.get("/newsletter", { params }),
};

export default newsletterService;
