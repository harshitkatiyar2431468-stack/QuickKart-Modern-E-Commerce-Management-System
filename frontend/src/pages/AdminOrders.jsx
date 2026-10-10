import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import {
  ArrowLeft,
  Search,
  MapPin,
} from "lucide-react";

function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch customer orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status changed to ${newStatus} ✓`, "success");
      fetchOrders();
    } catch (error) {
      console.error(error);
      showToast("Failed to update order status", "error");
    }
  };

  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

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
      default:
        return "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filterStatus === "All" ||
      (order.status || "").toLowerCase() === filterStatus.toLowerCase();

    const matchesSearch =
      !search ||
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                  Order Management Console
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Manage shipping status, track customer deliveries and payment states.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                Gross Revenue:
              </span>
              <span className="font-heading font-black text-emerald-600 dark:text-emerald-400 text-lg">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <Search className="w-4 h-4 text-slate-400 pl-1" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name or Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none text-slate-800 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Status pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      filterStatus === st
                        ? "bg-slate-900 dark:bg-brand-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Orders Stack */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 skeleton-box rounded-3xl" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
              No orders found matching the selected criteria.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Order Reference
                        </span>
                        <p className="font-heading font-black text-slate-900 dark:text-white text-sm">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Customer
                        </span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {order.user?.name || "Customer"}{" "}
                          <span className="text-slate-400 font-normal">
                            ({order.user?.email || "N/A"})
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                      {/* Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value)
                        }
                        className="text-xs font-bold bg-white dark:bg-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-brand-500 cursor-pointer shadow-sm"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt} className="dark:bg-slate-900">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Items and Address Grid */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Items column */}
                    <div className="lg:col-span-8 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Ordered Items
                      </h4>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {order.items?.map((item) => (
                          <div
                            key={item._id || item.product?._id}
                            className="py-2.5 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product?.image}
                                alt={item.product?.name}
                                className="w-10 h-10 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-1"
                              />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">
                                  {item.product?.name || "Product"}
                                </p>
                                <span className="text-[11px] text-slate-400">
                                  Qty: {item.quantity} × ₹{item.price}
                                </span>
                              </div>
                            </div>
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Summary Column */}
                    <div className="lg:col-span-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-xs space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          Delivery Address
                        </h4>
                        {order.shippingAddress ? (
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            <strong>{order.shippingAddress.fullName}</strong>
                            <br />
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                            <br />
                            Phone: {order.shippingAddress.phone}
                          </p>
                        ) : (
                          <p className="text-slate-400">No address recorded</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Payment Mode</span>
                        <strong className="text-slate-900 dark:text-white">
                          {order.paymentMethod || "COD"}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-200/60 dark:border-slate-700">
                        <span>Total Paid</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-base">
                          ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminOrders;