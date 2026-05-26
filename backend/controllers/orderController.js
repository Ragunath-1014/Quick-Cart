const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(201).json(order);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const stockValidation = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("cart.product");

        for (const item of user.cart) {
            const product = await Product.findById(item.product._id);

            const matchedSize = product.sizes.find((size) =>
                item.size === size.size
            );

            if (!matchedSize) {
                return res.status(400).json({
                    message: `Size not found for ${product.name}`
                });
            }

            if (matchedSize.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} in size ${matchedSize.size} has only ${matchedSize.stock} items left in stock`
                });
            }
        }

        res.status(200).json({
            message: "Stock available"
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Sever error"
        });
    }
}

const verifyPaymentAndCreateOrder = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
            totalAmount
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        const user = await User.findById(req.user._id)
            .populate("cart.product");

        // STOCK REDUCE FROM THE PRODUCT
        for (const item of user.cart) {
            const product = await Product.findById(item.product._id)

            const matchedSize = product.sizes.find((size) =>
                item.size === size.size
            )

            matchedSize.stock -= item.quantity;
            await product.save();
        }

        const items = user.cart.map((item) => (
            {
                product: item.product._id,
                quantity: item.quantity,
                size: item.size,
                price: item.product.price
            }
        ));

        const order = await Order.create({
            user: user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentId: razorpay_payment_id
        });

        user.cart = [];

        await user.save();

        res.status(200).json({
            message: "Order placed successfully",
            order
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getMyOrders = async (req, res) => {
    try {
        const myOrders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        if (!myOrders) {
            return res.status(404).json({
                message: "No orders found"
            });
        }

        res.status(200).json(myOrders);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { orderId, newOrderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: newOrderStatus },
            { returnDocument: "after" }
        )
            .populate("items.product");

        res.status(200).json({
            message: "Updated successfully",
            order
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
    createOrder,
    stockValidation,
    verifyPaymentAndCreateOrder,
    getMyOrders,
    getAllOrders,
    updateOrder
};