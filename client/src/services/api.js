import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

/**
 * Central Axios instance. `withCredentials` lets the browser send/receive
 * the backend's httpOnly auth cookies (used by the admin panel in Phase 3;
 * harmless for the public site since most routes here are public reads).
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// Normalize errors so every service call can rely on `error.message` being
// a human-readable string, regardless of whether it was a network failure
// or a structured API error from the backend's ApiError shape.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
