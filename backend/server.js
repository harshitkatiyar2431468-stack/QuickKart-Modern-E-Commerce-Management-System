require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");


const cors = require("cors");   // 👈 ADD
require("dotenv").config();

const app = express();

// 👇 ADD THIS (IMPORTANT)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());


// Middleware
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Server OK 🚀");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
