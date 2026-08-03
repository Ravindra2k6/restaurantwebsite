import api from "./api";

const contactService = {
  getAll: (params = {}) => api.get("/contact", { params }),
  updateStatus: (id, status) => api.patch(`/contact/${id}`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
};

export default contactService;
