const User = require("../models/User");

const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();
    }
    catch (error) {
        console.log(err);

        res.status(401).json({
            message: "Invalid token"
        });
    }
}

const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        console.log(err);
        
        res.status(403).json({
            message: "Admin only can access!"
        });
    }
}

module.exports = { protect, isAdmin };