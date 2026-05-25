const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        brand: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            enum: ["men", "women", "kids"],
            required: true
        },

        subCategory: String,

        images: [
            {
                type: String,
                required: true
            }
        ],

        sizes: [
            {
                size: {
                    type: String,
                    required: true
                },
                stock: {
                    type: Number,
                    default: 0
                }
            }
        ],

        attributes: {
            type: Object,
            default: {}
        },

        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);