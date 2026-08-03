import api from "./api";

const searchService = {
  global: (query, limit = 5) => api.get("/search", { params: { q: query, limit } }),
};

export default searchService;
