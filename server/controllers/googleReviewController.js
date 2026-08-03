const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Branch = require("../models/Branch");

/**
 * GOOGLE BUSINESS PROFILE INTEGRATION
 * ------------------------------------------------------------------
 * This controller intentionally does NOT scrape Google's website. It calls
 * the official Places API (New) "Place Details" endpoint using a branch's
 * stored `googlePlaceId`, which returns rating, review count, and the most
 * recent reviews Google exposes through the API.
 *
 * Google reviews are fetched live on each request (with a short in-memory
 * cache) and are NEVER written to MongoDB — they stay fully separate from
 * the website's own Review collection, per the project requirement.
 *
 * Setup required in .env (not included in .env.example to avoid implying
 * it's mandatory for local dev, but documented in README):
 *   GOOGLE_PLACES_API_KEY=your_key
 *
 * Docs: https://developers.google.com/maps/documentation/places/web-service/place-details
 */

const cache = new Map(); // placeId -> { data, expiresAt }
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const fetchPlaceDetails = async (placeId) => {
  const cached = cache.get(placeId);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new ApiError(
      501,
      "Google reviews are not configured on this server. Set GOOGLE_PLACES_API_KEY in the environment."
    );
  }

  const fields = "rating,userRatingCount,reviews,googleMapsUri";
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(502, `Failed to fetch Google reviews (status ${response.status})`);
  }
  const data = await response.json();

  cache.set(placeId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
};

/**
 * @desc    Get Google rating + latest reviews for a branch
 * @route   GET /api/v1/branches/:id/google-reviews
 * @access  Public
 */
const getGoogleReviewsForBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");

  if (!branch.googlePlaceId) {
    throw new ApiError(400, "This branch does not have a Google Place ID configured");
  }

  const details = await fetchPlaceDetails(branch.googlePlaceId);

  const reviews = (details.reviews || []).map((r) => ({
    reviewerName: r.authorAttribution?.displayName || "Google User",
    reviewerPhoto: r.authorAttribution?.photoUri || null,
    rating: r.rating,
    text: r.text?.text || "",
    relativeTime: r.relativePublishTimeDescription,
    publishTime: r.publishTime,
    source: "google",
  }));

  res.status(200).json(
    new ApiResponse(200, "Fetched Google reviews", {
      rating: details.rating || null,
      totalReviews: details.userRatingCount || 0,
      writeReviewUrl:
        details.googleMapsUri ||
        `https://search.google.com/local/writereview?placeid=${branch.googlePlaceId}`,
      reviews,
      source: "google",
    })
  );
});

module.exports = { getGoogleReviewsForBranch };
