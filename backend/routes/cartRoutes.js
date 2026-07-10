const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const protect = require("../middlewares/authMiddleware");


// =========================
// GET USER CART
// =========================
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// =========================
// ADD TO CART
// =========================
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
// =========================
// UPDATE QUANTITY
// =========================
router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =========================
// REMOVE ITEM
// =========================
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== req.params.productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
module.exports = router;