const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const protect = require("../middlewares/authMiddleware");

// =========================
// GET USER CART (with auto cleanup for deleted products)
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
    } else {
      // Auto-cleanup items where product has been deleted/null in DB
      const initialCount = cart.items.length;
      cart.items = cart.items.filter((item) => item.product != null);
      if (cart.items.length !== initialCount) {
        await Cart.updateOne(
          { _id: cart._id },
          { items: cart.items.map((i) => ({ product: i.product._id, quantity: i.quantity })) }
        );
      }
    }

    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
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
      (item) => item.product && item.product.toString() === productId
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
    console.error("Add Cart Error:", error);
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

    const item = cart.items.find((item) => {
      if (!item.product) return false;
      const prodId = item.product.toString();
      const itemId = item._id ? item._id.toString() : "";
      return prodId === productId || itemId === productId;
    });

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    item.quantity = Math.max(1, quantity);
    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// =========================
// REMOVE ITEM (by Product ID or Item ID, or clean invalid)
// =========================
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => {
      // If product reference is null/orphaned, remove it
      if (!item.product) return false;
      const prodId = item.product.toString();
      const itemId = item._id ? item._id.toString() : "";
      return prodId !== productId && itemId !== productId;
    });

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.json(updatedCart);
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// =========================
// CLEAR CART
// =========================
router.delete("/clear", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared", items: [] });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;