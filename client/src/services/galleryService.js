import api from "./api";

const galleryService = {
  getAll: (params = {}) => api.get("/gallery", { params }),
};

export default galleryService;
