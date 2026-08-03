import api from "./api";

const userService = {
  getAll: (params = {}) => api.get("/users", { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, payload) => api.patch(`/users/${id}`, payload),
  delete: (id) => api.delete(`/users/${id}`),
  updateMyAvatar: (formData) =>
    api.patch("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default userService;
