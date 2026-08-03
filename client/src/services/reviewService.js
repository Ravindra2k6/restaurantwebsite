import api from "./api";

const reviewService = {
  getApproved: (params = {}) => api.get("/reviews", { params }),
  submit: (formData) =>
    api.post("/reviews", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default reviewService;
