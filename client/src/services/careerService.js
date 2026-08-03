import api from "./api";

const careerService = {
  getAll: (params = {}) => api.get("/careers", { params }),
  getOne: (idOrSlug) => api.get(`/careers/${idOrSlug}`),
  apply: (jobId, formData) =>
    api.post(`/careers/${jobId}/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default careerService;
