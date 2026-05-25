const User = require("../models/User");

const addAddress = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const {
            fullName,
            phone,
            pincode,
            city,
            state,
            addressLine,
            isDefault
        } = req.body;

        const newAddress = {
            fullName,
            phone,
            pincode,
            city,
            state,
            addressLine,
            isDefault
        };

        const user = await User.findById(req.user._id);

        user.addresses.push(newAddress);

        await user.save();

        res.status(201).json({
            message: "Address added successfully!",
            address: user.addresses
        });

    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server serror"
        });
    }
}

const getAddress = async (req, res) => {
    try {
        if (!req.user._id) {
            res.status(401).json({
                message: "Not authorized"
            });
        }

        const user = await User.findById(req.user._id);

        res.status(200).json(user.addresses);
    }
    catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

const updateAddress = async (req, res) => {
    try {
        if (!req.user._id) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const { addressId } = req.params;

        const {
            fullName,
            phone,
            pincode,
            city,
            state,
            addressLine,
            isDefault
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingAddress = user.addresses.id(addressId);

        if (!existingAddress) {
            return res.status(404).json({
                message: "Address not found"
            });
        }

        existingAddress.fullName = fullName;
        existingAddress.phone = phone;
        existingAddress.pincode = pincode;
        existingAddress.city = city;
        existingAddress.state = state;
        existingAddress.addressLine = addressLine;

        await user.save();

        res.status(200).json({
            message: "Address updated successfully",
            address: user.addresses
        });
    }
    catch (err) {
        console.log(err);
        
        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { addAddress, getAddress, updateAddress };