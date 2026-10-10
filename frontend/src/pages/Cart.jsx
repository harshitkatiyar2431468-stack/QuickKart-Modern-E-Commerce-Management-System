import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const { token, cart, updateQuantity, removeFromCart } = useShop();
  const { showToast } = useToast();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCharge = isFreeShipping || subtotal === 0 ? 0 : 49;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const totalAmount = Math.max(0, subtotal + shippingCharge - couponDiscount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "QUICK10" || couponCode.toUpperCase() === "WELCOME") {
      const discount = Math.round(subtotal * 0.1);
      setCouponDiscount(discount);
      setCouponApplied(true);
      showToast(`Promo Applied! You saved ₹${discount}`, "success");
    } else {
      showToast("Invalid Promo Code. Try 'QUICK10'", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review your items and proceed to secure checkout.
              </p>
            </div>
            {items.length > 0 && (
              <span className="text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 px-3.5 py-1.5 rounded-full border border-brand-200 dark:border-brand-800">
                {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} in Cart
              </span>
            )}
          </div>

          {!token ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto my-8 space-y-4">
              <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Please Sign In</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Log in to your QuickKart account to view saved cart items.
              </p>
              <Link to="/login" className="btn-primary text-xs px-6 py-3.5 w-full">
                Login to Account
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-14 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto my-8 space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                🛍️
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Explore our trending catalog and find the best deals on electronics & fashion!
              </p>
              <Link to="/" className="btn-primary text-sm px-8 py-4 inline-flex">
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: CART ITEMS LIST */}
              <div className="lg:col-span-8 space-y-4">
                {/* Free Delivery Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      {isFreeShipping
                        ? "🎉 Congratulations! You unlocked Free Delivery"
                        : `Add ₹${freeShippingThreshold - subtotal} more for FREE Express Delivery`}
                    </span>
                    <span className="text-brand-600 dark:text-brand-400">
                      {Math.round(progressToFreeShipping)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                  {items.map((item) => {
                    const product = item.product || {};
                    return (
                      <div
                        key={item._id || product._id}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        {/* Image */}
                        <Link
                          to={`/product/${product._id}`}
                          className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            src={product.image || fallbackImage}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                            }}
                            className="w-full h-full object-contain"
                          />
                        </Link>

                        {/* Title & info */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                            {product.category || "Item"}
                          </span>
                          <Link
                            to={`/product/${product._id}`}
                            className="block mt-1 font-heading font-bold text-slate-900 dark:text-white text-base hover:text-brand-600 dark:hover:text-brand-400 transition truncate"
                          >
                            {product.name || "Product Item"}
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>

                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-lg font-black text-slate-900 dark:text-white">
                              ₹{Number(product.price || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-slate-400">each</span>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  product._id || item._id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-7 h-7 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-bold flex items-center justify-center text-sm shadow-sm transition"
                            >
                              -
                            </button>
                            <span className="w-9 text-center font-extrabold text-slate-900 dark:text-white text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(product._id || item._id, item.quantity + 1)
                              }
                              className="w-7 h-7 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg font-bold flex items-center justify-center text-sm shadow-sm transition"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-base font-black text-slate-900 dark:text-white">
                              ₹{((product.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                            </span>
                            <button
                              onClick={() => removeFromCart(product._id || item.product?._id || item._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: ORDER SUMMARY CARD */}
              <div className="lg:col-span-4 sticky top-28 space-y-4">
                {/* Promo Code Box */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>Apply Promo Code</span>
                  </h3>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. QUICK10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 uppercase font-bold text-xs px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white focus:border-brand-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-bold text-xs transition"
                    >
                      Apply
                    </button>
                  </form>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                      ✓ Promo Code QUICK10 Applied (-₹{couponDiscount})
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
                  <h3 className="font-heading font-black text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal ({totalItemsCount} items)</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Estimated Shipping</span>
                      <span>
                        {shippingCharge === 0 ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-xs">
                            FREE
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{shippingCharge}
                          </span>
                        )}
                      </span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Promo Discount</span>
                        <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                      <div>
                        <span className="text-base font-black text-slate-900 dark:text-white block">
                          Total Amount
                        </span>
                        <span className="text-[11px] text-slate-400">
                          (Inclusive of GST)
                        </span>
                      </div>
                      <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-brand-500/25 mt-4"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Safe & Encrypted Checkout Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;