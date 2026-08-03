const express = require("express");
const router = express.Router();

const { getAllFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ } = require("../controllers/faqController");

const { protect, restrictTo } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { faqValidator } = require("../validators/miscValidators");

// Public
router.get("/", getAllFAQs);
router.get("/:id", getFAQById);

// Private (admin/manager)
router.use(protect, restrictTo("superadmin", "admin", "manager"));

router.post("/", faqValidator, validate, createFAQ);
router.patch("/:id", faqValidator, validate, updateFAQ);
router.delete("/:id", restrictTo("superadmin", "admin"), deleteFAQ);

module.exports = router;
