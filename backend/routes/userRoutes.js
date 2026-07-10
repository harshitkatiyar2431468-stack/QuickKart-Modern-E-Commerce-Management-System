const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

// 🔒 PROTECTED PROFILE ROUTE
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed ✅",
    userId: req.user,
  });
});

module.exports = router;
