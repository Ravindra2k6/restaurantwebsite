import api from "./api";

const offerService = {
  getActive: (params = {}) => api.get("/offers", { params }),
  validateCoupon: (code) => api.get(`/offers/validate/${code}`),
};

export default offerService;
