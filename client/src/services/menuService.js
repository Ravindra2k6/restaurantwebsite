import api from "./api";

/**
 * All functions resolve to the backend's standard envelope:
 * { success, statusCode, message, data, meta }
 * Components read `.data` (and `.meta` for pagination where relevant).
 */
const menuService = {
  getAll: (params = {}) => api.get("/menu", { params }),
  getOne: (idOrSlug) => api.get(`/menu/${idOrSlug}`),
};

export default menuService;
