const User = require("../models/user");

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: "Only admin can access this page",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = adminOnly;