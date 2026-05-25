const User = require("../models/User");
const Product = require("../models/Product");

const addToWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const { productId } = req.body;

        const user = await User.findById(req.user._id);

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const existingItem = user.wishlist.find((item) => (
            item.product.toString() === productId
        ));

        if (existingItem) {
            return res.status(400).json({
                message: "Item already in Wishlist"
            });
        }

        user.wishlist.push({
            product: productId
        });

        await user.save();

        res.status(201).json({
            message: "Item added to Wishlist",
            wishlist: user.wishlist
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        })
    }
}

const getWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const user = await User.findById(req.user._id).populate("wishlist.product");

        res.status(200).json(user.wishlist);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const removeWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Now authorized"
            });
        }

        const { productId } = req.body;

        const user = await User.findById(req.user._id);

        user.wishlist = user.wishlist.filter((item) => (
            !(item.product.toString() === productId)
        ));

        await user.save();

        res.status(200).json({
            message: "Item removed from Wishlist",
            wishlist: user.wishlist
        });
    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { addToWishlist, getWishlist, removeWishlist };