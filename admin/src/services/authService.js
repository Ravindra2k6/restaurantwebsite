import api from "./api";

const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  refresh: () => api.post("/auth/refresh"),
  updatePassword: (payload) => api.patch("/auth/update-password", payload),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.patch(`/auth/reset-password/${token}`, { password }),
  register: (payload) => api.post("/auth/register", payload), // create new staff/admin — superadmin/admin only
};

export default authService;
