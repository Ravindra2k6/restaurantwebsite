/**
 * Wraps template-specific inner HTML in a consistent, email-client-safe
 * layout (table-based, inline styles -- required for reliable rendering
 * across Gmail/Outlook/Apple Mail). Keeping this in one place means every
 * email shares the same header/footer/branding automatically.
 */
const baseEmailLayout = ({ siteName = "Bhojanams & Biryanis", preheader = "", bodyHtml, primaryColor = "#c98a2e" }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${siteName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f4;font-family:Arial,Helvetica,sans-serif;">
  <span style="display:none;font-size:1px;color:#f6f6f4;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#111113;padding:28px 32px;text-align:center;">
              <span style="font-size:20px;font-weight:bold;color:${primaryColor};font-family:Georgia,serif;">
                ${siteName}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#1a1a1a;font-size:15px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#f6f6f4;text-align:center;font-size:12px;color:#888;">
              This is an automated message from ${siteName}. Please do not reply directly to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = baseEmailLayout;
