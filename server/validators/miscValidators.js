const { body } = require("express-validator");

const reviewValidator = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 80 }),
  body("email").optional().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("Review comment is required").isLength({ max: 1000 }),
  body("branch").optional().isMongoId().withMessage("Invalid branch id"),
];

const reservationValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("email").optional().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("branch").notEmpty().withMessage("Branch is required").isMongoId().withMessage("Invalid branch id"),
  body("partySize").isInt({ min: 1, max: 50 }).withMessage("Party size must be between 1 and 50"),
  body("reservationDate").isISO8601().toDate().withMessage("A valid reservation date is required"),
  body("reservationTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Reservation time must be in HH:mm format"),
  body("occasion")
    .optional()
    .isIn(["none", "birthday", "anniversary", "business", "date", "family", "other"]),
];

const contactMessageValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 2000 }),
  body("phone").optional().trim(),
  body("subject").optional().trim().isLength({ max: 150 }),
];

const offerValidator = [
  body("title").trim().notEmpty().withMessage("Offer title is required"),
  body("discountType").optional().isIn(["percentage", "flat", "bogo", "combo"]),
  body("discountValue").optional().isFloat({ min: 0 }),
  body("validUntil").notEmpty().withMessage("Offer expiry date is required").isISO8601().toDate(),
  body("minOrderValue").optional().isFloat({ min: 0 }),
];

const faqValidator = [
  body("question").trim().notEmpty().withMessage("Question is required").isLength({ max: 300 }),
  body("answer").trim().notEmpty().withMessage("Answer is required").isLength({ max: 1000 }),
  body("category")
    .optional()
    .isIn(["general", "reservation", "delivery", "menu", "careers", "payments", "other"]),
];

const newsletterValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
];

module.exports = {
  reviewValidator,
  reservationValidator,
  contactMessageValidator,
  offerValidator,
  faqValidator,
  newsletterValidator,
};
