import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";
import {
  MapPin,
  CreditCard,
  Lock,
  ArrowRight,
  Smartphone,
  Banknote,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const { token, cart, fetchCart } = useShop();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!token) {
      showToast("Please login to proceed to checkout", "error");
      navigate("/login");
    }
  }, [token, navigate, showToast]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleFillDemoAddress = () => {
    setAddress({
      fullName: "Harshit Katiyar",
      phone: "9876543210",
      street: "Flat 402, Royal Residency, Tech Zone",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560100",
    });
    showToast("Filled demo delivery address!", "info");
  };

  const items = cart?.items || [];
  const totalPrice = items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const deliveryCharge = totalPrice > 499 ? 0 : 49;
  const finalAmount = totalPrice + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      showToast("Your cart is empty", "error");
      navigate("/cart");
      return;
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      showToast("Please fill all required address fields", "error");
      return;
    }

    try {
      setLoading(true);
      await api.post("/orders/checkout", {
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          address: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod,
      });

      await fetchCart();
      showToast("🎉 Order Placed Successfully!", "success");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white">
              Secure Checkout
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>256-Bit SSL Encrypted & Protected Payment Processing</span>
            </p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: FORM FIELDS */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. DELIVERY ADDRESS */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                          1. Delivery Address
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Where should we deliver your order?</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillDemoAddress}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-950 px-3 py-1.5 rounded-xl transition border border-brand-200/60 dark:border-brand-800/60"
                    >
                      Fill Demo Address ✨
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        name="fullName"
                        value={address.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="input-premium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Mobile Phone *
                      </label>
                      <input
                        name="phone"
                        value={address.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="input-premium"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Street Address / Flat / Building *
                      </label>
                      <input
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        placeholder="House no, Street area, Landmark"
                        className="input-premium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        City *
                      </label>
                      <input
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="input-premium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        State *
                      </label>
                      <input
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="input-premium"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Postal PIN Code *
                      </label>
                      <input
                        name="pincode"
                        value={address.pincode}
                        onChange={handleChange}
                        placeholder="6-digit PIN code"
                        className="input-premium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PAYMENT METHOD */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                        2. Payment Method
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred payment option</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label
                      onClick={() => setPaymentMethod("Cash on Delivery")}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                        paymentMethod === "Cash on Delivery"
                          ? "border-brand-600 bg-brand-50/40 dark:bg-brand-950/40 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "Cash on Delivery"}
                          onChange={() => setPaymentMethod("Cash on Delivery")}
                          className="w-4 h-4 text-brand-600"
                        />
                        <div className="flex items-center gap-2.5">
                          <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              Cash on Delivery (COD)
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Pay in cash or UPI upon package delivery
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                        Available
                      </span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod("Online UPI / Card")}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                        paymentMethod === "Online UPI / Card"
                          ? "border-brand-600 bg-brand-50/40 dark:bg-brand-950/40 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "Online UPI / Card"}
                          onChange={() => setPaymentMethod("Online UPI / Card")}
                          className="w-4 h-4 text-brand-600"
                        />
                        <div className="flex items-center gap-2.5">
                          <Smartphone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              Instant UPI / Credit & Debit Cards
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Google Pay, PhonePe, Paytm, RuPay, Visa
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-2.5 py-1 rounded-lg">
                        Instant
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3. ORDER ITEMS PREVIEW */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-4">
                    Items in Order ({items.length})
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.map((item) => (
                      <div
                        key={item._id || item.product._id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-1"
                          />
                          <div>
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Qty: {item.quantity} × ₹{item.product?.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          ₹{(item.product?.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: PRICE SUMMARY */}
              <div className="lg:col-span-4 sticky top-28 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
                  <h3 className="font-heading font-black text-slate-900 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                    Payment Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Shipping Fee</span>
                      <span>
                        {deliveryCharge === 0 ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">₹{deliveryCharge}</span>
                        )}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        Order Total
                      </span>
                      <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                        ₹{finalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-sm font-bold shadow-lg shadow-brand-500/25 mt-4"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Place Order & Pay</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    By placing order, you agree to QuickKart terms of service.
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;