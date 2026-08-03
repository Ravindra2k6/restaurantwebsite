import api from "./api";

const reservationService = {
  create: (payload) => api.post("/reservations", payload),
};

export default reservationService;
