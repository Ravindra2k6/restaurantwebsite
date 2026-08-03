import api from "./api";

const careerService = {
  getAllJobsAdmin: () => api.get("/careers/admin/all"),
  createJob: (payload) => api.post("/careers", payload),
  updateJob: (id, payload) => api.patch(`/careers/${id}`, payload),
  deleteJob: (id) => api.delete(`/careers/${id}`),
  getApplications: (jobId) => api.get(`/careers/${jobId}/applications`),
  updateApplicationStatus: (id, status) =>
    api.patch(`/careers/applications/${id}/status`, { status }),
};

export default careerService;
