const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
    createOrder,
    stockValidation,
    verifyPaymentAndCreateOrder,
    getMyOrders,
    getAllOrders,
    updateOrder
} = require("../controllers/orderController");

router.post("/create", protect, createOrder);
router.get("/stockValidate", protect, stockValidation);
router.post("/verify-payment", protect, verifyPaymentAndCreateOrder);
router.get("/myOrders", protect, getMyOrders);
router.get("/", protect, isAdmin, getAllOrders);
router.put("/update", protect, isAdmin, updateOrder);

module.exports = router;