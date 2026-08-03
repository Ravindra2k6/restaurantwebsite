const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Newsletter = require("../models/Newsletter");
const SiteSetting = require("../models/SiteSetting");
const sendEmail = require("../utils/sendEmail");
const { newsletterWelcomeEmail } = require("../utils/emailTemplates");

const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.isSubscribed) {
      return res.status(200).json(new ApiResponse(200, "You're already subscribed!", existing));
    }
    existing.isSubscribed = true;
    existing.unsubscribedAt = undefined;
    await existing.save();
    return res.status(200).json(new ApiResponse(200, "Welcome back! You're re-subscribed.", existing));
  }

  const subscriber = await Newsletter.create({ email });

  const settings = await SiteSetting.getSingleton();
  sendEmail({
    to: email,
    subject: `Welcome to ${settings.siteName || "our"} Newsletter!`,
    html: newsletterWelcomeEmail({
      siteName: settings.siteName,
      siteUrl: process.env.CLIENT_URL,
      unsubscribeUrl: `${process.env.API_PUBLIC_URL || ""}/api/v1/newsletter/unsubscribe/${encodeURIComponent(email)}`,
    }),
  });

  res.status(201).json(new ApiResponse(201, "Subscribed successfully! Watch your inbox for offers.", subscriber));
});

const unsubscribe = asyncHandler(async (req, res) => {
  const subscriber = await Newsletter.findOne({ email: req.params.email });
  if (!subscriber) throw new ApiError(404, "Subscriber not found");

  subscriber.isSubscribed = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  res.status(200).json(new ApiResponse(200, "You have been unsubscribed", subscriber));
});

const getAllSubscribers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.subscribed !== undefined) filter.isSubscribed = req.query.subscribed === "true";

  const [subscribers, total] = await Promise.all([
    Newsletter.find(filter).sort("-createdAt").skip(skip).limit(limit),
    Newsletter.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched subscribers", subscribers, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

module.exports = { subscribe, unsubscribe, getAllSubscribers };
