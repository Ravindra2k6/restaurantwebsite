import api from "./api";

const newsletterService = {
  subscribe: (email) => api.post("/newsletter/subscribe", { email }),
};

export default newsletterService;
