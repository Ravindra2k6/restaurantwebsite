/**
 * Lightweight, dependency-free i18n dictionary. Covers navigation, common
 * CTAs, and section headings across the site -- the strings users see most
 * often. Menu item names/descriptions, reviews, and other database-driven
 * content are intentionally NOT translated here (that content is entered
 * by restaurant staff in whichever language they choose, and a real
 * multi-language content strategy would need per-locale fields on the
 * backend models -- flagged as a Phase 5+ enhancement in the docs).
 *
 * Add a new language by adding a new top-level key here and to
 * SUPPORTED_LANGUAGES in LanguageContext.jsx.
 */
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      menu: "Menu",
      branches: "Branches",
      gallery: "Gallery",
      offers: "Offers",
      reviews: "Reviews",
      reservation: "Reservation",
      contact: "Contact",
      callNow: "Call Now",
    },
    hero: {
      viewMenu: "View Menu",
      reserveTable: "Reserve Table",
      whatsapp: "WhatsApp",
      findOnMap: "Find on Map",
    },
    sections: {
      todaysSpecial: "Today's Special",
      featuredDishes: "Featured Dishes",
      whyChooseUs: "Why Choose Us",
      chefRecommendations: "Chef Recommendations",
      ourStory: "Our Story",
      ourBranches: "Our Branches",
      latestOffers: "Latest Offers",
      faqs: "Frequently Asked Questions",
      newsletter: "Never Miss an Offer",
    },
    footer: {
      quickLinks: "Quick Links",
      ourBranches: "Our Branches",
      stayUpdated: "Stay Updated",
      allRightsReserved: "All rights reserved.",
    },
    common: {
      loading: "Loading...",
      viewAll: "View All",
      submit: "Submit",
      search: "Search",
    },
  },
  te: {
    nav: {
      home: "హోమ్",
      about: "మా గురించి",
      menu: "మెనూ",
      branches: "శాఖలు",
      gallery: "గ్యాలరీ",
      offers: "ఆఫర్లు",
      reviews: "సమీక్షలు",
      reservation: "రిజర్వేషన్",
      contact: "సంప్రదించండి",
      callNow: "కాల్ చేయండి",
    },
    hero: {
      viewMenu: "మెనూ చూడండి",
      reserveTable: "టేబుల్ రిజర్వ్ చేయండి",
      whatsapp: "వాట్సాప్",
      findOnMap: "మ్యాప్‌లో చూడండి",
    },
    sections: {
      todaysSpecial: "ఈరోజు ప్రత్యేకం",
      featuredDishes: "ప్రత్యేక వంటకాలు",
      whyChooseUs: "మమ్మల్ని ఎందుకు ఎంచుకోవాలి",
      chefRecommendations: "చెఫ్ సిఫార్సులు",
      ourStory: "మా కథ",
      ourBranches: "మా శాఖలు",
      latestOffers: "తాజా ఆఫర్లు",
      faqs: "తరచుగా అడిగే ప్రశ్నలు",
      newsletter: "ఆఫర్‌లను మిస్ కాకండి",
    },
    footer: {
      quickLinks: "త్వరిత లింకులు",
      ourBranches: "మా శాఖలు",
      stayUpdated: "అప్‌డేట్‌గా ఉండండి",
      allRightsReserved: "అన్ని హక్కులు కలిగి ఉన్నారు.",
    },
    common: {
      loading: "లోడ్ అవుతోంది...",
      viewAll: "అన్నీ చూడండి",
      submit: "సమర్పించండి",
      search: "వెతకండి",
    },
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      menu: "मेनू",
      branches: "शाखाएं",
      gallery: "गैलरी",
      offers: "ऑफर्स",
      reviews: "समीक्षाएं",
      reservation: "आरक्षण",
      contact: "संपर्क करें",
      callNow: "कॉल करें",
    },
    hero: {
      viewMenu: "मेनू देखें",
      reserveTable: "टेबल आरक्षित करें",
      whatsapp: "व्हाट्सएप",
      findOnMap: "मानचित्र पर देखें",
    },
    sections: {
      todaysSpecial: "आज का विशेष",
      featuredDishes: "विशेष व्यंजन",
      whyChooseUs: "हमें क्यों चुनें",
      chefRecommendations: "शेफ की सिफारिशें",
      ourStory: "हमारी कहानी",
      ourBranches: "हमारी शाखाएं",
      latestOffers: "नवीनतम ऑफर्स",
      faqs: "अक्सर पूछे जाने वाले प्रश्न",
      newsletter: "कोई ऑफर न चूकें",
    },
    footer: {
      quickLinks: "त्वरित लिंक",
      ourBranches: "हमारी शाखाएं",
      stayUpdated: "अपडेट रहें",
      allRightsReserved: "सर्वाधिकार सुरक्षित.",
    },
    common: {
      loading: "लोड हो रहा है...",
      viewAll: "सभी देखें",
      submit: "सबमिट करें",
      search: "खोजें",
    },
  },
};

export default translations;
