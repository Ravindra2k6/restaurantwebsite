const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Reservation = require("../models/Reservation");
const Branch = require("../models/Branch");
const sendEmail = require("../utils/sendEmail");
const { reservationConfirmationEmail, reservationStatusEmail } = require("../utils/emailTemplates");
const SiteSetting = require("../models/SiteSetting");
const logActivity = require("../utils/logActivity");

/**
 * @desc    Create a new table reservation
 * @route   POST /api/v1/reservations
 * @access  Public
 */
const createReservation = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.body.branch);
  if (!branch) throw new ApiError(404, "Selected branch does not exist");
  if (!branch.reservationAvailable) {
    throw new ApiError(400, "This branch does not currently accept online reservations");
  }

  const reservation = await Reservation.create(req.body);

  // Fire-and-forget confirmation email -- never blocks the response.
  if (reservation.email) {
    const settings = await SiteSetting.getSingleton();
    sendEmail({
      to: reservation.email,
      subject: "Reservation Received - " + (settings.siteName || "Restaurant"),
      html: reservationConfirmationEmail({
        name: reservation.name,
        branchName: branch.branchName,
        reservationDate: new Date(reservation.reservationDate).toLocaleDateString(),
        reservationTime: reservation.reservationTime,
        partySize: reservation.partySize,
        siteName: settings.siteName,
        siteUrl: process.env.CLIENT_URL,
      }),
    });
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Reservation request received! We'll confirm shortly.", reservation));
});

/**
 * @desc    Admin: list reservations with filters (branch/date/status)
 * @route   GET /api/v1/reservations
 * @access  Private (admin/manager/staff)
 */
const getAllReservations = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.branch) filter.branch = req.query.branch;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) {
    const start = new Date(req.query.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.query.date);
    end.setHours(23, 59, 59, 999);
    filter.reservationDate = { $gte: start, $lte: end };
  }

  const [reservations, total] = await Promise.all([
    Reservation.find(filter)
      .sort("reservationDate reservationTime")
      .skip(skip)
      .limit(limit)
      .populate("branch", "branchName")
      .populate("confirmedBy", "name"),
    Reservation.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched reservations", reservations, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate("branch", "branchName");
  if (!reservation) throw new ApiError(404, "Reservation not found");
  res.status(200).json(new ApiResponse(200, "Fetched reservation", reservation));
});

/**
 * @desc    Update reservation status (confirm/seat/complete/cancel) and table assignment
 * @route   PATCH /api/v1/reservations/:id
 * @access  Private (admin/manager/staff)
 */
const updateReservation = asyncHandler(async (req, res) => {
  const { status, tableNumber } = req.body;

  const reservation = await Reservation.findById(req.params.id).populate("branch", "branchName");
  if (!reservation) throw new ApiError(404, "Reservation not found");

  const previousStatus = reservation.status;

  if (status) {
    reservation.status = status;
    if (status === "confirmed") reservation.confirmedBy = req.user.id;
  }
  if (tableNumber !== undefined) reservation.tableNumber = tableNumber;

  await reservation.save();

  if (status && status !== previousStatus && ["confirmed", "cancelled"].includes(status) && reservation.email) {
    const settings = await SiteSetting.getSingleton();
    sendEmail({
      to: reservation.email,
      subject: status === "confirmed" ? "Your Table is Confirmed!" : "Reservation Update",
      html: reservationStatusEmail({
        name: reservation.name,
        branchName: reservation.branch?.branchName,
        reservationDate: new Date(reservation.reservationDate).toLocaleDateString(),
        reservationTime: reservation.reservationTime,
        status,
        siteName: settings.siteName,
        siteUrl: process.env.CLIENT_URL,
      }),
    });
  }

  logActivity(req, {
    action: "status_change",
    entityType: "Reservation",
    entityId: reservation._id,
    description: `Reservation for "${reservation.name}" set to "${reservation.status}"`,
  });

  res.status(200).json(new ApiResponse(200, "Reservation updated successfully", reservation));
});

const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) throw new ApiError(404, "Reservation not found");
  res.status(200).json(new ApiResponse(200, "Reservation deleted successfully", null));
});

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
};
