const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        addressLine: {
            type: String,
            required: true
        },
        
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: true
    }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                size: {
                    type: String
                }
            }
        ],

        wishlist: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                }
            }
        ],

        addresses: [addressSchema]

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);