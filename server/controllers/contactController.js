const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const ContactMessage = require("../models/ContactMessage");
const SiteSetting = require("../models/SiteSetting");
const sendEmail = require("../utils/sendEmail");
const { contactReplyEmail } = require("../utils/emailTemplates");
const logActivity = require("../utils/logActivity");

/**
 * @desc    Submit a contact form message
 * @route   POST /api/v1/contact
 * @access  Public
 */
const submitContactMessage = asyncHandler(async (req, res) => {
  const payload = { ...req.body, ipAddress: req.ip };
  const message = await ContactMessage.create(payload);

  res.status(201).json(new ApiResponse(201, "Message sent successfully. We'll get back to you soon!", message));
});

const getAllContactMessages = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.branch) filter.branch = req.query.branch;

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort("-createdAt").skip(skip).limit(limit).populate("branch", "branchName"),
    ContactMessage.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched contact messages", messages, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!message) throw new ApiError(404, "Message not found");

  logActivity(req, {
    action: "status_change",
    entityType: "ContactMessage",
    entityId: message._id,
    description: `Contact message from "${message.name}" marked "${message.status}"`,
  });

  res.status(200).json(new ApiResponse(200, "Message status updated", message));
});

/**
 * @desc    Reply to a contact message via email and mark it resolved
 * @route   POST /api/v1/contact/:id/reply
 * @access  Private (admin/manager)
 */
const replyToContactMessage = asyncHandler(async (req, res) => {
  const { replyMessage } = req.body;
  if (!replyMessage) throw new ApiError(400, "Reply message is required");

  const message = await ContactMessage.findById(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");

  const settings = await SiteSetting.getSingleton();
  const result = await sendEmail({
    to: message.email,
    subject: `Re: ${message.subject || "Your message to us"}`,
    html: contactReplyEmail({
      name: message.name,
      originalMessage: message.message,
      replyMessage,
      siteName: settings.siteName,
      siteUrl: process.env.CLIENT_URL,
    }),
  });

  message.status = "resolved";
  await message.save();

  logActivity(req, {
    action: "update",
    entityType: "ContactMessage",
    entityId: message._id,
    description: `Replied to "${message.name}"'s message`,
  });

  res
    .status(200)
    .json(new ApiResponse(200, result.sent ? "Reply sent successfully" : "Reply saved (email not sent -- SMTP not configured)", message));
});

const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  res.status(200).json(new ApiResponse(200, "Message deleted successfully", null));
});

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  replyToContactMessage,
  deleteContactMessage,
};
