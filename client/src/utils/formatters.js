/**
 * Formats a number as Indian Rupees, e.g. 1250 -> "₹1,250"
 */
export const formatCurrency = (amount, symbol = "₹") => {
  if (amount === null || amount === undefined) return "";
  return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
};

/**
 * Renders a menu item's price — either a flat price or a "₹X - ₹Y" range
 * built from its Half/Full variants.
 */
export const formatMenuPrice = (item) => {
  if (item.price) return formatCurrency(item.price);
  if (item.variants?.length) {
    const prices = item.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }
  return "";
};

/**
 * Formats "HH:mm" 24-hour time into a friendly 12-hour string, e.g. "19:30" -> "7:30 PM"
 */
export const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Builds a full postal address string from a Branch document's address object.
 */
export const formatAddress = (address = {}) => {
  return [address.line1, address.area, address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(", ");
};
