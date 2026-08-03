/**
 * Sample seed data modeled on a real restaurant (Bhojanams & Biryanis,
 * Madhapur, Hyderabad) so Phase 1 can be tested with realistic content
 * instead of "Lorem Ipsum" placeholders. Prices are in INR (₹), matching
 * the currency configured in SiteSetting.
 *
 * This is illustrative — expand it via the admin panel once Phase 3 (admin
 * UI) is built, or add more entries here and re-run `npm run seed`.
 */

const branches = [
  {
    restaurantName: "Bhojanams & Biryanis",
    branchName: "Madhapur",
    address: {
      line1: "Plot No. 87, Ayyappa Society Main Road",
      area: "Ayyappa Society, Megha Hills, Sri Sai Nagar",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      postalCode: "500081",
    },
    phoneNumbers: ["07075993728"],
    email: "madhapur@bhojanamsbiryanis.example",
    openingHours: [
      { day: "monday", open: "12:15", close: "00:00" },
      { day: "tuesday", open: "12:15", close: "00:00" },
      { day: "wednesday", open: "12:15", close: "00:00" },
      { day: "thursday", open: "12:15", close: "00:00" },
      { day: "friday", open: "12:15", close: "00:00" },
      { day: "saturday", open: "12:15", close: "00:00" },
      { day: "sunday", open: "12:15", close: "00:00" },
    ],
    location: { type: "Point", coordinates: [78.3915, 17.4483] }, // approx Madhapur, Hyderabad
    managerName: "Branch Manager",
    parkingAvailable: true,
    facilities: ["Dine-in", "Takeaway", "Delivery", "All You Can Eat Thali", "Group Seating"],
    deliveryAvailable: true,
    reservationAvailable: true,
    averageCostForTwo: 500,
    isActive: true,
  },
];

// Categories keyed by a temp code so the seeder can map MenuItems to the
// right ObjectId after insertion.
const categories = [
  { code: "starters-veg", name: "Starters - Veg", type: "veg", displayOrder: 1 },
  { code: "starters-nonveg", name: "Starters - Non-Veg", type: "non-veg", displayOrder: 2 },
  { code: "soups", name: "Soups", type: "mixed", displayOrder: 3 },
  { code: "tandoori", name: "Tandoori", type: "non-veg", displayOrder: 4 },
  { code: "veg-curries", name: "Veg Curries", type: "veg", displayOrder: 5 },
  { code: "egg-curries", name: "Egg Curries", type: "egg", displayOrder: 6 },
  { code: "chicken-curries", name: "Chicken Curries", type: "non-veg", displayOrder: 7 },
  { code: "mutton-curries", name: "Mutton Curries", type: "non-veg", displayOrder: 8 },
  { code: "seafood-curries", name: "Prawns & Fish Curries", type: "non-veg", displayOrder: 9 },
  { code: "biryani-veg", name: "Biryanis - Veg", type: "veg", displayOrder: 10 },
  { code: "biryani-nonveg", name: "Biryanis - Non-Veg", type: "non-veg", displayOrder: 11 },
  { code: "rice", name: "Rice Items", type: "mixed", displayOrder: 12 },
  { code: "breads", name: "Tandoori Roti Items", type: "veg", displayOrder: 13 },
  { code: "beverages", name: "Beverages", type: "drink", displayOrder: 14 },
  { code: "desserts", name: "Desserts & Ice Creams", type: "dessert", displayOrder: 15 },
];

