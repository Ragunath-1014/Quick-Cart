const express = require("express");
const router = express.Router();

const { addToCart, getCart, updateCart, removeCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCart);
router.delete("/remove", protect, removeCart);

module.exports = router;