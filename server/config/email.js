const nodemailer = require("nodemailer");

/**
 * Builds a nodemailer transporter from SMTP env vars. Works with any SMTP
 * provider (SendGrid, Mailgun, Amazon SES, Gmail app passwords, etc.) --
 * just point SMTP_HOST/PORT/USER/PASS at whichever provider you use.
 *
 * If SMTP is not configured, emails are logged to the console instead of
 * sent, so the rest of the app keeps working in local development without
 * requiring a real mail provider.
 */
const isEmailConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;

const getTransporter = () => {
  if (!isEmailConfigured()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

module.exports = { getTransporter, isEmailConfigured };
