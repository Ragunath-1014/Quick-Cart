const User = require("../models/User");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                message: "Not authorized"
            });
        }

        const { productId, size } = req.body;

        const user = await User.findById(req.user._id);

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const existingItem = user.cart.find((item) => (
            item.product.toString() === productId && item.size === size
        ));

        if (existingItem) {
            existingItem.quantity += 1;
        }
        else {
            user.cart.push({
                product: productId,
                quantity: 1,
                size
            });
        }

        await user.save();

        res.status(201).json({
            message: "Item added to Cart",
            cart: user.cart
        });

    }
    catch (error) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                message: "Not authorized"
            });
        }

        const user = await User.findById(req.user._id)
            .populate("cart.product");

        res.status(200).json(user.cart);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const { productId, quantity, size } = req.body;

        const user = await User.findById(req.user._id);

        const existingItem = user.cart.find((item) => (
            item.product.toString() === productId && item.size === size
        ));

        if (!existingItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        existingItem.quantity = quantity;

        await user.save();

        res.status(200).json({
            message: "Updated item"
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const removeCart = async (req, res) => {
    try {
        const { productId, size } = req.body;

        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter((item) => (
            !(item.product.toString() === productId && item.size === size)
        ));

        await user.save();

        res.status(200).json({
            message: "Item removed from Cart"
        });
    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { addToCart, getCart, updateCart, removeCart };