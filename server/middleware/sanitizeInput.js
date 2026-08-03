const xss = require("xss");

/**
 * Recursively sanitizes every string value in an object using the `xss`
 * library, which strips/escapes dangerous HTML and script content while
 * leaving plain text untouched. Applied globally to req.body so
 * user-generated content (reviews, contact messages, reservation notes,
 * job applications) can never inject markup into admin views or, if ever
 * rendered unescaped, the public site.
 *
 * Runs after express-mongo-sanitize (which handles NoSQL operator
 * injection) -- the two are complementary, not redundant.
 */
const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return xss(value, {
      whiteList: {}, // strip ALL HTML tags -- this API expects plain text, not rich HTML
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script", "style"],
    });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  return value;
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
};

module.exports = sanitizeInput;