// Menu items reference categories by `categoryCode`, resolved to a real
// ObjectId at seed time. `variants` items use Half/Full pricing like the
// source menu; others use a flat `price`.
const menuItems = [
  // Starters - Non-Veg
  { name: "Chicken Manchurian", categoryCode: "starters-nonveg", foodType: "non-veg", price: 200 },
  { name: "Chilly Chicken", categoryCode: "starters-nonveg", foodType: "non-veg", price: 250 },
  { name: "Chicken 65", categoryCode: "starters-nonveg", foodType: "non-veg", price: 250, isPopular: true },
  { name: "Dragon Chicken", categoryCode: "starters-nonveg", foodType: "non-veg", price: 250 },
  { name: "Apollo Fish", categoryCode: "starters-nonveg", foodType: "non-veg", price: 250 },
  { name: "Butter Garlic Prawns", categoryCode: "starters-nonveg", foodType: "non-veg", price: 250 },

  // Starters - Veg
  { name: "Veg Manchurian (Dry/Wet)", categoryCode: "starters-veg", foodType: "veg", price: 160 },
  { name: "Gobi Manchurian", categoryCode: "starters-veg", foodType: "veg", price: 180 },
  { name: "Crispy Corn", categoryCode: "starters-veg", foodType: "veg", price: 170 },
  { name: "Veg Spring Rolls", categoryCode: "starters-veg", foodType: "veg", price: 225 },

  // Soups
  {
    name: "Sweet Corn Soup (Veg)",
    categoryCode: "soups",
    foodType: "veg",
    variants: [
      { label: "Half", price: 90 },
      { label: "Full", price: 140 },
    ],
  },
  {
    name: "Chicken Hot n Sour Soup",
    categoryCode: "soups",
    foodType: "non-veg",
    variants: [
      { label: "Half", price: 120 },
      { label: "Full", price: 180 },
    ],
  },

  // Tandoori
  { name: "Lemon Paneer Tikka", categoryCode: "tandoori", foodType: "veg", price: 240 },
  {
    name: "Tandoori Chicken",
    categoryCode: "tandoori",
    foodType: "non-veg",
    variants: [
      { label: "Half", price: 270 },
      { label: "Full", price: 490 },
    ],
    isChefRecommended: true,
  },

  // Veg Curries
  { name: "Dal Tadka", categoryCode: "veg-curries", foodType: "veg", price: 140 },
  { name: "Palak Paneer", categoryCode: "veg-curries", foodType: "veg", price: 160 },
  { name: "Paneer Butter Masala", categoryCode: "veg-curries", foodType: "veg", price: 200, isPopular: true },
  { name: "Malai Koftha", categoryCode: "veg-curries", foodType: "veg", price: 200 },
  { name: "Paneer Tikka Masala", categoryCode: "veg-curries", foodType: "veg", price: 240 },

  // Egg Curries
  { name: "Egg Burji", categoryCode: "egg-curries", foodType: "egg", price: 150 },
  { name: "Egg Masala", categoryCode: "egg-curries", foodType: "egg", price: 160 },

  // Chicken Curries
  { name: "Butter Chicken", categoryCode: "chicken-curries", foodType: "non-veg", price: 225, isTodaysSpecial: true },
  { name: "Chicken Hyderabadi", categoryCode: "chicken-curries", foodType: "non-veg", price: 225 },
  { name: "Chicken Chettinadu", categoryCode: "chicken-curries", foodType: "non-veg", price: 225 },
  { name: "Natuu Kodi Curry", categoryCode: "chicken-curries", foodType: "non-veg", price: 225 },

  // Mutton Curries
  { name: "Mutton Rogan Josh", categoryCode: "mutton-curries", foodType: "non-veg", price: 275 },
  { name: "Mutton Curry (Andhra Style)", categoryCode: "mutton-curries", foodType: "non-veg", price: 260 },

  // Seafood
  { name: "Fish Curry", categoryCode: "seafood-curries", foodType: "non-veg", price: 270 },
  { name: "Prawns Kolhapuri", categoryCode: "seafood-curries", foodType: "non-veg", price: 260 },

  // Biryani - Veg
  { name: "Veg Biryani", categoryCode: "biryani-veg", foodType: "veg", variants: [{ label: "Half", price: 160 }, { label: "Full", price: 250 }] },
  { name: "Paneer Biryani", categoryCode: "biryani-veg", foodType: "veg", variants: [{ label: "Half", price: 190 }, { label: "Full", price: 300 }] },

  // Biryani - Non-Veg
  {
    name: "Chicken Dum Biryani",
    categoryCode: "biryani-nonveg",
    foodType: "non-veg",
    variants: [
      { label: "Half", price: 200 },
      { label: "Full", price: 400 },
    ],
    isPopular: true,
    isChefRecommended: true,
  },
  {
    name: "Gongura Mutton Biryani",
    categoryCode: "biryani-nonveg",
    foodType: "non-veg",
    variants: [
      { label: "Half", price: 270 },
      { label: "Full", price: 530 },
    ],
  },
  {
    name: "Mixed Biryani (Chicken, Mutton, Prawns)",
    categoryCode: "biryani-nonveg",
    foodType: "non-veg",
    variants: [
      { label: "Half", price: 300 },
      { label: "Full", price: 580 },
    ],
  },

  // Rice
  { name: "Bhojanam Thali", categoryCode: "rice", foodType: "veg", price: 169, description: "Phulka, Dal, Chutney, Curry, Fry, Sambar, Rasam, Papad, Sweet, Curd" },
  { name: "Curd Rice", categoryCode: "rice", foodType: "veg", price: 130 },
  { name: "Gongura Rice", categoryCode: "rice", foodType: "veg", price: 120 },

  // Breads
  { name: "Butter Naan", categoryCode: "breads", foodType: "veg", price: 60 },
  { name: "Garlic Naan", categoryCode: "breads", foodType: "veg", price: 60 },
  { name: "Plain Roti", categoryCode: "breads", foodType: "veg", price: 25 },

  // Beverages
  { name: "Fresh Lime Soda", categoryCode: "beverages", foodType: "veg", price: 40 },
  { name: "Sweet Lassi", categoryCode: "beverages", foodType: "veg", price: 50 },

  // Desserts
  { name: "Double Ka Meeta", categoryCode: "desserts", foodType: "veg", price: 50 },
  { name: "Gulab Jamun (Rabdi Milk Cake)", categoryCode: "desserts", foodType: "veg", price: 70 },
];

const faqs = [
  {
    question: "Do you take walk-in reservations?",
    answer: "Yes, walk-ins are always welcome, but we recommend booking a table online during weekends and dinner hours to avoid waiting.",
    category: "reservation",
    displayOrder: 1,
  },
  {
    question: "Is home delivery available?",
    answer: "Yes, delivery is available at select branches. Check the branch page for delivery availability near you.",
    category: "delivery",
    displayOrder: 2,
  },
  {
    question: "Do you have vegetarian and Jain food options?",
    answer: "Yes, our veg menu is clearly marked and we can customize several dishes to be Jain-friendly on request.",
    category: "menu",
    displayOrder: 3,
  },
];

module.exports = { branches, categories, menuItems, faqs };
