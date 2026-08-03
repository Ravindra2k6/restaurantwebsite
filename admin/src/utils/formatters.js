export const formatCurrency = (amount, symbol = "₹") => {
  if (amount === null || amount === undefined) return "—";
  return `${symbol}${Number(amount).toLocaleString("en-IN")}`;
};

export const formatMenuPrice = (item) => {
  if (item.price) return formatCurrency(item.price);
  if (item.variants?.length) {
    const prices = item.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }
  return "—";
};

export const formatDate = (dateString, opts = {}) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime24to12 = (time24) => {
  if (!time24) return "—";
  const [hourStr, minute] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
};

export const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

export const timeAgo = (dateString) => {
  if (!dateString) return "—";
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
};

export const truncate = (str = "", length = 60) =>
  str.length > length ? `${str.slice(0, length)}…` : str;
