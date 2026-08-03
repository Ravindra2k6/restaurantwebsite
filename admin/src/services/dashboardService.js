import api from "./api";

const dashboardService = {
  getSummary: () => api.get("/dashboard/summary"),
  getVisitorTrend: (days = 14) => api.get("/dashboard/visitor-trend", { params: { days } }),
};

export default dashboardService;
