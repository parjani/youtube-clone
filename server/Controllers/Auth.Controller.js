import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Channel from "../Models/Channel.Model.js";
import User from "../Models/User.Model.js";


// ================= REGISTER USER =================

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar,
        });

        // Remove password from response
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
        };

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================= LOGIN USER =================

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const channel = await Channel.findOne({
            owner: user._id,
        });

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
            },
            "67CFGHK12",
            {
                expiresIn: "7d",
            }
        );

        // Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,

            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                channel,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ================= GET CURRENT USER =================

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};