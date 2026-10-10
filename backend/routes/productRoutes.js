const adminOnly = require("../middlewares/adminMiddleware");
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const protect = require("../middlewares/authMiddleware");

// ===============================
// ADD PRODUCT (Protected)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, price, description, category, stock, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name & price required" });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock) || 0,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// GET ALL PRODUCTS (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// SEED PRODUCTS (Public helper)
router.get("/seed/data", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ message: "Product count", count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// GET SINGLE PRODUCT BY ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid product ID" });
  }
});
// ===============================
// UPDATE PRODUCT (Admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, price, description, category, stock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// DELETE PRODUCT (Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
