/**
 * Builds a `tel:` link from a phone number, stripping spaces.
 */
export const telLink = (phone = "") => `tel:${phone.replace(/\s+/g, "")}`;

/**
 * Builds a `wa.me` deep link, optionally pre-filling a message.
 */
export const whatsappLink = (number = "", message = "") => {
  const cleanNumber = number.replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanNumber}${query}`;
};

/**
 * Builds a Google Maps "get directions" link from lat/lng coordinates.
 */
export const directionsLink = (lat, lng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

/**
 * Builds a plain Google Maps search link from an address string — used as a
 * fallback when precise coordinates aren't available.
 */
export const mapsSearchLink = (query = "") =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
