const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/adminMiddleware");

// ✅ CHECKOUT
router.post("/checkout", protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      totalAmount,
      status: "Pending",
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully ✅",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET MY ORDERS
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADMIN: GET ALL ORDERS
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// UPDATE ORDER STATUS - ADMIN
router.put("/:orderId/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
// 👑 ADMIN: UPDATE ORDER STATUS
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated ✅",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ CANCEL ORDER
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user.toString() !== req.user.id &&
      req.user.isAdmin !== true
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (["Shipped", "Delivered"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled now",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully ❌",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔁 RETURN ORDER
router.put("/:id/return", protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned",
      });
    }

    if (order.returnStatus === "Requested") {
      return res.status(400).json({
        message: "Return already requested",
      });
    }

    order.status = "Returned";
    order.returnStatus = "Requested";
    order.returnReason = reason || "No reason provided";
    order.returnedAt = new Date();

    await order.save();

    res.json({
      message: "Return request submitted successfully 🔁",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADMIN: APPROVE / REJECT RETURN
router.put("/:id/return-action", protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.returnStatus !== "Requested") {
      return res.status(400).json({
        message: "No return request pending",
      });
    }

    if (!["Approved", "Rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    order.returnStatus = action;
    order.returnActionAt = new Date();

    if (action === "Approved") {
      order.status = "Returned";
    }

    await order.save();

    res.json({
      message: `Return ${action.toLowerCase()} successfully ✅`,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 💸 ADMIN: REFUND ORDER
router.put("/:id/refund", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.returnStatus !== "Approved") {
      return res.status(400).json({
        message: "Return not approved yet",
      });
    }

    if (order.refundStatus === "Completed") {
      return res.status(400).json({
        message: "Refund already processed",
      });
    }

    order.refundStatus = "Completed";
    order.refundedAt = new Date();
    order.refundAmount = order.totalAmount;

    await order.save();

    res.json({
      message: "Refund processed successfully 💸",
      refundAmount: order.refundAmount,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;