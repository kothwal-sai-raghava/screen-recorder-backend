import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "MY_SECRET_KEY";

// REGISTER
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.json({ success: false, message: "Email already registered" });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.json({ success: false, message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: "Server error" });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Email not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "7d" } // token valid for 7 days
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.json({ success: false, message: "Server error" });
    }
});


// PROTECTED PROFILE ROUTE
router.get("/profile", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.json({ success: false, message: "Access denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        return res.json({ success: true, user });

    } catch (error) {
        return res.json({ success: false, message: "Invalid or expired token" });
    }
});

export default router;
