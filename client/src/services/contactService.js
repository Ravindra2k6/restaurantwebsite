import api from "./api";

const contactService = {
  send: (payload) => api.post("/contact", payload),
};

export default contactService;
