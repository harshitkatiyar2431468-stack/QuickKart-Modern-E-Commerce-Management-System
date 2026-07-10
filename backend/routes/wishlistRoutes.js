const express = require("express");
const router = express.Router();

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const protect = require("../middlewares/authMiddleware");

// GET WISHLIST
router.get("/", protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [],
      });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ADD TO WISHLIST
router.post("/add", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [],
      });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.json({
      message: "Added to wishlist ❤️",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// REMOVE FROM WISHLIST
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (product) =>
        product.toString() !== req.params.productId
    );

    await wishlist.save();

    res.json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;