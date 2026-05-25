const Review = require("../models/Review");

const addReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You already reviewed this product"
            });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review added successfully!",
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate("user");

        const totalRatings = reviews.reduce((acc, item) => (
            acc + item.rating
        ), 0);

        const avgRating = parseFloat((totalRatings / reviews.length).toFixed(1));

        res.status(200).json({
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

module.exports = { addReview, getReviews };