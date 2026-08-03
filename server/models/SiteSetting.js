const mongoose = require("mongoose");

/**
 * A single "singleton" document holds site-wide configuration so the admin
 * panel has one place to manage homepage content, default SEO tags, social
 * links, currency and supported languages. Enforced as a singleton via the
 * static getSingleton()/updateSingleton() helpers below rather than allowing
 * arbitrary creation through the generic CRUD routes.
 */
const siteSettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Our Restaurant" },
    tagline: { type: String, default: "" },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    favicon: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    heroVideoUrl: { type: String, default: "" },
    heroHeadline: { type: String, default: "" },
    restaurantStory: { type: String, default: "" },

    seoDefaults: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, maxlength: 160, default: "" },
      ogImage: { type: String, default: "" },
      keywords: [{ type: String }],
    },

    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      whatsapp: { type: String, default: "" }, // wa.me link
    },

    contact: {
      primaryPhone: { type: String, default: "" },
      primaryEmail: { type: String, default: "" },
      whatsappNumber: { type: String, default: "" },
    },

    googleBusiness: {
      placeId: { type: String, default: "" },
      writeReviewUrl: { type: String, default: "" },
    },

    analytics: {
      googleAnalyticsId: { type: String, default: "" },
      facebookPixelId: { type: String, default: "" },
    },

    currency: {
      code: { type: String, default: "INR" },
      symbol: { type: String, default: "₹" },
    },

    supportedLanguages: {
      type: [String],
      default: ["en"],
    },

    theme: {
      mode: { type: String, enum: ["light", "dark", "auto"], default: "auto" },
      festiveThemeActive: { type: Boolean, default: false },
      festiveThemeName: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

siteSettingSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("SiteSetting", siteSettingSchema);
