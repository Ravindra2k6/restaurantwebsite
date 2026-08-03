const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateMyAvatar,
} = require("../controllers/userController");

const { protect, restrictTo } = require("../middleware/auth");
const { avatarUpload } = require("../middleware/upload");

router.use(protect); // every route below requires authentication

router.patch("/me/avatar", avatarUpload.single("avatar"), updateMyAvatar);

router.get("/", restrictTo("superadmin", "admin"), getAllUsers);
router.get("/:id", restrictTo("superadmin", "admin"), getUserById);
router.patch("/:id", restrictTo("superadmin", "admin"), updateUser);
router.delete("/:id", restrictTo("superadmin"), deleteUser);

module.exports = router;
