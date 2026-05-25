const Product = require("../models/Product");
const Review = require("../models/Review");

const addProduct = async (req, res) => {
    try {
        const {
            name,
            brand,
            price,
            category,
            subCategory,
            sizes,
            attributes,
            isFeatured,
        } = req.body;

        let parsedSizes = [];
        let parsedAttributes = {};

        try {
            parsedSizes = sizes ? JSON.parse(sizes) : [];
            parsedAttributes = attributes ? JSON.parse(attributes) : {};
        }
        catch (err) {
            console.log(err);

            return res.status(400).json({
                message: "Invalid JSON format"
            });
        }

        const imageFiles = req.files?.image || [];

        const imageUrls = imageFiles.map(file => file.path);

        const product = await Product.create({
            name,
            brand,
            price,
            category,
            subCategory,
            images: imageUrls,
            sizes: parsedSizes,
            attributes: parsedAttributes,
            isFeatured,
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getProducts = async (req, res) => {
    try {
        const { category, subCategory, brand, sort } = req.query;

        let filter = {};
        let sortOption = {};

        if (category) {
            filter.category = category
        }

        if (subCategory) {
            filter.subCategory = subCategory
        }

        if (brand) {
            filter.brand = brand
        }

        if (sort === "low") {
            sortOption.price = 1;
        }
        if (sort === "high") {
            sortOption.price = -1;
        }
        if (sort === "new") {
            sortOption.createdAt = -1;
        }

        const products = await Product.find(filter)
            .sort(sortOption);

        res.status(200).json(products);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getFilters = async (req, res) => {
    try {
        const { category } = req.query;

        const brands = await Product.distinct("brand", { category });

        const subCategories = await Product.distinct("subCategory", { category });

        res.status(200).json({ brands, subCategories });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const reviews = await Review.find({ product: product._id })
            .populate("user", "name");

        const avgRating = reviews.reduce((acc, r) =>
            acc + r.rating, 0) / (reviews.length || 1);

        res.status(200).json({
            product,
            reviews,
            avgRating
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getNewProducts = async (req, res) => {
    try {
        const newProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json(newProducts);
    }
    catch (err) {
        console.log(err.message);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true })
            .limit(10);

        res.status(200).json(featuredProducts);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productId, productName, productBrand, productPrice, featuredProduct } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: productName,
                brand: productBrand,
                price: productPrice,
                isFeatured: featuredProduct
            },
            { returnDocument: "after" }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const deleteProduct = await Product.findByIdAndDelete(productId);

        if (!deleteProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            deleteProduct
        });
    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = {
    addProduct,
    getProducts,
    getFilters,
    getProductById,
    getNewProducts,
    getFeaturedProducts,
    updateProduct,
    deleteProduct
};