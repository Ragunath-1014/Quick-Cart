const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { addToWishlist, getWishlist, removeWishlist } = require("../controllers/wishlistController");

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/remove", protect, removeWishlist);

module.exports = router;