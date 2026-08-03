const baseEmailLayout = require("./baseEmailLayout");

const button = (url, label, color = "#c98a2e") => `
  <a href="${url}" style="display:inline-block;background-color:${color};color:#111113;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:999px;margin-top:16px;">
    ${label}
  </a>
`;

/**
 * @desc Sent to a guest immediately after they submit a reservation request.
 */
const reservationConfirmationEmail = ({ name, branchName, reservationDate, reservationTime, partySize, siteName, siteUrl }) =>
  baseEmailLayout({
    siteName,
    preheader: `Your reservation request at ${branchName} has been received`,
    bodyHtml: `
      <h2 style="margin-top:0;">Reservation Received!</h2>
      <p>Hi ${name},</p>
      <p>Thanks for booking with us. Here are your reservation details:</p>
      <table role="presentation" style="width:100%;background:#f9f4ea;border-radius:12px;padding:16px;margin:16px 0;">
        <tr><td style="padding:6px 0;color:#666;">Branch</td><td style="padding:6px 0;font-weight:bold;text-align:right;">${branchName}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Date</td><td style="padding:6px 0;font-weight:bold;text-align:right;">${reservationDate}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Time</td><td style="padding:6px 0;font-weight:bold;text-align:right;">${reservationTime}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Guests</td><td style="padding:6px 0;font-weight:bold;text-align:right;">${partySize}</td></tr>
      </table>
      <p>Your table is currently <strong>pending confirmation</strong> -- our team will confirm it shortly. You'll receive another email once it's confirmed.</p>
      ${button(siteUrl, "Visit Our Website")}
    `,
  });

/**
 * @desc Sent when an admin confirms or cancels a reservation.
 */
const reservationStatusEmail = ({ name, branchName, reservationDate, reservationTime, status, siteName, siteUrl }) => {
  const isConfirmed = status === "confirmed";
  const heading = isConfirmed ? "Your Table is Confirmed!" : "Reservation Update";
  const message = isConfirmed
    ? `Great news -- your table at ${branchName} on ${reservationDate} at ${reservationTime} is confirmed. We look forward to hosting you!`
    : `Your reservation at ${branchName} on ${reservationDate} at ${reservationTime} has been ${status}. If this is unexpected, please contact the branch directly.`;

  return baseEmailLayout({
    siteName,
    preheader: heading,
    bodyHtml: `
      <h2 style="margin-top:0;">${heading}</h2>
      <p>Hi ${name},</p>
      <p>${message}</p>
      ${button(siteUrl, "Visit Our Website")}
    `,
  });
};

/**
 * @desc Sent as an acknowledgment reply to a contact form submission.
 */
const contactReplyEmail = ({ name, originalMessage, replyMessage, siteName, siteUrl }) =>
  baseEmailLayout({
    siteName,
    preheader: "We've replied to your message",
    bodyHtml: `
      <h2 style="margin-top:0;">We've Replied to Your Message</h2>
      <p>Hi ${name},</p>
      <p>${replyMessage}</p>
      <div style="margin-top:20px;padding:14px 16px;background:#f6f6f4;border-left:3px solid #c98a2e;border-radius:8px;color:#666;font-size:13px;">
        <strong>Your original message:</strong><br/>${originalMessage}
      </div>
      ${button(siteUrl, "Visit Our Website")}
    `,
  });

/**
 * @desc Sent immediately after a newsletter signup.
 */
const newsletterWelcomeEmail = ({ siteName, siteUrl, unsubscribeUrl }) =>
  baseEmailLayout({
    siteName,
    preheader: `Welcome to the ${siteName} newsletter`,
    bodyHtml: `
      <h2 style="margin-top:0;">Welcome to the Family!</h2>
      <p>Thanks for subscribing -- you'll be the first to hear about new dishes, festive offers, and special events.</p>
      ${button(siteUrl, "Explore Our Menu")}
      <p style="margin-top:24px;font-size:12px;color:#999;">
        Didn't mean to subscribe? <a href="${unsubscribeUrl}" style="color:#999;">Unsubscribe here</a>.
      </p>
    `,
  });

/**
 * @desc Sent to a newly created staff/admin account with their login info.
 */
const staffWelcomeEmail = ({ name, email, role, siteName, loginUrl }) =>
  baseEmailLayout({
    siteName,
    preheader: `Your ${siteName} admin account is ready`,
    bodyHtml: `
      <h2 style="margin-top:0;">Welcome to the Team, ${name}!</h2>
      <p>An admin panel account has been created for you with the <strong>${role}</strong> role.</p>
      <table role="presentation" style="width:100%;background:#f9f4ea;border-radius:12px;padding:16px;margin:16px 0;">
        <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;font-weight:bold;text-align:right;">${email}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Role</td><td style="padding:6px 0;font-weight:bold;text-align:right;">${role}</td></tr>
      </table>
      <p>Use "Forgot Password" on the login screen to set your password if one wasn't shared with you directly.</p>
      ${button(loginUrl, "Go to Admin Panel")}
    `,
  });

module.exports = {
  reservationConfirmationEmail,
  reservationStatusEmail,
  contactReplyEmail,
  newsletterWelcomeEmail,
  staffWelcomeEmail,
};
