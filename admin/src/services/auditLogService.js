import api from "./api";

const auditLogService = {
  getAll: (params = {}) => api.get("/audit-logs", { params }),
  getEntityTypes: () => api.get("/audit-logs/entity-types"),
};

export default auditLogService;
