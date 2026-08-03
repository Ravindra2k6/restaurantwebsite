import api from "./api";

const multipartHeaders = { headers: { "Content-Type": "multipart/form-data" } };

const settingsService = {
  get: () => api.get("/settings"),
  update: (payload) => {
    const isFormData = payload instanceof FormData;
    return api.patch("/settings", payload, isFormData ? multipartHeaders : undefined);
  },
};

export default settingsService;
