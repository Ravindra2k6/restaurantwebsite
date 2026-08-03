const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const Visit = require("../models/Visit");
const Branch = require("../models/Branch");
const Review = require("../models/Review");
const MenuItem = require("../models/MenuItem");
const Gallery = require("../models/Gallery");
const Reservation = require("../models/Reservation");
const ContactMessage = require("../models/ContactMessage");
const Newsletter = require("../models/Newsletter");
const Category = require("../models/Category");
const Offer = require("../models/Offer");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");

/**
 * @desc    Aggregated counts for the admin dashboard overview cards
 * @route   GET /api/v1/dashboard/summary
 * @access  Private (superadmin, admin, manager)
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalVisitorsAllTime,
    totalVisitorsLast30Days,
    totalBranches,
    totalReviews,
    pendingReviews,
    totalMenuItems,
    totalCategories,
    totalGalleryItems,
    totalReservations,
    pendingReservations,
    totalContactRequests,
    newContactRequests,
    totalNewsletterSubscribers,
    activeOffers,
    activeJobs,
    totalApplications,
  ] = await Promise.all([
    Visit.countDocuments(),
    Visit.countDocuments({ date: { $gte: thirtyDaysAgo } }),
    Branch.countDocuments(),
    Review.countDocuments(),
    Review.countDocuments({ status: "pending" }),
    MenuItem.countDocuments(),
    Category.countDocuments(),
    Gallery.countDocuments(),
    Reservation.countDocuments(),
    Reservation.countDocuments({ status: "pending" }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "new" }),
    Newsletter.countDocuments({ isSubscribed: true }),
    Offer.countDocuments({ isActive: true, validUntil: { $gte: new Date() } }),
    Job.countDocuments({ isActive: true }),
    JobApplication.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched dashboard summary", {
      visitors: { allTime: totalVisitorsAllTime, last30Days: totalVisitorsLast30Days },
      branches: totalBranches,
      reviews: { total: totalReviews, pending: pendingReviews },
      menu: { totalItems: totalMenuItems, totalCategories },
      gallery: totalGalleryItems,
      reservations: { total: totalReservations, pending: pendingReservations },
      contactMessages: { total: totalContactRequests, new: newContactRequests },
      newsletterSubscribers: totalNewsletterSubscribers,
      activeOffers,
      careers: { activeJobs, totalApplications },
    })
  );
});

/**
 * @desc    Daily visitor counts for the last N days (for a simple line chart)
 * @route   GET /api/v1/dashboard/visitor-trend?days=14
 * @access  Private (superadmin, admin, manager)
 */
const getVisitorTrend = asyncHandler(async (req, res) => {
  const days = Math.min(Number(req.query.days) || 14, 90);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const trend = await Visit.aggregate([
    { $match: { date: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(new ApiResponse(200, "Fetched visitor trend", trend));
});

module.exports = { getDashboardSummary, getVisitorTrend };
