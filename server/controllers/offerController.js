const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Offer = require("../models/Offer");
const { deleteImage } = require("../config/cloudinary");

/**
 * @desc    Public: list currently active, non-expired offers
 * @route   GET /api/v1/offers
 * @access  Public
 */
const getActiveOffers = asyncHandler(async (req, res) => {
  const filter = {
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  };
  if (req.query.branch) {
    filter.$or = [{ applicableBranches: req.query.branch }, { applicableBranches: { $size: 0 } }];
  }

  const offers = await Offer.find(filter).sort("-createdAt");
  res.status(200).json(new ApiResponse(200, "Fetched active offers", offers));
});

/**
 * @desc    Validate a coupon code (used at checkout / reservation flows)
 * @route   GET /api/v1/offers/validate/:code
 * @access  Public
 */
const validateCoupon = asyncHandler(async (req, res) => {
  const offer = await Offer.findOne({ couponCode: req.params.code.toUpperCase(), isActive: true });
  if (!offer) throw new ApiError(404, "Invalid or inactive coupon code");

  if (offer.validUntil < new Date()) throw new ApiError(400, "This coupon has expired");
  if (offer.usageLimit > 0 && offer.usedCount >= offer.usageLimit) {
    throw new ApiError(400, "This coupon has reached its usage limit");
  }

  res.status(200).json(new ApiResponse(200, "Coupon is valid", offer));
});

const getAllOffersAdmin = asyncHandler(async (req, res) => {
  const offers = await Offer.find().sort("-createdAt");
  res.status(200).json(new ApiResponse(200, "Fetched all offers", offers));
});

const createOffer = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (typeof payload.applicableBranches === "string") {
    payload.applicableBranches = JSON.parse(payload.applicableBranches);
  }
  if (req.file) payload.image = { url: req.file.path, publicId: req.file.filename };

  const offer = await Offer.create(payload);
  res.status(201).json(new ApiResponse(201, "Offer created successfully", offer));
});

const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) throw new ApiError(404, "Offer not found");

  const payload = { ...req.body };
  if (typeof payload.applicableBranches === "string") {
    payload.applicableBranches = JSON.parse(payload.applicableBranches);
  }
  if (req.file) {
    if (offer.image?.publicId) await deleteImage(offer.image.publicId);
    payload.image = { url: req.file.path, publicId: req.file.filename };
  }

  Object.assign(offer, payload);
  await offer.save();

  res.status(200).json(new ApiResponse(200, "Offer updated successfully", offer));
});

const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) throw new ApiError(404, "Offer not found");
  if (offer.image?.publicId) await deleteImage(offer.image.publicId);
  await offer.deleteOne();
  res.status(200).json(new ApiResponse(200, "Offer deleted successfully", null));
});

module.exports = {
  getActiveOffers,
  validateCoupon,
  getAllOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
};
