const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters"
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        generateToken(res, user._id);

        res.status(201).json({
            message: "Registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        generateToken(res, user._id);

        res.status(200).json({
            message: "Login successfull",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                cart: user.cart,
                wishlist: user.wishlist
            }
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const logoutUser = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict"
        });

        res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        res.status(200).json(req.user);
    }
    catch (err) {
        console.log(err);
        
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { signUpUser, loginUser, logoutUser, getProfile };