const express = require("express");
const router = express.Router();

const User = require("../models/user");

const jwt = require("jsonwebtoken");

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
        message: "User already exists",
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

    const token = jwt.sign(
  { id: user._id },
  "secret123"
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

module.exports = router;