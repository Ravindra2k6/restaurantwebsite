import {
  FiGrid,
  FiBook,
  FiTag,
  FiMapPin,
  FiImage,
  FiStar,
  FiCalendar,
  FiMail,
  FiPercent,
  FiUsers,
  FiSearch,
  FiHome,
  FiHelpCircle,
  FiSettings,
  FiBarChart2,
  FiBell,
  FiFileText,
  FiBriefcase,
  FiUser,
  FiShield,
} from "react-icons/fi";

/**
 * Role hierarchy, highest privilege first. Used by ProtectedRoute and the
 * Sidebar to gate navigation items and page access.
 */
export const ROLES = ["superadmin", "admin", "manager", "staff"];

/**
 * Sidebar navigation, grouped into sections. `roles` lists which roles can
 * see/access the item; omit `roles` to allow every authenticated role.
 */
export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/", icon: FiGrid }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Menu Items", path: "/menu", icon: FiBook },
      { label: "Categories", path: "/categories", icon: FiTag },
      { label: "Branches", path: "/branches", icon: FiMapPin },
      { label: "Gallery", path: "/gallery", icon: FiImage },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Reviews", path: "/reviews", icon: FiStar },
      { label: "Reservations", path: "/reservations", icon: FiCalendar },
      { label: "Contact Messages", path: "/contact", icon: FiMail },
      { label: "Offers & Coupons", path: "/offers", icon: FiPercent },
      { label: "FAQs", path: "/faqs", icon: FiHelpCircle },
      { label: "Careers", path: "/careers", icon: FiBriefcase },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Homepage", path: "/homepage", icon: FiHome },
      { label: "SEO", path: "/seo", icon: FiSearch },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
      { label: "Reports", path: "/reports", icon: FiFileText },
      { label: "Notifications", path: "/notifications", icon: FiBell },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Staff & Roles", path: "/users", icon: FiUsers, roles: ["superadmin", "admin"] },
      { label: "Audit Logs", path: "/audit-logs", icon: FiShield, roles: ["superadmin", "admin"] },
      { label: "Settings", path: "/settings", icon: FiSettings, roles: ["superadmin", "admin"] },
      { label: "My Profile", path: "/profile", icon: FiUser },
    ],
  },
];

export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "seated",
  "completed",
  "cancelled",
  "no-show",
];

export const REVIEW_STATUSES = ["pending", "approved", "rejected"];

export const CONTACT_STATUSES = ["new", "in-progress", "resolved", "spam"];

export const APPLICATION_STATUSES = ["received", "reviewing", "shortlisted", "rejected", "hired"];

export const FOOD_TYPES = ["veg", "non-veg", "egg"];

export const CATEGORY_TYPES = ["veg", "non-veg", "egg", "dessert", "drink", "mixed"];

export const GALLERY_CATEGORIES = ["food", "ambience", "events", "staff", "awards", "other"];

export const DISCOUNT_TYPES = ["percentage", "flat", "bogo", "combo"];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
