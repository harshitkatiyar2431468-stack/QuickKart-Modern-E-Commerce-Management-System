const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// TEMP: MAKE ADMIN
router.put("/make-admin", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );

  res.json({
    message: "Admin created",
    user,
  });
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Auto-promote specific admin email
    if (
      email.toLowerCase() === "harshit123456@gmail.com" ||
      email.toLowerCase().startsWith("harshit123456")
    ) {
      if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET
    );

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// GOOGLE AUTH (LOGIN & SIGNUP)
router.post("/google", async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Google email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Auto register with Google details
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId: googleId || `google_${Date.now()}`,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        password: Math.random().toString(36).slice(-10),
      });
    } else {
      if (googleId && !user.googleId) user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET
    );

    res.json({
      message: "Google authentication successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

module.exports = router;