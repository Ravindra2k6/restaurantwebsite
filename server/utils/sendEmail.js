const { getTransporter, isEmailConfigured } = require("../config/email");

/**
 * Sends an email if SMTP is configured; otherwise logs it to the console
 * so local development and demos work without a real mail provider.
 * Never throws -- a failed email must never break the request that
 * triggered it (reservation, contact form, etc. all still succeed).
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!isEmailConfigured()) {
    console.log(`\n--- EMAIL (SMTP not configured, logging instead) ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`--- end email ---\n`);
    return { sent: false, reason: "SMTP not configured" };
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Restaurant"}" <${process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error(`Failed to send email to ${to}: ${err.message}`);
    return { sent: false, reason: err.message };
  }
};

module.exports = sendEmail;
