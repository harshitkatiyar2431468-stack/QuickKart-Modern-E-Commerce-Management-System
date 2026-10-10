import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calendar,
} from "lucide-react";

const TRACKING_STEPS = [
  { name: "Pending", icon: Clock, label: "Order Placed" },
  { name: "Processing", icon: Package, label: "Processing" },
  { name: "Shipped", icon: Truck, label: "On The Way" },
  { name: "Delivered", icon: CheckCircle2, label: "Delivered" },
];

function MyOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(`/orders/${orderId}/cancel`, {});
      showToast("Order cancelled successfully", "info");
      fetchOrders();
    } catch (error) {
      showToast(error.response?.data?.message || "Cancellation failed", "error");
    }
  };

  const handleReturnOrder = async (orderId) => {
    const reason = prompt("Please provide a reason for return (e.g. Size issue, Defective item):");
    if (!reason) return;

    try {
      await api.put(`/orders/${orderId}/return`, { reason });
      showToast("Return request submitted successfully", "success");
      fetchOrders();
    } catch (error) {
      showToast(error.response?.data?.message || "Return request failed", "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Shipped":
        return "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Processing":
        return "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Cancelled":
        return "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Returned":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      default:
        return "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  };

  const getStepProgress = (status) => {
    switch (status) {
      case "Pending":
        return 20;
      case "Processing":
        return 50;
      case "Shipped":
        return 80;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                    My Orders
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Track live deliveries, review past purchases, and manage returns.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/" className="btn-secondary text-xs px-5 py-3">
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="h-6 skeleton-box rounded w-1/4" />
                  <div className="h-20 skeleton-box rounded-2xl" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-14 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto my-12 space-y-4">
              <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                📦
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No Orders Yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You haven't placed any orders yet. Discover our top trending deals today!
              </p>
              <Link to="/" className="btn-primary text-xs px-8 py-3.5 inline-flex">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const currentStepIdx = TRACKING_STEPS.findIndex(
                  (s) => s.name.toLowerCase() === (order.status || "").toLowerCase()
                );

                const isCancelledOrReturned =
                  order.status === "Cancelled" || order.status === "Returned";

                return (
                  <div
                    key={order._id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    {/* ORDER HEADER */}
                    <div className="bg-slate-50/80 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Order ID
                          </span>
                          <p className="font-heading font-extrabold text-slate-900 dark:text-white text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div className="hidden sm:block h-7 w-[1px] bg-slate-200 dark:bg-slate-700" />
                        <div className="hidden sm:block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Placed On
                          </span>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3.5 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LIVE TRACKING TIMELINE */}
                    {!isCancelledOrReturned && (
                      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="relative mb-6">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                              style={{ width: `${getStepProgress(order.status)}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center">
                          {TRACKING_STEPS.map((step, idx) => {
                            const Icon = step.icon;
                            const isCompleted = currentStepIdx >= idx;
                            return (
                              <div key={step.name} className="flex flex-col items-center">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                                    isCompleted
                                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span
                                  className={`text-[11px] font-bold mt-1.5 ${
                                    isCompleted ? "text-slate-900 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ORDER PRODUCTS LIST */}
                    <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800">
                      {order.items?.map((item) => (
                        <div
                          key={item._id || item.product?._id}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                item.product?.image ||
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
                              }
                              alt={item.product?.name}
                              className="w-16 h-16 rounded-2xl object-contain bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-2 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                {item.product?.name || "Product Item"}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                              <span className="font-extrabold text-brand-600 dark:text-brand-400 text-xs">
                                Total: ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          {item.product?._id && (
                            <Link
                              to={`/product/${item.product._id}`}
                              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl transition self-end sm:self-auto"
                            >
                              View Item
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* ORDER FOOTER & ACTIONS */}
                    <div className="bg-slate-50/80 dark:bg-slate-800/60 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="text-slate-500 dark:text-slate-400">
                        <span>Payment: </span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {order.paymentMethod || "Cash on Delivery"}
                        </strong>
                        {order.shippingAddress && (
                          <span className="block sm:inline sm:ml-4 text-slate-400">
                            Deliver to: {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "Pending" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-4 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900 font-bold transition"
                          >
                            Cancel Order
                          </button>
                        )}

                        {order.status === "Delivered" && (
                          <button
                            onClick={() => handleReturnOrder(order._id)}
                            className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 font-bold transition"
                          >
                            Request Return / Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MyOrders;