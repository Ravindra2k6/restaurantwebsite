const express = require("express");
const router = express.Router();

const { subscribe, unsubscribe, getAllSubscribers } = require("../controllers/newsletterController");

const { protect, restrictTo } = require("../middleware/auth");
const { publicWriteLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { newsletterValidator } = require("../validators/miscValidators");

// Public
router.post("/subscribe", publicWriteLimiter, newsletterValidator, validate, subscribe);
router.patch("/unsubscribe/:email", unsubscribe);

// Private (admin/manager)
router.get("/", protect, restrictTo("superadmin", "admin", "manager"), getAllSubscribers);

module.exports = router;
