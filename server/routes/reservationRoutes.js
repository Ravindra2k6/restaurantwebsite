const express = require("express");
const router = express.Router();

const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservationController");

const { protect, restrictTo } = require("../middleware/auth");
const { publicWriteLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { reservationValidator } = require("../validators/miscValidators");

// Public
router.post("/", publicWriteLimiter, reservationValidator, validate, createReservation);

// Private (staff and above)
router.use(protect, restrictTo("superadmin", "admin", "manager", "staff"));

router.get("/", getAllReservations);
router.get("/:id", getReservationById);
router.patch("/:id", updateReservation);
router.delete("/:id", restrictTo("superadmin", "admin", "manager"), deleteReservation);

module.exports = router;
