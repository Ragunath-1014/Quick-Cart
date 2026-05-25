const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { isAdmin, protect } = require("../middleware/authMiddleware");
const {
    addProduct,
    getProducts,
    getFilters,
    getProductById,
    getNewProducts,
    getFeaturedProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

router.post("/", upload.fields([
    { name: "image", maxCount: 5 }
]), protect, isAdmin, addProduct);
router.get("/", getProducts);
router.get("/filters", getFilters);
router.get("/newProducts", getNewProducts);
router.get("/featuredProducts", getFeaturedProducts);
router.get("/:productId", getProductById);
router.put("/update", protect, isAdmin, updateProduct);
router.delete("/delete/:productId", protect, isAdmin, deleteProduct);

module.exports = router;