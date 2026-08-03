import api from "./api";

const settingsService = {
  get: () => api.get("/settings"),
};

export default settingsService;
