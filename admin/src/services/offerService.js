import api from "./api";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

const offerService = {
  getAllAdmin: () => api.get("/offers/admin/all"),
  create: (formData) => api.post("/offers", formData, multipartHeaders),
  update: (id, formData) => api.patch(`/offers/${id}`, formData, multipartHeaders),
  delete: (id) => api.delete(`/offers/${id}`),
};

export default offerService;
