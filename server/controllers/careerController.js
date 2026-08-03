const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");

// ---- Jobs (public listing + admin management) ----

const getAllJobs = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.department) filter.department = req.query.department;
  if (req.query.branch) filter.branch = req.query.branch;

  const jobs = await Job.find(filter).sort("-createdAt").populate("branch", "branchName");
  res.status(200).json(new ApiResponse(200, "Fetched job openings", jobs));
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] }).populate(
    "branch",
    "branchName"
  );
  if (!job) throw new ApiError(404, "Job listing not found");
  res.status(200).json(new ApiResponse(200, "Fetched job listing", job));
});

const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort("-createdAt").populate("branch", "branchName");
  res.status(200).json(new ApiResponse(200, "Fetched all job listings", jobs));
});

const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(new ApiResponse(201, "Job listing created successfully", job));
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!job) throw new ApiError(404, "Job listing not found");
  res.status(200).json(new ApiResponse(200, "Job listing updated successfully", job));
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) throw new ApiError(404, "Job listing not found");
  await JobApplication.deleteMany({ job: job._id });
  res.status(200).json(new ApiResponse(200, "Job listing deleted successfully", null));
});

// ---- Applications ----

const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new ApiError(404, "Job listing not found");
  if (!job.isActive) throw new ApiError(400, "This job listing is no longer accepting applications");
  if (!req.file) throw new ApiError(400, "A resume file (PDF or Word) is required");

  const application = await JobApplication.create({
    job: job._id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    coverNote: req.body.coverNote,
    resumeUrl: req.file.path,
    resumePublicId: req.file.filename,
  });

  res.status(201).json(new ApiResponse(201, "Application submitted successfully!", application));
});

const getApplicationsForJob = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ job: req.params.jobId }).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, "Fetched applications", applications));
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!application) throw new ApiError(404, "Application not found");
  res.status(200).json(new ApiResponse(200, "Application status updated", application));
});

module.exports = {
  getAllJobs,
  getJobById,
  getAllJobsAdmin,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicationsForJob,
  updateApplicationStatus,
};
