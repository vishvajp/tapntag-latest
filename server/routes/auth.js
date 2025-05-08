const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate a random 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phoneNumber });

    // Generate and store OTP
    const otp = generateOTP();
    otpStore.set(phoneNumber, {
      otp,
      timestamp: Date.now(),
      isNewUser: !existingUser,
    });

    // In production, integrate with SMS service here
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp, // Only include in development
      isNewUser: !existingUser,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ 
      success: false,
      message: "Error sending OTP" 
    });
  }
});

// Verify OTP and login/register
router.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, otp, firstName, lastName, email } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false,
        message: "Phone number and OTP are required" 
      });
    }

    const storedData = otpStore.get(phoneNumber);

    if (!storedData) {
      return res.status(400).json({ 
        success: false,
        message: "OTP not found or expired" 
      });
    }

    // Verify OTP matches (in production, use exact match)
    if (otp !== storedData.otp) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP" 
      });
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ 
        success: false,
        message: "OTP expired" 
      });
    }

    // Clear OTP from store
    otpStore.delete(phoneNumber);

    let user;
    if (storedData.isNewUser) {
      // Validate new user data
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ 
          success: false,
          message: "All fields are required for new user" 
        });
      }

      // Check if email is already registered
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ 
          success: false,
          message: "Email already registered" 
        });
      }

      // Create new user
      user = new User({
        phoneNumber,
        firstName,
        lastName,
        email,
      });

      await user.save();

      // Create empty cart for new user
      const cart = new Cart({
        user: user._id,
        items: []
      });
      await cart.save();
    } else {
      // Existing user
      user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }
    }

    // Generate auth token
    const token = generateToken(user._id);

    // Save token to user (optional)
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      isNewUser: storedData.isNewUser
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ 
      success: false,
      message: "Error verifying OTP" 
    });
  }
});

// Get user profile (protected route)
router.get("/profile", async (req, res) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching profile" 
    });
  }
});

// Update user profile
router.patch("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const updates = req.body;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Update allowed fields
    const allowedUpdates = ["firstName", "lastName", "email"];
    const isValidOperation = Object.keys(updates).every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid updates" 
      });
    }

    // Check if new email is already taken
    if (updates.email && updates.email !== user.email) {
      const emailExists = await User.findOne({ email: updates.email });
      if (emailExists) {
        return res.status(400).json({ 
          success: false,
          message: "Email already in use" 
        });
      }
    }

    Object.assign(user, updates);
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating profile" 
    });
  }
});

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ 
      success: false,
      message: "Please authenticate" 
    });
  }
};

module.exports = { router, authMiddleware };