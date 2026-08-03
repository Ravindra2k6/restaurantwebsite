import { SITE_URL } from "./constants";

/**
 * Generator functions for Schema.org structured data (JSON-LD), passed to
 * the <SEO structuredData={...} /> prop on each page. Google/Bing use
 * these to power rich results (star ratings in search, FAQ accordions,
 * breadcrumb trails, etc.) -- see https://schema.org and
 * https://developers.google.com/search/docs/appearance/structured-data
 */

export const buildOrganizationSchema = (settings) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: settings?.siteName || "Bhojanams & Biryanis",
  url: SITE_URL,
  logo: settings?.logo?.url || `${SITE_URL}/favicon.svg`,
  sameAs: Object.values(settings?.socialLinks || {}).filter(Boolean),
  contactPoint: settings?.contact?.primaryPhone
    ? [
        {
          "@type": "ContactPoint",
          telephone: settings.contact.primaryPhone,
          contactType: "customer service",
          email: settings.contact.primaryEmail || undefined,
        },
      ]
    : undefined,
});

export const buildRestaurantSchema = ({ settings, branches = [] }) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: settings?.siteName || "Bhojanams & Biryanis",
  image: settings?.logo?.url,
  url: SITE_URL,
  telephone: settings?.contact?.primaryPhone,
  servesCuisine: ["Indian", "Andhra", "Chinese", "Biryani", "Tandoori"],
  priceRange: "₹₹",
  acceptsReservations: "True",
  ...(branches[0] && {
    address: {
      "@type": "PostalAddress",
      streetAddress: branches[0].address?.line1,
      addressLocality: branches[0].address?.city,
      addressRegion: branches[0].address?.state,
      postalCode: branches[0].address?.postalCode,
      addressCountry: branches[0].address?.country || "IN",
    },
    geo: branches[0].location?.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: branches[0].location.coordinates[1],
          longitude: branches[0].location.coordinates[0],
        }
      : undefined,
  }),
});

/**
 * One LocalBusiness entry per branch -- used on the Branches page so each
 * physical location is independently eligible for local search rich results.
 */
export const buildLocalBusinessSchema = (branch) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: `${branch.restaurantName} - ${branch.branchName}`,
  image: branch.images?.[0]?.url,
  telephone: branch.phoneNumbers?.[0],
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: branch.address?.line1,
    addressLocality: branch.address?.city,
    addressRegion: branch.address?.state,
    postalCode: branch.address?.postalCode,
    addressCountry: branch.address?.country || "IN",
  },
  geo: branch.location?.coordinates
    ? {
        "@type": "GeoCoordinates",
        latitude: branch.location.coordinates[1],
        longitude: branch.location.coordinates[0],
      }
    : undefined,
  openingHoursSpecification: (branch.openingHours || [])
    .filter((h) => !h.isClosed)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day.charAt(0).toUpperCase() + h.day.slice(1),
      opens: h.open,
      closes: h.close,
    })),
});

export const buildBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const buildFAQSchema = (faqs = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/**
 * AggregateRating + individual Review nodes for the Reviews page -- powers
 * star-rating rich results. Google only displays review rich results for
 * schema tied to a specific reviewed entity, so this is nested under a
 * minimal Restaurant node rather than floating standalone.
 */
export const buildReviewSchema = ({ siteName, reviews = [], averageRating, totalReviews }) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: siteName,
  aggregateRating:
    totalReviews > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount: totalReviews,
        }
      : undefined,
  review: reviews.slice(0, 10).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    datePublished: r.createdAt,
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.comment,
  })),
});

/**
 * Menu schema -- lists menu sections/items so Google can potentially show a
 * rich "menu" result. Kept lightweight (name + price + description) per
 * https://developers.google.com/search/docs/appearance/structured-data/menu
 */
export const buildMenuSchema = ({ siteName, categories = [], itemsByCategory = {} }) => ({
  "@context": "https://schema.org",
  "@type": "Menu",
  name: `${siteName} Menu`,
  hasMenuSection: categories.map((cat) => ({
    "@type": "MenuSection",
    name: cat.name,
    hasMenuItem: (itemsByCategory[cat._id] || []).map((item) => ({
      "@type": "MenuItem",
      name: item.name,
      description: item.description || undefined,
      offers: {
        "@type": "Offer",
        price: item.price || item.variants?.[0]?.price,
        priceCurrency: "INR",
      },
    })),
  })),
});
