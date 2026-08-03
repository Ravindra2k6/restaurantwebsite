const express = require("express");
const router = express.Router();

const {
  submitContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  replyToContactMessage,
  deleteContactMessage,
} = require("../controllers/contactController");

const { protect, restrictTo } = require("../middleware/auth");
const { publicWriteLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { contactMessageValidator } = require("../validators/miscValidators");

// Public
router.post("/", publicWriteLimiter, contactMessageValidator, validate, submitContactMessage);

// Private (admin/manager)
router.use(protect, restrictTo("superadmin", "admin", "manager"));

router.get("/", getAllContactMessages);
router.post("/:id/reply", replyToContactMessage);
router.patch("/:id", updateContactMessageStatus);
router.delete("/:id", deleteContactMessage);

module.exports = router;
