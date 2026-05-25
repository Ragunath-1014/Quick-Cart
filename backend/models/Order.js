const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                size: String,
                quantity: Number,
                price: Number,
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            fullName: String,
            phone: String,
            pincode: String,
            city: String,
            state: String,
            addressLine: String
        },

        paymentId: String,

        orderStatus: {
            type: String,
            enum: ["Placed", "Shipped", "Delivered"],
            default: "Placed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);