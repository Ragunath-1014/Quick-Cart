const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, isAdmin, (req, res) => {
    res.json({
        message: "Welcome Admin"
    });
})

module.exports = router;