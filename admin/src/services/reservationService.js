import api from "./api";

const reservationService = {
  getAll: (params = {}) => api.get("/reservations", { params }),
  getOne: (id) => api.get(`/reservations/${id}`),
  update: (id, payload) => api.patch(`/reservations/${id}`, payload),
  delete: (id) => api.delete(`/reservations/${id}`),
};

export default reservationService;
