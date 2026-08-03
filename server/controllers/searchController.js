const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const MenuItem = require("../models/MenuItem");
const Branch = require("../models/Branch");
const Gallery = require("../models/Gallery");

/**
 * @desc    Unified global search across menu items, branches and gallery --
 *          powers the public site's search bar and its autocomplete dropdown.
 * @route   GET /api/v1/search?q=biryani&limit=5
 * @access  Public
 */
const globalSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);

  if (!q) {
    return res.status(200).json(
      new ApiResponse(200, "Provide a search query via ?q=", {
        menu: [],
        branches: [],
        gallery: [],
      })
    );
  }

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const [menu, branches, gallery] = await Promise.all([
    MenuItem.find({ $text: { $search: q }, isAvailable: true })
      .select("name slug price variants images foodType")
      .limit(limit),
    Branch.find({
      isActive: true,
      $or: [{ branchName: regex }, { "address.city": regex }, { "address.area": regex }],
    })
      .select("branchName slug address images")
      .limit(limit),
    Gallery.find({ $or: [{ title: regex }, { caption: regex }] })
      .select("title image category")
      .limit(limit),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Search results", {
      query: q,
      menu,
      branches,
      gallery,
      totalResults: menu.length + branches.length + gallery.length,
    })
  );
});

module.exports = { globalSearch };
