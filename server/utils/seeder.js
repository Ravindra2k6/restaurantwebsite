/**
 * Usage:
 *   node utils/seeder.js --import     Seed the database with a superadmin + sample data
 *   node utils/seeder.js --destroy    Wipe all seeded collections
 *
 * Or via package.json scripts:
 *   npm run seed
 *   npm run seed:destroy
 */
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Branch = require("../models/Branch");
const FAQ = require("../models/FAQ");
const SiteSetting = require("../models/SiteSetting");

const { branches, categories, menuItems, faqs } = require("../data/seedData");

const importData = async () => {
  try {
    await connectDB();

    // ---- 1. Superadmin account ----
    const adminEmail = process.env.ADMIN_EMAIL || "admin@restaurant.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || "Super Admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "ChangeThisPassword123!",
        role: "superadmin",
      });
      console.log(`✅ Superadmin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Superadmin already exists (${adminEmail}), skipping`);
    }

    // ---- 2. Branch ----
    let branch = await Branch.findOne();
    if (!branch) {
      branch = await Branch.create(branches[0]);
      console.log(`✅ Branch created: ${branch.branchName}`);
    } else {
      console.log("ℹ️  Branch(es) already exist, skipping branch seed");
    }

    // ---- 3. Categories ----
    const categoryIdByCode = {};
    for (const cat of categories) {
      let doc = await Category.findOne({ name: cat.name });
      if (!doc) {
        doc = await Category.create({
          name: cat.name,
          type: cat.type,
          displayOrder: cat.displayOrder,
        });
      }
      categoryIdByCode[cat.code] = doc._id;
    }
    console.log(`✅ Categories ready (${categories.length})`);

    // ---- 4. Menu Items ----
    let createdCount = 0;
    for (const item of menuItems) {
      const exists = await MenuItem.findOne({ name: item.name });
      if (exists) continue;

      const { categoryCode, ...rest } = item;
      await MenuItem.create({
        ...rest,
        category: categoryIdByCode[categoryCode],
      });
      createdCount += 1;
    }
    console.log(`✅ Menu items created: ${createdCount} (of ${menuItems.length} defined)`);

    // ---- 5. FAQs ----
    let faqCount = 0;
    for (const faq of faqs) {
      const exists = await FAQ.findOne({ question: faq.question });
      if (!exists) {
        await FAQ.create(faq);
        faqCount += 1;
      }
    }
    console.log(`✅ FAQs created: ${faqCount} (of ${faqs.length} defined)`);

    // ---- 6. Site settings singleton ----
    const settings = await SiteSetting.getSingleton();
    if (!settings.siteName || settings.siteName === "Our Restaurant") {
      settings.siteName = "Bhojanams & Biryanis";
      settings.tagline = "Relaxed dining serving biryanis and Andhra staples alongside thali meals";
      settings.contact.primaryPhone = branch.phoneNumbers?.[0] || "";
      settings.contact.primaryEmail = branch.email || "";
      settings.currency = { code: "INR", symbol: "₹" };
      await settings.save();
      console.log("✅ Site settings initialized");
    }

    console.log("\n🎉 Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Promise.all([
      MenuItem.deleteMany(),
      Category.deleteMany(),
      Branch.deleteMany(),
      FAQ.deleteMany(),
      SiteSetting.deleteMany(),
    ]);

    console.log("🗑️  Seeded data destroyed (User accounts were left untouched — delete manually if needed)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Destroy failed:", err);
    process.exit(1);
  }
};

if (process.argv.includes("--import")) {
  importData();
} else if (process.argv.includes("--destroy")) {
  destroyData();
} else {
  console.log("Please specify --import or --destroy");
  process.exit(1);
}
