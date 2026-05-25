const express = require("express");
const router = express.Router();

const { addAddress, getAddress, updateAddress } = require("../controllers/addressController");
const { protect } = require("../middleware/authMiddleware");

router.post("/addAddress", protect, addAddress);
router.get("/", protect, getAddress);
router.put("/:addressId", protect, updateAddress);

module.exports = router;